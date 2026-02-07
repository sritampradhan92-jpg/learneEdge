import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import SuccessModal from "../components/SuccessModal.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({ fullname: "", mobile: "", email: "", password: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store credentials for demo purposes (in real app, this would be an API call)
    localStorage.setItem("registeredEmail", form.email);
    localStorage.setItem("registeredPassword", form.password);
    localStorage.setItem("registeredName", form.fullname);
    localStorage.setItem("registeredMobile", form.mobile);
    setShowSuccess(true);
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

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                required
                value={form.fullname}
                onChange={handleChange}
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
                pattern="[0-9]{10}"
                
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
              />
            </div>

            <button type="submit" className="btn-submit">
              Sign Up
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        message="You have successfully created your account"
        onClose={handleCloseModal}
        buttonText="Go to Login"
      />
    </section>
  );
}
