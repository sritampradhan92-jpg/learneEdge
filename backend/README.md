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

## Deployment Steps

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Build the SAM Template

```bash
sam build
```

This packages your Lambda functions for deployment.

### Step 3: Deploy

```bash
sam deploy --guided
```

The `--guided` flag walks you through the deployment process:

**Prompts you'll see:**
```
Stack Name: learnedge-backend
Region: ap-south-1
Confirm changes before deploy: y
Allow SAM CLI IAM role creation: y
Save parameters to samconfig.toml: y
```

**Example SAM deploy output:**
```
CloudFormation outputs from deployed stack
------------------------------------------------------
Key                 Value
------------------------------------------------------
ApiEndpoint         https://xxxxx.execute-api.ap-south-1.amazonaws.com/prod
SignupFunctionArn   arn:aws:lambda:ap-south-1:776312084756:function:learnedge-signup
LoginFunctionArn    arn:aws:lambda:ap-south-1:776312084756:function:learnedge-login
GetCoursesFunctionArn  arn:aws:lambda:ap-south-1:776312084756:function:learnedge-get-courses
... (more outputs)
```

### Step 4: Save the API Endpoint

After deployment, **SAVE this URL**:
```
https://xxxxx.execute-api.ap-south-1.amazonaws.com/prod
```

You'll use this in your React frontend.

---

## Frontend Integration

Update your React app to use the Lambda API:

### 1. Create `src/services/api.js`

```javascript
const API_URL = 'https://xxxxx.execute-api.ap-south-1.amazonaws.com/prod';

export const signup = async (email, password, fullName, mobile) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName, mobile })
  });
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

export const getCourses = async () => {
  const response = await fetch(`${API_URL}/courses`);
  return response.json();
};

export const enrollCourse = async (userId, courseId, courseTitle, token) => {
  const response = await fetch(`${API_URL}/courses/enroll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId, courseId, courseTitle })
  });
  return response.json();
};

export const submitContact = async (name, email, message) => {
  const response = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  });
  return response.json();
};

export const uploadAvatar = async (userId, imageData, fileName, token) => {
  const response = await fetch(`${API_URL}/files/upload-avatar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId, imageData, fileName })
  });
  return response.json();
};
```

### 2. Replace API_URL with Your Endpoint

After deployment, replace:
```javascript
const API_URL = 'https://xxxxx.execute-api.ap-south-1.amazonaws.com/prod';
```

with your actual endpoint from SAM deployment output.

---

## API Endpoints

### Authentication

#### Signup
```bash
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "fullName": "John Doe",
  "mobile": "+919876543210"
}

Response:
{
  "message": "User created successfully",
  "userId": "user@example.com",
  "email": "user@example.com"
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}

Response:
{
  "message": "Login successful",
  "accessToken": "eyJhbGci...",
  "idToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": {
    "userId": "user@example.com",
    "fullName": "John Doe",
    "email": "user@example.com",
    "mobile": "+919876543210",
    "avatar": null
  }
}
```

### Courses

#### Get All Courses
```bash
GET /courses

Response:
{
  "courses": [
    {
      "id": "course1",
      "title": "React Basics",
      "description": "Learn React fundamentals",
      "price": 99,
      "discount": 10,
      "instructor": "John Doe",
      ...
    }
  ],
  "count": 5
}
```

#### Enroll in Course
```bash
POST /courses/enroll
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "userId": "user@example.com",
  "courseId": "course1",
  "courseTitle": "React Basics"
}

Response:
{
  "message": "Course enrolled successfully",
  "enrollmentId": "uuid",
  "enrollment": {
    "userId": "user@example.com",
    "enrollmentId": "uuid",
    "courseId": "course1",
    "courseTitle": "React Basics",
    "enrolledAt": "2024-02-07T12:00:00Z",
    "status": "active",
    "progress": 0
  }
}
```

### Contact

#### Submit Contact Form
```bash
POST /contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I have a question about the courses"
}

Response:
{
  "message": "Contact message sent successfully",
  "contactId": "uuid"
}
```

### Files

#### Upload Avatar
```bash
POST /files/upload-avatar
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "userId": "user@example.com",
  "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
  "fileName": "avatar.jpg"
}

Response:
{
  "message": "Avatar uploaded successfully",
  "avatarUrl": "https://learnedge-files-776312084756.s3.ap-south-1.amazonaws.com/avatars/user@example.com/uuid-avatar.jpg"
}
```

---

## Local Testing

### Run Lambda Locally
```bash
sam local start-api
```

This starts a local API Gateway on `http://localhost:3000`

Test a function:
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "fullName": "Test User",
    "mobile": "+919876543210"
  }'
```

---

## Troubleshooting

### Deployment Fails
1. Check AWS credentials: `aws sts get-caller-identity`
2. Ensure IAM role has permissions (check IAM console)
3. Check CloudWatch logs: `aws logs tail /aws/lambda/learnedge-signup --follow`

### Lambda Error: "Cannot find module"
1. Ensure `package.json` has all dependencies
2. Run `npm install` in backend directory
3. Run `sam build` again

### Frontend Can't Connect to API
1. Check API endpoint URL is correct
2. Enable CORS (already configured in template.yaml)
3. Check Function logs in CloudWatch

### DynamoDB Item Not Found
1. Verify table names match environment variables
2. Check data was actually written to table
3. Use DynamoDB console to verify table structure

---

## Monitoring

### View Lambda Logs
```bash
# Real-time logs for signup function
aws logs tail /aws/lambda/learnedge-signup --follow

# View all Lambda logs
aws logs describe-log-groups --query 'logGroups[*].logGroupName'
```

### Monitor DynamoDB
```bash
# View DynamoDB metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/DynamoDB \
  --metric-name ConsumedWriteCapacityUnits \
  --dimensions Name=TableName,Value=learnedge-user-profiles \
  --start-time 2024-02-07T00:00:00Z \
  --end-time 2024-02-08T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

---

## Cleanup

To delete everything and stop incurring charges:

```bash
# Delete CloudFormation stack (deletes all Lambda, API Gateway, etc.)
aws cloudformation delete-stack --stack-name learnedge-backend

# Keep DynamoDB tables and S3 bucket for data persistence
# Or delete them manually if you want to start fresh:

# Delete DynamoDB tables
aws dynamodb delete-table --table-name learnedge-user-profiles
aws dynamodb delete-table --table-name learnedge-courses
aws dynamodb delete-table --table-name learnedge-enrollments
aws dynamodb delete-table --table-name learnedge-contacts

# Delete S3 bucket (must be empty first)
aws s3 rm s3://learnedge-files-776312084756 --recursive
aws s3 rb s3://learnedge-files-776312084756
```

---

## Next Steps

1. **Deploy this SAM template** to AWS
2. **Save the API endpoint** from deployment output
3. **Update frontend** with the API endpoint
4. **Test all endpoints** with Postman or curl
5. **Deploy frontend** to Netlify
6. **End-to-end testing** of the complete application

---

## Support

For issues or questions:
1. Check CloudWatch logs for Lambda errors
2. Verify environment variables in SAM template
3. Test API endpoints with Postman
4. Check IAM permissions

---

Good luck! 🚀
