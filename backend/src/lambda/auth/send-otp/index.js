const { DynamoDBClient, PutItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' });
const sesClient = new SESClient({ region: 'ap-south-1' });

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
        const { email, fullName, mobile, password } = body;

        // Validate input
        if (!email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email is required' })
            };
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

        // Save OTP and user data to DynamoDB
        const otpData = {
            email: email,
            otp: otp,
            fullName: fullName || '',
            mobile: mobile || '',
            password: password || '',
            expiresAt: expiresAt,
            createdAt: new Date().toISOString(),
            verified: false
        };

        const putCommand = new PutItemCommand({
            TableName: process.env.DYNAMODB_OTP_TABLE,
            Item: marshall(otpData)
        });

        await dynamoClient.send(putCommand);

        // Send OTP via Email using SES
        const emailParams = {
            Source: process.env.SES_FROM_EMAIL,
            Destination: {
                ToAddresses: [email]
            },
            Message: {
                Subject: {
                    Data: 'LearnEdge - Your OTP Verification Code',
                    Charset: 'UTF-8'
                },
                Body: {
                    Html: {
                        Data: `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <style>
                                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                                    .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
                                    .header { text-align: center; color: #1e3a8a; }
                                    .otp-box { background: #ff6b35; color: white; font-size: 32px; padding: 20px; text-align: center; border-radius: 8px; letter-spacing: 8px; font-weight: bold; margin: 20px 0; }
                                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <h1 class="header">🎓 LearnEdge</h1>
                                    <h2>Email Verification</h2>
                                    <p>Hello${fullName ? ' ' + fullName : ''},</p>
                                    <p>Your OTP verification code is:</p>
                                    <div class="otp-box">${otp}</div>
                                    <p><strong>This code expires in 10 minutes.</strong></p>
                                    <p>If you didn't request this code, please ignore this email.</p>
                                    <div class="footer">
                                        <p>© 2026 LearnEdge. All rights reserved.</p>
                                    </div>
                                </div>
                            </body>
                            </html>
                        `,
                        Charset: 'UTF-8'
                    },
                    Text: {
                        Data: `Your LearnEdge OTP verification code is: ${otp}. This code expires in 10 minutes.`,
                        Charset: 'UTF-8'
                    }
                }
            }
        };

        await sesClient.send(new SendEmailCommand(emailParams));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'OTP sent successfully to your email',
                email: email,
                expiresIn: 600 // 10 minutes in seconds
            })
        };
    } catch (error) {
        console.error('Send OTP error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
