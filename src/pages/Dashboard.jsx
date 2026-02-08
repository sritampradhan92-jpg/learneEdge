import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import CourseCard from "../components/CourseCard.jsx";
import { useCourses } from "../state/CourseContext.jsx";
import { useAuth } from "../state/AuthContext.jsx";
import { uploadAvatarAPI } from "../services/api.js";

export default function Dashboard() {
  const { enrolledCourses } = useCourses();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem("userAvatarUrl") || null);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setUploadError("File size must be less than 5MB");
      setTimeout(() => setUploadError(""), 5000);
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Only JPG, PNG, and GIF files are allowed");
      setTimeout(() => setUploadError(""), 5000);
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result; // This is the data URL (with prefix)
        
        // Get userId and token from localStorage
        const userId = user?.userId || user?.email || localStorage.getItem("userId");
        const token = localStorage.getItem("accessToken");

        if (!userId || !token) {
          setUploadError("User not authenticated. Please login again.");
          setUploading(false);
          return;
        }

        try {
          // Call the S3 upload API
          const response = await uploadAvatarAPI(userId, base64Data, file.name, token);
          
          // Store the avatar URL in localStorage and state
          if (response.avatarUrl) {
            setAvatarUrl(response.avatarUrl);
            localStorage.setItem("userAvatarUrl", response.avatarUrl);
            setProfilePicture(base64Data);
            setUploadSuccess("Avatar uploaded successfully!");
            
            // Clear success message after 3 seconds
            setTimeout(() => setUploadSuccess(""), 3000);
          }
        } catch (error) {
          console.error("Upload error:", error);
          setUploadError(error.message || "Failed to upload avatar. Please try again.");
          setTimeout(() => setUploadError(""), 5000);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("File read error:", error);
      setUploadError("Error reading file. Please try again.");
      setUploading(false);
      setTimeout(() => setUploadError(""), 5000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const storedProfilePicture = localStorage.getItem("userProfilePicture");
  const displayProfilePicture = profilePicture || avatarUrl || storedProfilePicture;

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
                    cursor: uploading ? "not-allowed" : "pointer",
                    marginBottom: "15px",
                    fontWeight: "bold",
                    opacity: uploading ? 0.6 : 1
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
                  
                  {/* Error Message */}
                  {uploadError && (
                    <div style={{
                      padding: "10px 15px",
                      backgroundColor: "#f8d7da",
                      color: "#721c24",
                      borderRadius: "4px",
                      marginBottom: "15px",
                      fontSize: "14px",
                      border: "1px solid #f5c6cb"
                    }}>
                      {uploadError}
                    </div>
                  )}

                  {/* Success Message */}
                  {uploadSuccess && (
                    <div style={{
                      padding: "10px 15px",
                      backgroundColor: "#d4edda",
                      color: "#155724",
                      borderRadius: "4px",
                      marginBottom: "15px",
                      fontSize: "14px",
                      border: "1px solid #c3e6cb"
                    }}>
                      {uploadSuccess}
                    </div>
                  )}

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
