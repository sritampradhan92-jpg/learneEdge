# LearnEdge Backend - AWS Serverless

Complete serverless backend for LearnEdge using AWS Lambda, DynamoDB, S3, and Cognito.

## Project Structure

```
backend/
├── src/lambda/
│   ├── auth/
│   │   ├── signup/index.js       (Create user in Cognito + DynamoDB)
│   │   └── login/index.js        (Authenticate user)
│   ├── courses/
│   │   ├── get/index.js          (Fetch all courses)
│   │   └── enroll/index.js       (Enroll in course)
│   ├── contact/
│   │   └── index.js              (Submit contact form)
│   └── files/
│       └── upload-avatar/index.js (Upload profile picture to S3)
├── template.yaml                  (SAM Infrastructure template)
├── package.json                   (Dependencies)
└── README.md                      (This file)
```

## AWS Resources Created

### Cognito
- **User Pool ID**: `ap-south-1_bJbzPkH04`
- **App Client ID**: `47fm2r0e8ef2rshne11qr7fr8`

### DynamoDB Tables
- `learnedge-user-profiles` - User profile data
- `learnedge-courses` - Course catalog
- `learnedge-enrollments` - Course enrollments
- `learnedge-contacts` - Contact form submissions

### S3 Bucket
- `learnedge-files-776312084756` - Avatar uploads

### Lambda Functions (6 Total)
1. **learnedge-signup** - `POST /auth/signup`
2. **learnedge-login** - `POST /auth/login`
3. **learnedge-get-courses** - `GET /courses`
4. **learnedge-enroll-course** - `POST /courses/enroll`
5. **learnedge-contact** - `POST /contact`
6. **learnedge-upload-avatar** - `POST /files/upload-avatar`

## Prerequisites

1. **AWS Account** with access to:
   - Lambda
   - DynamoDB
   - S3
   - API Gateway
   - Cognito
   - CloudWatch
   - IAM

2. **AWS CLI** installed and configured
   ```bash
   aws --version
   ```

3. **SAM CLI** installed
   ```bash
   # Install SAM CLI
   # Windows (with Chocolatey)
   choco install aws-sam-cli
   
   # Or download from: https://aws.amazon.com/serverless/sam/
   ```

4. **Node.js 18+**
   ```bash
   node --version
   ```


