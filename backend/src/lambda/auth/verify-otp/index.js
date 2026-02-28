const { DynamoDBClient, GetItemCommand, DeleteItemCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand } = require('@aws-sdk/client-cognito-identity-provider');
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
                body: JSON.stringify({ error: 'Email and OTP are required' })
            };
        }

        // Get OTP data from DynamoDB
        const getCommand = new GetItemCommand({
            TableName: process.env.DYNAMODB_OTP_TABLE,
            Key: marshall({ email: email })
        });

        const otpResponse = await dynamoClient.send(getCommand);

        if (!otpResponse.Item) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'OTP not found. Please request a new OTP.' })
            };
        }

        const otpData = unmarshall(otpResponse.Item);

        // Check if OTP expired
        if (new Date() > new Date(otpData.expiresAt)) {
            // Delete expired OTP
            await dynamoClient.send(new DeleteItemCommand({
                TableName: process.env.DYNAMODB_OTP_TABLE,
                Key: marshall({ email: email })
            }));

            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'OTP has expired. Please request a new OTP.' })
            };
        }

        // Check if OTP matches
        if (otpData.otp !== otp) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid OTP. Please check and try again.' })
            };
        }

        // OTP is valid! Now create user in Cognito
        const { fullName, mobile, password } = otpData;

        if (!fullName || !mobile || !password) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing user details. Please signup again.' })
            };
        }

        // Step 1: Create user in Cognito
        const createUserCommand = new AdminCreateUserCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: email,
            TemporaryPassword: password,
            MessageAction: 'SUPPRESS',
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'email_verified', Value: 'true' }
            ]
        });

        const cognitoUser = await cognitoClient.send(createUserCommand);
        const userId = cognitoUser.User.Username;

        // Step 2: Set permanent password
        const setPasswordCommand = new AdminSetUserPasswordCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: email,
            Password: password,
            Permanent: true
        });

        await cognitoClient.send(setPasswordCommand);

        // Step 3: Save user profile to DynamoDB
        const userProfile = {
            userId: email,
            fullName: fullName,
            email: email,
            mobile: mobile,
            avatar: null,
            bio: '',
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const putUserCommand = new PutItemCommand({
            TableName: process.env.DYNAMODB_USER_TABLE,
            Item: marshall(userProfile)
        });

        await dynamoClient.send(putUserCommand);

        // Step 4: Delete used OTP
        await dynamoClient.send(new DeleteItemCommand({
            TableName: process.env.DYNAMODB_OTP_TABLE,
            Key: marshall({ email: email })
        }));

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                message: 'Account created successfully! You can now login.',
                userId: userId,
                email: email,
                fullName: fullName
            })
        };
    } catch (error) {
        console.error('Verify OTP error:', error);

        // Handle Cognito user already exists error
        if (error.name === 'UsernameExistsException') {
            return {
                statusCode: 409,
                headers,
                body: JSON.stringify({ error: 'An account with this email already exists. Please login instead.' })
            };
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
