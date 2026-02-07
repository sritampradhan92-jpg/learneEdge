import React from "react";
import { useAuth } from "../state/AuthContext.jsx";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const mobile = localStorage.getItem("registeredMobile") || "Not provided";
  const email = localStorage.getItem("registeredEmail") || user?.email || "Not provided";

  return (
    <div className="contact-form-container">
      <h2>My Profile</h2>
      <div className="contact-details">
        <div className="contact-item">
          
          <div>
            <h3>Name</h3>
            <p>{user?.name || "Learner"}</p>
          </div>
        </div>
        <div className="contact-item">
      
          <div>
            <h3>Mobile No</h3>
            <p>{mobile}</p>
          </div>
        </div>
        <div className="contact-item">
          
          <div>
            <h3>Email</h3>
            <p>{email}</p>
          </div>
        </div>
      </div>
      <button type="button" className="btn-submit" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
