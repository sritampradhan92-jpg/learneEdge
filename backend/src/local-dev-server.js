const http = require('http');
const { URL } = require('url');

const sendOtp = require('./lambda/auth/send-otp/index').handler;
const verifyOtp = require('./lambda/auth/verify-otp/index').handler;
const signup = require('./lambda/auth/signup/index').handler;
const login = require('./lambda/auth/login/index').handler;
const forgotPassword = require('./lambda/auth/forgot-password/index').handler;
const resetPassword = require('./lambda/auth/reset-password/index').handler;
const getCourses = require('./lambda/courses/get/index').handler;
const enrollCourse = require('./lambda/courses/enroll/index').handler;
const contact = require('./lambda/contact/index').handler;
const uploadAvatar = require('./lambda/files/upload-avatar/index').handler;

const PORT = Number(process.env.PORT || 3001);

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const routes = {
  'POST /auth/send-otp': sendOtp,
  'POST /auth/verify-otp': verifyOtp,
  'POST /auth/signup': signup,
  'POST /auth/login': login,
  'POST /auth/forgot-password': forgotPassword,
  'POST /auth/reset-password': resetPassword,
  'GET /courses': getCourses,
  'POST /courses/enroll': enrollCourse,
  'POST /contact': contact,
  'POST /files/upload-avatar': uploadAvatar
};

function normalizePath(pathname) {
  const withoutTrailing = pathname.replace(/\/+$/, '') || '/';

  if (withoutTrailing === '/prod') {
    return '/';
  }

  if (withoutTrailing.startsWith('/prod/')) {
    return withoutTrailing.slice('/prod'.length);
  }

  return withoutTrailing;
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      if (chunks.length === 0) {
        resolve('');
        return;
      }

      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    req.on('error', reject);
  });
}

function toQueryObject(searchParams) {
  const out = {};

  for (const [key, value] of searchParams.entries()) {
    out[key] = value;
  }

  return Object.keys(out).length > 0 ? out : null;
}

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const path = normalizePath(requestUrl.pathname);

    if (req.method === 'OPTIONS') {
      res.writeHead(204, defaultHeaders);
      res.end();
      return;
    }

    const routeKey = `${req.method} ${path}`;
    const handler = routes[routeKey];

    if (!handler) {
      res.writeHead(404, defaultHeaders);
      res.end(JSON.stringify({ error: `Route not found: ${routeKey}` }));
      return;
    }

    const bodyText = await readRequestBody(req);
    const event = {
      httpMethod: req.method,
      path,
      headers: req.headers,
      queryStringParameters: toQueryObject(requestUrl.searchParams),
      body: bodyText || null,
      isBase64Encoded: false
    };

    const result = await handler(event, {});
    const statusCode = Number(result?.statusCode || 200);
    const headers = { ...defaultHeaders, ...(result?.headers || {}) };
    const responseBody = typeof result?.body === 'string'
      ? result.body
      : JSON.stringify(result?.body || {});

    res.writeHead(statusCode, headers);
    res.end(responseBody);
  } catch (error) {
    console.error('Local server error:', error);
    res.writeHead(500, defaultHeaders);
    res.end(JSON.stringify({ error: error.message || 'Internal Server Error' }));
  }
});

server.listen(PORT, () => {
  console.log(`LearnEdge backend running locally on http://localhost:${PORT}`);
  console.log('Routes available:');
  Object.keys(routes).forEach((route) => console.log(`  - ${route}`));
});
