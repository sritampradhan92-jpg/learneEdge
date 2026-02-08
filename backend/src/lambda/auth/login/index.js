const { CognitoIdentityProviderClient, AdminInitiateAuthCommand, AdminGetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const cognitoClient = new CognitoIdentityProviderClient({ region: 'ap-south-1' });
const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' });

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

exports.handler = async (event) => {
    console.log('Login request:', JSON.stringify(event));

    try {
        const body = JSON.parse(event.body);
        const { email, password } = body;

        if (!email || !password) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email and password required' })
            };
        }

        // Authenticate with Cognito
        const authCommand = new AdminInitiateAuthCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        });

        const authResponse = await cognitoClient.send(authCommand);

        // Get user profile from DynamoDB
        const getCommand = new GetItemCommand({
            TableName: process.env.DYNAMODB_USER_TABLE,
            Key: { userId: { S: email } }
        });

        const userResponse = await dynamoClient.send(getCommand);
        const user = unmarshall(userResponse.Item);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Login successful',
                accessToken: authResponse.AuthenticationResult.AccessToken,
                idToken: authResponse.AuthenticationResult.IdToken,
                refreshToken: authResponse.AuthenticationResult.RefreshToken,
                user: {
                    userId: email,
                    fullName: user.fullName,
                    email: user.email,
                    mobile: user.mobile,
                    avatar: user.avatar
                }
            })
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid credentials or user not found' })
        };
    }
};
