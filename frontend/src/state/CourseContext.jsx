import React, { createContext, useContext, useMemo, useState } from "react";
import { courses } from "../utils/courseData.js";

const CourseContext = createContext(null);

export function CourseProvider({ children }) {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const addEnrollment = (course) => {
    setEnrolledCourses((prev) => {
      if (prev.find((item) => item.id === course.id)) {
        return prev;
      }
      return [...prev, course];
    });
  };

  const clearOrder = () => {
    setCurrentOrder(null);
  };

  const value = useMemo(
    () => ({
      courses,
      currentOrder,
      enrolledCourses,
      setCurrentOrder,
      addEnrollment,
      clearOrder,
    }),
    [currentOrder, enrolledCourses]
  );

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourses must be used within CourseProvider");
  }
  return context;
}
