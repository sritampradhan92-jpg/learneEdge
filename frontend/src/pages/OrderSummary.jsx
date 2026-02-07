import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCourses } from "../state/CourseContext.jsx";

export default function OrderSummary() {
  const navigate = useNavigate();
  const { currentOrder } = useCourses();

  if (!currentOrder) {
    return (
      <>
        <section className="page-header">
          <div className="container">
            <h1>Order Summary</h1>
            <p>Review your order before payment</p>
          </div>
        </section>

        <section className="auth-section">
          <div className="auth-container">
            <div className="auth-box">
              <h1>No Order Found</h1>
              <p className="auth-subtitle">
                You haven't selected any course for purchase.
              </p>
              <Link to="/courses" className="btn-submit" style={{ display: "block", textDecoration: "none", textAlign: "center" }}>
                Browse Courses
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const finalPrice = currentOrder.price - currentOrder.discount;

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Order Summary</h1>
          <p>Review your order before payment</p>
        </div>
      </section>

      <section className="auth-section">
        <div className="auth-container">
          <div className="auth-box">
            <h1>Order Details</h1>
            <p className="auth-subtitle">You are about to purchase the following course:</p>

            <div style={{ textAlign: "left", marginTop: "20px" }}>
              <div className="contact-item" style={{ marginBottom: "15px" }}>
                <div className="contact-icon">{currentOrder.icon}</div>
                <div>
                  <h3 style={{ margin: 0 }}>{currentOrder.title}</h3>
                </div>
              </div>

              <ul className="benefits-list">
                <li>
                  <strong>Original Price:</strong> ₹{currentOrder.price.toLocaleString("en-IN")}
                </li>
                <li>
                  <strong>Discount:</strong> - ₹{currentOrder.discount.toLocaleString("en-IN")}
                </li>
                <li>
                  <strong>Final Price:</strong> ₹{finalPrice.toLocaleString("en-IN")}
                </li>
              </ul>
            </div>

            <button
              type="button"
              className="btn-submit"
              onClick={() => navigate("/payment")}
              style={{ marginTop: "25px" }}
            >
              Proceed to Buy
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
