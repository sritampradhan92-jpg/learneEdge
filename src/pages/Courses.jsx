import React from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard.jsx";
import { useCourses } from "../state/CourseContext.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export default function Courses() {
  const navigate = useNavigate();
  const { courses, setCurrentOrder, enrolledCourses } = useCourses();
  const { isAuthenticated } = useAuth();

  const handleEnroll = (course) => {
    if (!isAuthenticated) {
      alert("Please login to enroll.");
      navigate("/login");
      return;
    }

    if (enrolledCourses.find((c) => c.id === course.id)) {
      alert("You are already enrolled in this course.");
      return;
    }

    setCurrentOrder(course);
    navigate("/order-summary");
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Our Courses</h1>
          <p>Explore our wide range of courses designed to help you succeed</p>
        </div>
      </section>

      <section className="courses-section">
        <div className="container">
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={() => handleEnroll(course)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
