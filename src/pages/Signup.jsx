import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import SuccessModal from "../components/SuccessModal.jsx";
import { sendOTPAPI, verifyOTPAPI } from "../services/api.js";

export default function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({ fullName: "", mobile: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Enter details, Step 2: Enter OTP
  const [otpSent, setOtpSent] = useState(false);

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setLocalError("");
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setLocalError("");
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validation
    if (!form.fullName || !form.mobile || !form.email || !form.password) {
      setLocalError("All fields are required");
      return;
    }

    if (form.password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await sendOTPAPI(form.email, form.password, form.fullName, form.mobile);
      setOtpSent(true);
      setStep(2);
    } catch (err) {
      setLocalError(err.message || "Failed to send OTP. Please try again.");
      console.error("Send OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!otp || otp.length !== 6) {
      setLocalError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await verifyOTPAPI(form.email, otp);
      setShowSuccess(true);
    } catch (err) {
      setLocalError(err.message || "Invalid OTP. Please try again.");
      console.error("Verify OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setLocalError("");
    setLoading(true);
    try {
      await sendOTPAPI(form.email, form.password, form.fullName, form.mobile);
      setLocalError(""); // Clear any previous errors
      alert("OTP sent successfully! Check your email.");
    } catch (err) {
      setLocalError(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
    navigate("/login");
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-box">
          <h1>Create Your Account</h1>
          <p className="auth-subtitle">
            {step === 1 
              ? "Join LearnEdge and start your learning journey today"
              : `Enter the 6-digit OTP sent to ${form.email}`
            }
          </p>

          {localError && <div style={{ color: "red", marginBottom: "15px" }}>{localError}</div>}

          {step === 1 ? (
            // Step 1: Enter Details Form
            <form className="auth-form" onSubmit={handleSendOTP}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  required
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="+919876543210"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  minLength={8}
                />
                <small style={{ color: "#666" }}>Minimum 8 characters</small>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            // Step 2: OTP Verification Form
            <form className="auth-form" onSubmit={handleVerifyOTP}>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  required
                  value={otp}
                  onChange={handleOtpChange}
                  disabled={loading}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  style={{ 
                    fontSize: "24px", 
                    letterSpacing: "8px", 
                    textAlign: "center",
                    fontWeight: "bold"
                  }}
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP & Create Account"}
              </button>

              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <button 
                  type="button" 
                  onClick={handleResendOTP}
                  disabled={loading}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4CAF50",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Resend OTP
                </button>
                <span style={{ margin: "0 10px", color: "#999" }}>|</span>
                <button 
                  type="button" 
                  onClick={() => { setStep(1); setOtp(""); }}
                  disabled={loading}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#666",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Change Email
                </button>
              </div>
            </form>
          )}

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        message="Your account has been created successfully! You can now login."
        onClose={handleCloseModal}
        buttonText="Go to Login"
      />
    </section>
  );
}
