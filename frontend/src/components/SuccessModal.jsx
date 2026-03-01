import React from "react";

export default function SuccessModal({ open, message, onClose, buttonText = "Go to Dashboard" }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "20px",
      }}
    >
      <div className="auth-box" style={{ maxWidth: "420px", width: "100%" }}>
        <h1>Success</h1>
        <p className="auth-subtitle">{message}</p>
        <button type="button" className="btn-submit" onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
