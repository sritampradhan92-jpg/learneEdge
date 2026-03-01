import React, { useState } from "react";
import { submitContactAPI } from "../services/api.js";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validation
    if (!form.name || !form.email || !form.message) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      // Call backend contact API
      await submitContactAPI(form.name, form.email, form.message);
      
      // Success
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again.");
      console.error("Contact submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>
                Have questions about our courses? Need help with enrollment? Our
                team is here to assist you.
              </p>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div>
                    <h3>Email</h3>
                    <p>support@learnedge.com</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div>
                    <h3>Phone</h3>
                    <p>+91 7788911019</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">🕐</div>
                  <div>
                    <h3>Business Hours</h3>
                    <p>Monday - Friday: 9AM - 6PM EST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <h2>Send Us a Message</h2>
              
              {success && (
                <div style={{ color: "green", marginBottom: "20px", padding: "10px", backgroundColor: "#e8f5e9", borderRadius: "4px" }}>
                  ✓ Thank you! Your message has been sent successfully.
                </div>
              )}
              
              {error && (
                <div style={{ color: "red", marginBottom: "20px", padding: "10px", backgroundColor: "#ffebee", borderRadius: "4px" }}>
                  ✗ {error}
                </div>
              )}
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
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
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    value={form.message}
                    onChange={handleChange}
                    disabled={loading}
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
