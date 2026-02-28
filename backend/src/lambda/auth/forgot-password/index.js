const { CognitoIdentityProviderClient, ForgotPasswordCommand } = require('@aws-sdk/client-cognito-identity-provider');

const cognitoClient = new CognitoIdentityProviderClient({ region: 'ap-south-1' });

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

exports.handler = async (event) => {
    console.log('Forgot Password request:', JSON.stringify(event));

    try {
        const body = JSON.parse(event.body);
        const { email } = body;

        // Validate input
        if (!email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email is required' })
            };
        }

        // Send forgot password code via Cognito
        const forgotPasswordCommand = new ForgotPasswordCommand({
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: email
        });

        await cognitoClient.send(forgotPasswordCommand);
        console.log('Password reset code sent to:', email);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Password reset code sent to your email',
                email: email
            })
        };

    } catch (error) {
        console.error('Forgot Password error:', error);

        // Handle specific Cognito errors
        if (error.name === 'UserNotFoundException') {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'No account found with this email address' })
            };
        }

        if (error.name === 'LimitExceededException') {
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({ error: 'Too many attempts. Please try again later.' })
            };
        }

        if (error.name === 'InvalidParameterException') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid email format' })
            };
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || 'Failed to send reset code' })
        };
    }
};
