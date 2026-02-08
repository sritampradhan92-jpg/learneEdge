const { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

const cognitoClient = new CognitoIdentityProviderClient({ region: 'ap-south-1' });
const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' });

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

exports.handler = async (event) => {
    console.log('Signup request:', JSON.stringify(event));

    try {
        const body = JSON.parse(event.body);
        const { email, password, fullName, mobile } = body;

        // Validate input
        if (!email || !password || !fullName || !mobile) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Step 1: Create user in Cognito
        const cognitoParams = {
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: email,
            TemporaryPassword: password,
            MessageAction: 'SUPPRESS'
        };

        const createUserCommand = new AdminCreateUserCommand(cognitoParams);
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
            fullName,
            email,
            mobile,
            avatar: null,
            bio: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const putCommand = new PutItemCommand({
            TableName: process.env.DYNAMODB_USER_TABLE,
            Item: marshall(userProfile)
        });

        await dynamoClient.send(putCommand);

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                message: 'User created successfully',
                userId,
                email
            })
        };
    } catch (error) {
        console.error('Signup error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
