import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import CourseCard from "../components/CourseCard.jsx";
import { useCourses } from "../state/CourseContext.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export default function Dashboard() {
  const { enrolledCourses } = useCourses();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        // TODO: Upload to S3 when backend is ready
        localStorage.setItem("userProfilePicture", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const storedProfilePicture = localStorage.getItem("userProfilePicture");
  const displayProfilePicture = profilePicture || storedProfilePicture;

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Student Dashboard</h1>
          <p>Track your progress and continue learning</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-content">
            {/* My Profile Section */}
            <div className="contact-info" style={{ marginBottom: "40px" }}>
              <h2>My Profile</h2>
              <div style={{ 
                maxWidth: "500px", 
                padding: "30px", 
                backgroundColor: "#f8f9fa", 
                borderRadius: "8px",
                textAlign: "center"
              }}>
                {/* Profile Picture */}
                <div style={{ marginBottom: "30px" }}>
                  <div style={{
                    width: "120px",
                    height: "120px",
                    margin: "0 auto 20px",
                    borderRadius: "50%",
                    backgroundColor: "#e9ecef",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    border: "3px solid #ff9800"
                  }}>
                    {displayProfilePicture ? (
                      <img 
                        src={displayProfilePicture} 
                        alt="Profile"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ fontSize: "50px" }}>👤</span>
                    )}
                  </div>

                  {/* Upload Button */}
                  <label style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    backgroundColor: "#ff9800",
                    color: "white",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginBottom: "15px",
                    fontWeight: "bold"
                  }}>
                    {uploading ? "Uploading..." : "Upload Picture"}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleProfilePictureChange}
                      style={{ display: "none" }}
                      disabled={uploading}
                    />
                  </label>
                  <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
                    Max 5MB. Formats: JPG, PNG, GIF
                  </p>
                </div>

                {/* User Info */}
                <div style={{ textAlign: "left" }}>
                  <div style={{ marginBottom: "20px" }}>
                    <strong style={{ display: "block", color: "#666", marginBottom: "5px" }}>Name</strong>
                    <p style={{ margin: "0", fontSize: "16px", color: "#333" }}>
                      {user?.fullName || "Your Name"}
                    </p>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <strong style={{ display: "block", color: "#666", marginBottom: "5px" }}>Mobile No</strong>
                    <p style={{ margin: "0", fontSize: "16px", color: "#333" }}>
                      {user?.mobile || "Not provided"}
                    </p>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <strong style={{ display: "block", color: "#666", marginBottom: "5px" }}>Email</strong>
                    <p style={{ margin: "0", fontSize: "16px", color: "#333" }}>
                      {user?.email || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#ff9800",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginTop: "20px",
                    transition: "background-color 0.3s"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#e68900"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#ff9800"}
                >
                  Logout
                </button>
              </div>
            </div>

            {/* My Enrolled Courses Section */}
            <div className="contact-info">
              <h2>My Enrolled Courses</h2>
              {enrolledCourses.length === 0 ? (
                <>
                  <p>
                    You haven't enrolled in any courses yet. Start exploring our
                    courses today!
                  </p>
                  <Link to="/courses" className="btn-primary" style={{ marginTop: "20px", display: "inline-block" }}>
                    Browse Courses
                  </Link>
                </>
              ) : (
                <div className="courses-grid" style={{ marginTop: "30px" }}>
                  {enrolledCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      actionLabel="View Course"
                      onEnroll={() => {
                        navigate(`/course/${course.id}`);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <Sidebar />
          </div>
        </div>
      </section>
    </>
  );
}
