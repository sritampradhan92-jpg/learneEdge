const { CognitoIdentityProviderClient, ConfirmForgotPasswordCommand } = require('@aws-sdk/client-cognito-identity-provider');

const cognitoClient = new CognitoIdentityProviderClient({ region: 'ap-south-1' });

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

exports.handler = async (event) => {
    console.log('Reset Password request:', JSON.stringify(event));

    try {
        const body = JSON.parse(event.body);
        const { email, code, newPassword } = body;

        // Validate input
        if (!email || !code || !newPassword) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email, verification code, and new password are required' })
            };
        }

        if (newPassword.length < 8) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Password must be at least 8 characters' })
            };
        }

        // Confirm forgot password with new password
        const confirmForgotPasswordCommand = new ConfirmForgotPasswordCommand({
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: email,
            ConfirmationCode: code,
            Password: newPassword
        });

        await cognitoClient.send(confirmForgotPasswordCommand);
        console.log('Password reset successful for:', email);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Password reset successful! You can now login with your new password.',
                email: email
            })
        };

    } catch (error) {
        console.error('Reset Password error:', error);

        // Handle specific Cognito errors
        if (error.name === 'CodeMismatchException') {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid verification code. Please check and try again.' })
            };
        }

        if (error.name === 'ExpiredCodeException') {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Verification code has expired. Please request a new one.' })
            };
        }

        if (error.name === 'InvalidPasswordException') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters' 
                })
            };
        }

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

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || 'Failed to reset password' })
        };
    }
};
