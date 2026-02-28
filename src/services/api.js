// ========== API CONFIGURATION ==========
// Replace with your actual API endpoint from SAM deployment
const API_URL = 'https://u5djgw8ood.execute-api.ap-south-1.amazonaws.com/prod';

// ========== HELPER FUNCTION ==========
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API Error: ${response.status}`);
  }
  return await response.json();
};

// ========== AUTH APIs ==========

export const signupAPI = async (email, password, fullName, mobile) => {
  return fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName, mobile })
  }).then(handleResponse);
};

// Send OTP for email verification
export const sendOTPAPI = async (email, password, fullName, mobile) => {
  return fetch(`${API_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName, mobile })
  }).then(handleResponse);
};

// Verify OTP and create account
export const verifyOTPAPI = async (email, otp) => {
  return fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  }).then(handleResponse);
};

export const loginAPI = async (email, password) => {
  return fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(handleResponse);
};

// Forgot Password - Send reset code
export const forgotPasswordAPI = async (email) => {
  return fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  }).then(handleResponse);
};

// Reset Password - Verify code and set new password
export const resetPasswordAPI = async (email, code, newPassword) => {
  return fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPassword })
  }).then(handleResponse);
};

// ========== COURSE APIs ==========

export const getCoursesAPI = async () => {
  try {
    const response = await fetch(`${API_URL}/courses`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const enrollCourseAPI = async (userId, courseId, courseTitle, token) => {
  return fetch(`${API_URL}/courses/enroll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId, courseId, courseTitle })
  }).then(handleResponse);
};

// ========== CONTACT API ==========

export const submitContactAPI = async (name, email, message) => {
  return fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  }).then(handleResponse);
};

// ========== FILE UPLOAD API ==========

export const uploadAvatarAPI = async (userId, imageData, fileName, token) => {
  return fetch(`${API_URL}/files/upload-avatar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId, imageData, fileName })
  }).then(handleResponse);
};
