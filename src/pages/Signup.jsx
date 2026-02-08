import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import SuccessModal from "../components/SuccessModal.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loading, error, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ fullName: "", mobile: "", email: "", password: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [localError, setLocalError] = useState("");

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validation
    if (!form.fullName || !form.mobile || !form.email || !form.password) {
      setLocalError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    try {
      // Call backend signup API
      await signup(form.email, form.password, form.fullName, form.mobile);
      
      // Success - show modal
      setShowSuccess(true);
    } catch (err) {
      setLocalError(err.message || "Signup failed. Please try again.");
      console.error("Signup error:", err);
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
            Join LearnEdge and start your learning journey today
          </p>

          {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}
          {localError && <div style={{ color: "red", marginBottom: "15px" }}>{localError}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
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
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        message="You have successfully created your account. Please login to continue."
        onClose={handleCloseModal}
        buttonText="Go to Login"
      />
    </section>
  );
}
