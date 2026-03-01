import React from "react";

export default function CourseCard({ course, onEnroll, actionLabel = "Enroll Now" }) {
  return (
    <div className="course-card">
      <div className="course-image">{course.icon}</div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      {onEnroll && (
        <button type="button" className="btn-enroll" onClick={onEnroll}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
