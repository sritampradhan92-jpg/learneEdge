import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCourses } from "../state/CourseContext.jsx";
import SuccessModal from "../components/SuccessModal.jsx";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: "📱" },
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "wallet", label: "Wallet", icon: "👛" },
  { id: "netbanking", label: "Net Banking", icon: "🏦" },
];

export default function Payment() {
  const navigate = useNavigate();
  const { currentOrder, addEnrollment, clearOrder } = useCourses();
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!currentOrder && !showSuccess) {
    return (
      <>
        <section className="page-header">
          <div className="container">
            <h1>Payment</h1>
            <p>Complete your purchase</p>
          </div>
        </section>

        <section className="auth-section">
          <div className="auth-container">
            <div className="auth-box">
              <h1>No Order</h1>
              <p className="auth-subtitle">No order to process.</p>
              <Link to="/courses" className="btn-submit" style={{ display: "block", textDecoration: "none", textAlign: "center" }}>
                Browse Courses
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const handlePay = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      addEnrollment(currentOrder);
      clearOrder();
      setProcessing(false);
      setShowSuccess(true);
    }, 1500);
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
    navigate("/dashboard");
  };

  const finalPrice = currentOrder ? currentOrder.price - currentOrder.discount : 0;

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Payment</h1>
          <p>Complete your purchase</p>
        </div>
      </section>

      <section className="auth-section">
        <div className="auth-container">
          <div className="auth-box">
            <h1>Choose Payment Method</h1>
            <p className="auth-subtitle">
              Select a payment method to pay ₹{finalPrice.toLocaleString("en-IN")}
            </p>

            <div style={{ textAlign: "left", marginTop: "20px" }}>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="contact-item"
                  style={{
                    cursor: "pointer",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    border:
                      selectedMethod === method.id
                        ? "2px solid #4A90E2"
                        : "2px solid #e0e0e0",
                    backgroundColor:
                      selectedMethod === method.id ? "#f0f7ff" : "transparent",
                  }}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="contact-icon">{method.icon}</div>
                  <div>
                    <h3 style={{ margin: 0 }}>{method.label}</h3>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-submit"
              onClick={handlePay}
              disabled={processing}
              style={{ marginTop: "25px" }}
            >
              {processing ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </section>

      <SuccessModal
        open={showSuccess}
        message="You have successfully enrolled in this course"
        onClose={handleCloseModal}
      />
    </>
  );
}
