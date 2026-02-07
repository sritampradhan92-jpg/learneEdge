import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useCourses } from "../state/CourseContext.jsx";

export default function CourseDetails() {
  const { courseId } = useParams();
  const { enrolledCourses, courses } = useCourses();

  // Find the course from enrolled courses or all courses
  const course = enrolledCourses.find((c) => c.id === courseId) || 
                 courses.find((c) => c.id === courseId);

  const isEnrolled = enrolledCourses.some((c) => c.id === courseId);

  if (!course) {
    return <Navigate to="/dashboard" replace />;
  }

  // Course batch details (can be customized per course in future)
  const batchDetails = {
    duration: {
      start: "09 February 2026",
      end: "10 April 2026",
    },
    validity: "31 August 2026",
    mode: "Recorded",
    schedule: "3 Classes per day, 6 days a week",
    subjects: getSubjectsForCourse(course.id),
  };

  const videos = getVideosForCourse(course.id);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="content-box">
            <h2>This Batch Includes</h2>
            
            <div className="contact-details" style={{ marginTop: "30px" }}>
              <div className="contact-item">
                <div className="contact-icon">📅</div>
                <div>
                  <h3>Course Duration:</h3>
                  <p>{batchDetails.duration.start} - {batchDetails.duration.end}</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">⭐</div>
                <div>
                  <h3>Validity:</h3>
                  <p>{batchDetails.validity}</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">⭐</div>
                <div>
                  <h3>Mode of Lectures:</h3>
                  <p>{batchDetails.mode}</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">⭐</div>
                <div>
                  <h3>Class Schedule:</h3>
                  <p>{batchDetails.schedule}</p>
                </div>
              </div>

              

              <div className="contact-item">
                <div className="contact-icon">📚</div>
                <div>
                  <h3>Subjects:</h3>
                  <p>{batchDetails.subjects}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="content-box">
            <h2>Recorded Lectures</h2>
            
            <div className="courses-grid" style={{ marginTop: "30px" }}>
              {videos.map((video, index) => (
                <a
                  key={index}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <div className="course-card" style={{ cursor: "pointer" }}>
                    <div className="course-image">🎬</div>
                    <h3>{video.title}</h3>
                    <p style={{ color: "#666", fontSize: "14px" }}>
                      📅 {video.date}
                    </p>
                    <button type="button" className="btn-enroll">
                      Watch Now
                    </button>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "40px" }}>
            <Link to="/dashboard" className="btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function getSubjectsForCourse(courseId) {
  const subjectsMap = {
    "web-dev": "HTML, CSS, JavaScript, React & Node.js",
    "ui-ux": "Design Principles, Figma, Prototyping & User Research",
    "python": "Python Basics, Data Structures, OOP & File Handling",
    "data-science": "Python, Statistics, Machine Learning & Data Visualization",
    "mobile-dev": "React Native, Flutter, iOS & Android Development",
    "cybersecurity": "Network Security, Ethical Hacking, Cryptography & Forensics",
    "cloud": "AWS, Azure, Docker, Kubernetes & DevOps",
    "marketing": "SEO, Social Media, Content Strategy & Analytics",
    "ai": "Machine Learning, Neural Networks, NLP & Computer Vision",
  };
  return subjectsMap[courseId] || "Comprehensive curriculum covering all topics";
}

function getVideosForCourse(courseId) {
  const videosMap = {
    "web-dev": [
      { title: "HTML & CSS Basics", date: "09 February 2026", url: "https://www.youtube.com/watch?v=UB1O30fR-EE" },
      { title: "JavaScript Fundamentals", date: "12 February 2026", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
      { title: "Building Your First Website", date: "15 February 2026", url: "https://www.youtube.com/watch?v=PlxWf493en4" },
    ],
    "ui-ux": [
      { title: "Introduction to UI/UX", date: "09 February 2026", url: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU" },
      { title: "Figma for Beginners", date: "12 February 2026", url: "https://www.youtube.com/watch?v=FTFaQWZBqQ8" },
      { title: "Design Principles", date: "15 February 2026", url: "https://www.youtube.com/watch?v=yNDgFK2Jj1E" },
    ],
    "python": [
      { title: "Python Setup & Basics", date: "09 February 2026", url: "https://www.youtube.com/watch?v=kqtD5dpn9C8" },
      { title: "Data Types & Variables", date: "12 February 2026", url: "https://www.youtube.com/watch?v=khKv-8q7YmY" },
      { title: "Functions & Loops", date: "15 February 2026", url: "https://www.youtube.com/watch?v=NSbOtYzIQI0" },
    ],
    "data-science": [
      { title: "Data Science Overview", date: "09 February 2026", url: "https://www.youtube.com/watch?v=ua-CiDNNj30" },
      { title: "Pandas & NumPy Basics", date: "12 February 2026", url: "https://www.youtube.com/watch?v=vmEHCJofslg" },
      { title: "Data Visualization", date: "15 February 2026", url: "https://www.youtube.com/watch?v=a9UrKTVEeZA" },
    ],
    "mobile-dev": [
      { title: "Mobile Development Intro", date: "09 February 2026", url: "https://www.youtube.com/watch?v=0-S5a0eXPoc" },
      { title: "React Native Basics", date: "12 February 2026", url: "https://www.youtube.com/watch?v=obH0Po_RdWk" },
      { title: "Building Your First App", date: "15 February 2026", url: "https://www.youtube.com/watch?v=qSRrxpdMpVc" },
    ],
    "cybersecurity": [
      { title: "Cybersecurity Fundamentals", date: "09 February 2026", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
      { title: "Network Security Basics", date: "12 February 2026", url: "https://www.youtube.com/watch?v=E03gh1huvW4" },
      { title: "Ethical Hacking Intro", date: "15 February 2026", url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE" },
    ],
    "cloud": [
      { title: "Cloud Computing Basics", date: "09 February 2026", url: "https://www.youtube.com/watch?v=M988_fsOSWo" },
      { title: "AWS Getting Started", date: "12 February 2026", url: "https://www.youtube.com/watch?v=k1RI5locZE4" },
      { title: "Docker Fundamentals", date: "15 February 2026", url: "https://www.youtube.com/watch?v=pTFZFxd4hOI" },
    ],
    "marketing": [
      { title: "Digital Marketing Overview", date: "09 February 2026", url: "https://www.youtube.com/watch?v=bixR-KIJKYM" },
      { title: "SEO Fundamentals", date: "12 February 2026", url: "https://www.youtube.com/watch?v=xsVTqzratPs" },
      { title: "Social Media Strategy", date: "15 February 2026", url: "https://www.youtube.com/watch?v=I2pwcAVonKI" },
    ],
    "ai": [
      { title: "AI & ML Introduction", date: "09 February 2026", url: "https://www.youtube.com/watch?v=JMUxmLyrhSk" },
      { title: "Neural Networks Basics", date: "12 February 2026", url: "https://www.youtube.com/watch?v=aircAruvnKk" },
      { title: "Deep Learning Overview", date: "15 February 2026", url: "https://www.youtube.com/watch?v=VyWAvY2CF9c" },
    ],
  };
  return videosMap[courseId] || [
    { title: "Course Introduction", date: "09 February 2026", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { title: "Getting Started", date: "12 February 2026", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { title: "Advanced Topics", date: "15 February 2026", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  ];
}
