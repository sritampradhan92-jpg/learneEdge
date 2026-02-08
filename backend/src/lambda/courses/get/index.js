const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' });

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

exports.handler = async (event) => {
    console.log('Get courses request');

    try {
        // Fetch all courses from DynamoDB
        const scanCommand = new ScanCommand({
            TableName: process.env.DYNAMODB_COURSES_TABLE,
            Limit: 100
        });

        const response = await dynamoClient.send(scanCommand);
        
        // Convert DynamoDB format to regular objects
        const courses = response.Items.map(item => unmarshall(item));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                courses,
                count: courses.length
            })
        };
    } catch (error) {
        console.error('Get courses error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
