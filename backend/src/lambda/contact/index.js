const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const crypto = require('crypto');

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' });

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

exports.handler = async (event) => {
    console.log('Contact form request:', JSON.stringify(event));

    try {
        const body = JSON.parse(event.body);
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Create contact record
        const contactId = crypto.randomUUID();
        const contact = {
            id: contactId,
            name,
            email,
            message,
            createdAt: new Date().toISOString(),
            status: 'new'
        };

        const putCommand = new PutItemCommand({
            TableName: process.env.DYNAMODB_CONTACTS_TABLE,
            Item: marshall(contact)
        });

        await dynamoClient.send(putCommand);

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                message: 'Contact message sent successfully',
                contactId
            })
        };
    } catch (error) {
        console.error('Contact error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
