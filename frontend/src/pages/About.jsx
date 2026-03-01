import React from "react";

export default function About() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>About LearnEdge</h1>
          <p>Empowering learners worldwide with quality education</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="content-box">
            <h2>Who We Are</h2>
            <p>
              LearnEdge is a modern online learning platform dedicated to making
              quality education accessible to everyone. Founded with the vision of
              transforming lives through education, we connect passionate learners
              with expert instructors from around the world.
            </p>
            <p>
              Our platform offers a diverse range of courses designed to help
              students, professionals, and lifelong learners achieve their goals.
              Whether you're looking to advance your career, learn a new skill, or
              explore a personal interest, LearnEdge provides the tools and
              resources you need to succeed.
            </p>
          </div>

          <div className="content-box">
            <h2>Our Mission</h2>
            <div className="mission-cards">
              <div className="mission-card">
                <h3>Ongoing Learning Support</h3>
                <p>
                  Continuous guidance, updates, and support throughout your
                  learning journey.
                </p>
                <div className="mission-card-image">📚</div>
              </div>
              <div className="mission-card">
                <h3>Quality Instruction</h3>
                <p>
                  Expert-led courses and smooth learning experience tailored for
                  success.
                </p>
                <div className="mission-card-image">👨‍🏫</div>
              </div>
              <div className="mission-card">
                <h3>Trusted Education</h3>
                <p>
                  Reliable and secure learning platform built on industry best
                  practices.
                </p>
                <div className="mission-card-image">🔒</div>
              </div>
            </div>
          </div>

          <div className="features-section">
            <h2>What Makes Us Different</h2>

            <div className="feature-item feature-item-1">
              <div className="feature-image">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=webp&w=600"
                  alt="Modern Design"
                />
              </div>
              <div className="feature-text">
                <h3>Modern Design</h3>
                <p>Clean and user-friendly interfaces built with best practices.</p>
              </div>
            </div>

            <div className="feature-item feature-item-2">
              <div className="feature-text">
                <h3>Advanced Technology</h3>
                <p>
                  Cutting-edge learning platform with latest tech stack and
                  innovations.
                </p>
              </div>
              <div className="feature-image">
                <img
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?crop=entropy&cs=tinysrgb&fit=max&fm=webp&w=600"
                  alt="Advanced Technology"
                />
              </div>
            </div>

            <div className="feature-item feature-item-3">
              <div className="feature-image">
                <img
                  src="https://media.istockphoto.com/id/1223044329/photo/confident-man-teacher-wearing-headset-speaking-holding-online-lesson.jpg?s=612x612&w=0&k=20&c=xKYLqKd6obXrUazZg5PDCycrwPiFXHVEJzqi0lxh78Q="
                  alt="Expert Instructors"
                />
              </div>
              <div className="feature-text">
                <h3>Expert Instructors</h3>
                <p>
                  Learn from industry professionals with years of real-world
                  experience.
                </p>
              </div>
            </div>

            <div className="feature-item feature-item-4">
              <div className="feature-text">
                <h3>Reliable Support</h3>
                <p>Continuous maintenance and long-term website support.</p>
              </div>
              <div className="feature-image">
                <img
                  src="https://media.istockphoto.com/id/1919005033/photo/training-online-for-business-webinar-or-coaching-education.jpg?s=612x612&w=0&k=20&c=k8tNeewMFOfr0lyhJU8IA-u5fVfl1Tv-Me27Se9J4M8="
                  alt="Reliable Support"
                />
              </div>
            </div>
          </div>

          <div className="content-box">
            <h2>Our Commitment</h2>
            <p>
              At LearnEdge, we're committed to maintaining the highest standards
              of educational quality. We carefully curate our course offerings,
              work with vetted instructors, and continuously update our content to
              reflect the latest industry trends and best practices.
            </p>
            <p>
              We're more than just a learning platform – we're your partner in
              success. Join us today and take the first step toward achieving your
              dreams.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
