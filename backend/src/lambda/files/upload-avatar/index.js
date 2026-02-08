const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const crypto = require('crypto');

const s3Client = new S3Client({ region: 'ap-south-1' });
const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' });

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

exports.handler = async (event) => {
    console.log('Upload avatar request:', JSON.stringify(event));

    try {
        // Parse base64 image data
        const { userId, imageData, fileName } = JSON.parse(event.body);

        if (!userId || !imageData || !fileName) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Decode base64 image
        const buffer = Buffer.from(imageData.split(',')[1], 'base64');
        const key = `avatars/${userId}/${crypto.randomUUID()}-${fileName}`;

        // Upload to S3
        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: 'image/jpeg',
            ACL: 'public-read'
        });

        await s3Client.send(uploadCommand);

        // Generate public S3 URL
        const avatarUrl = `https://${process.env.S3_BUCKET}.s3.ap-south-1.amazonaws.com/${key}`;

        // Update user profile with avatar URL
        const updateCommand = new UpdateItemCommand({
            TableName: process.env.DYNAMODB_USER_TABLE,
            Key: { userId: { S: userId } },
            UpdateExpression: 'SET avatar = :avatar, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':avatar': { S: avatarUrl },
                ':updatedAt': { S: new Date().toISOString() }
            }
        });

        await dynamoClient.send(updateCommand);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Avatar uploaded successfully',
                avatarUrl
            })
        };
    } catch (error) {
        console.error('Upload error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
