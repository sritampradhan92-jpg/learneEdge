import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Learn. Achieve. Succeed.</h1>
          <p>
            Master new skills with LearnEdge - Your gateway to professional growth
            and lifelong learning
          </p>
          <Link to="/courses" className="btn-primary">
            Explore Courses
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose LearnEdge?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Expert Courses</h3>
              <p>
                Learn from industry professionals with real-world experience and
                proven track records
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Flexible Learning</h3>
              <p>
                Study at your own pace, anytime and anywhere that suits your
                schedule
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Career Growth</h3>
              <p>
                Boost your career with in-demand skills and industry-recognized
                knowledge
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Learning Journey?</h2>
          <p>Join thousands of students already learning with LearnEdge</p>
          <Link to="/signup" className="btn-secondary">
            Get Started Free
          </Link>
        </div>
      </section>
    </>
  );
}
