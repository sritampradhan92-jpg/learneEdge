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
    console.log('Enroll course request:', JSON.stringify(event));

    try {
        const body = JSON.parse(event.body);
        const { userId, courseId, courseTitle } = body;

        if (!userId || !courseId || !courseTitle) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Create enrollment record
        const enrollmentId = crypto.randomUUID();
        const enrollment = {
            userId,
            enrollmentId,
            courseId,
            courseTitle,
            enrolledAt: new Date().toISOString(),
            status: 'active',
            progress: 0
        };

        const putCommand = new PutItemCommand({
            TableName: process.env.DYNAMODB_ENROLLMENTS_TABLE,
            Item: marshall(enrollment)
        });

        await dynamoClient.send(putCommand);

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                message: 'Course enrolled successfully',
                enrollmentId,
                enrollment
            })
        };
    } catch (error) {
        console.error('Enroll error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
