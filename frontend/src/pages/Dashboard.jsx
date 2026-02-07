import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import CourseCard from "../components/CourseCard.jsx";
import { useCourses } from "../state/CourseContext.jsx";

export default function Dashboard() {
  const { enrolledCourses } = useCourses();
  const navigate = useNavigate();

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
