const { DynamoDBClient, GetItemCommand, DeleteItemCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { CognitoIdentityProviderClient, ConfirmSignUpCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' });
const cognitoClient = new CognitoIdentityProviderClient({ region: 'ap-south-1' });

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

exports.handler = async (event) => {
    console.log('Verify OTP request:', JSON.stringify(event));

    try {
        const body = JSON.parse(event.body);
        const { email, otp } = body;

        // Validate input
        if (!email || !otp) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email and verification code are required' })
            };
        }

        // Get user data from DynamoDB
        const getCommand = new GetItemCommand({
            TableName: process.env.DYNAMODB_OTP_TABLE,
            Key: marshall({ email: email })
        });

        const userData = await dynamoClient.send(getCommand);

        if (!userData.Item) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'User data not found. Please signup again.' })
            };
        }

        const userInfo = unmarshall(userData.Item);

        // Confirm signup with Cognito using the verification code
        try {
            const confirmCommand = new ConfirmSignUpCommand({
                ClientId: process.env.COGNITO_CLIENT_ID,
                Username: email,
                ConfirmationCode: otp
            });

            await cognitoClient.send(confirmCommand);
            console.log('User confirmed successfully:', email);

        } catch (cognitoError) {
            console.error('Cognito confirm error:', cognitoError);

            if (cognitoError.name === 'CodeMismatchException') {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Invalid verification code. Please check and try again.' })
                };
            }

            if (cognitoError.name === 'ExpiredCodeException') {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Verification code has expired. Please request a new one.' })
                };
            }

            if (cognitoError.name === 'NotAuthorizedException') {
                return {
                    statusCode: 409,
                    headers,
                    body: JSON.stringify({ error: 'Account already verified. Please login instead.' })
                };
            }

            throw cognitoError;
        }

        // Save user profile to DynamoDB
        const userProfile = {
            userId: email,
            fullName: userInfo.fullName || '',
            email: email,
            mobile: userInfo.mobile || '',
            avatar: null,
            bio: '',
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await dynamoClient.send(new PutItemCommand({
            TableName: process.env.DYNAMODB_USER_TABLE,
            Item: marshall(userProfile)
        }));

        // Delete temporary user data
        await dynamoClient.send(new DeleteItemCommand({
            TableName: process.env.DYNAMODB_OTP_TABLE,
            Key: marshall({ email: email })
        }));

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                message: 'Account created successfully! You can now login.',
                email: email,
                fullName: userInfo.fullName
            })
        };

    } catch (error) {
        console.error('Verify OTP error:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || 'Verification failed' })
        };
    }
};
