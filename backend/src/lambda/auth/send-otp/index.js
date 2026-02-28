const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { CognitoIdentityProviderClient, SignUpCommand, ResendConfirmationCodeCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { marshall } = require('@aws-sdk/util-dynamodb');

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' });
const cognitoClient = new CognitoIdentityProviderClient({ region: 'ap-south-1' });

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

exports.handler = async (event) => {
    console.log('Send OTP request:', JSON.stringify(event));

    try {
        const body = JSON.parse(event.body);
        const { email, password, fullName, mobile } = body;

        // Validate input
        if (!email || !password || !fullName || !mobile) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'All fields are required' })
            };
        }

        if (password.length < 8) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Password must be at least 8 characters' })
            };
        }

        // Store user details in DynamoDB for later use during verification
        const userData = {
            email: email,
            fullName: fullName,
            mobile: mobile,
            password: password,
            createdAt: new Date().toISOString()
        };

        await dynamoClient.send(new PutItemCommand({
            TableName: process.env.DYNAMODB_OTP_TABLE,
            Item: marshall(userData)
        }));

        // Try to sign up user with Cognito (this sends verification code automatically)
        try {
            // Format phone number to E.164 format if not already
            let formattedPhone = mobile;
            if (!mobile.startsWith('+')) {
                formattedPhone = '+91' + mobile.replace(/^0+/, ''); // Default to India
            }

            const signUpCommand = new SignUpCommand({
                ClientId: process.env.COGNITO_CLIENT_ID,
                Username: email,
                Password: password,
                UserAttributes: [
                    { Name: 'email', Value: email },
                    { Name: 'name', Value: fullName },
                    { Name: 'phone_number', Value: formattedPhone }
                ]
            });

            await cognitoClient.send(signUpCommand);
            console.log('User signup initiated, verification code sent to:', email);

        } catch (cognitoError) {
            // If user already exists but not confirmed, resend the code
            if (cognitoError.name === 'UsernameExistsException') {
                try {
                    // Try to resend confirmation code
                    await cognitoClient.send(new ResendConfirmationCodeCommand({
                        ClientId: process.env.COGNITO_CLIENT_ID,
                        Username: email
                    }));
                    console.log('Resent verification code to:', email);
                } catch (resendError) {
                    // User might already be confirmed
                    if (resendError.name === 'InvalidParameterException' || 
                        resendError.message?.includes('confirmed')) {
                        return {
                            statusCode: 409,
                            headers,
                            body: JSON.stringify({ 
                                error: 'An account with this email already exists. Please login instead.' 
                            })
                        };
                    }
                    throw resendError;
                }
            } else {
                throw cognitoError;
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Verification code sent to your email',
                email: email
            })
        };

    } catch (error) {
        console.error('Send OTP error:', error);

        // Handle specific Cognito errors
        if (error.name === 'InvalidPasswordException') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters' 
                })
            };
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || 'Failed to send verification code' })
        };
    }
};
