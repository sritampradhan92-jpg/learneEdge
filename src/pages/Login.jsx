import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

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
    
    // Check if credentials match registered user
    const registeredEmail = localStorage.getItem("registeredEmail");
    const registeredPassword = localStorage.getItem("registeredPassword");
    const registeredName = localStorage.getItem("registeredName");
    const registeredMobile = localStorage.getItem("registeredMobile");
    
    if (registeredEmail && registeredPassword) {
      if (form.email === registeredEmail && form.password === registeredPassword) {
        login({ 
          email: form.email, 
          fullName: registeredName || form.email.split("@")[0],
          mobile: registeredMobile || ""
        });
        navigate("/dashboard");
      } else {
        alert("Invalid email or password. Please try again.");
      }
    } else {
      // For demo: allow login if no registered user exists
      login({ 
        email: form.email, 
        fullName: form.email.split("@")[0],
        mobile: ""
      });
      navigate("/dashboard");
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-box">
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Login to continue your learning journey</p>

          <form className="auth-form" onSubmit={handleSubmit}>
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
              Login
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
