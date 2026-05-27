import React from "react";
import "./css/coursecss.css";


export default function MysqlCourseTutorialPage() {
  const lessons = [
    {
      title: "MySQL Introduction",
      description:
        "MySQL is a popular open-source relational database management system. It is known for its speed, reliability, and ease of use.",
    },
    {
      title: "MySQL Tables",
      description:
        "Tables are the fundamental building blocks of a MySQL database. They consist of rows and columns, where each row represents a record and each column represents a field.",
    },
    {
      title: "MySQL Queries",
      description:
        "Queries are statements used to retrieve, insert, update, or delete data from a MySQL database.",
    },
    {
      title: "MySQL Joins",
      description:
        "Joins are used to combine rows from two or more tables based on a related column between them.",
    },
    {
      title: "MySQL Indexes",
      description:
        "Indexes are used to quickly find and access data in a MySQL database.",
    },
  ];


  return (
    <div className="page">
      <div className="container">
        {/* Hero Section */}
        <div className="card section">
          <div className="hero-grid">
            <div>
              <h1 className="hero-title">
                Mysql Complete Course
              </h1>
              <p className="hero-text">
                Master Mysql from beginner to advanced with hands-on examples,
                exercises, and mini projects.
              </p>
            </div>

            <div className="hero-banner">
              MySQL
            </div>
          </div>
        </div>

        {/* Course Stats */}
        <div className="stats-grid">
          {[
            { label: "Lessons", value: "25+" },
            { label: "Students", value: "12K+" },
            { label: "Projects", value: "8" },
            { label: "Rating", value: "4.9" },
          ].map((item, index) => (
            <div
              key={index}
              className="stat-card"
            >
              <h2 className="stat-value">
                {item.value}
              </h2>
              <p className="stat-label">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Lessons Section */}
        <div className="card section">
          <div className="lesson-header">
            <h2 className="section-title">
              Course Lessons
            </h2>

            {/* <input
              type="text"
              placeholder="Search lessons..."
              className="search-input"
            /> */}
          </div>

          <div className="lesson-list">
            {lessons.map((lesson, index) => (
              <div
                key={index}
                className="lesson-card"
              >
                <div>
                  <h3 className="lesson-title">
                    {index + 1}. {lesson.title}
                  </h3>
                  <p className="lesson-description">{lesson.description}</p>
                </div>

                <div className="lesson-actions">
                  <span className="duration">Mysql Topic</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="info-grid">
          <div className="info-card">
            <h2 className="info-title">What You’ll Learn</h2>

            <ul className="info-list">
              <li>✅ Mysql Introduction</li>
              <li>✅ Mysql Tables</li>
              <li>✅ Mysql Queries</li>
              <li>✅ Mysql Joins</li>
              <li>✅ Mysql Indexes</li>
            </ul>
          </div>

          <div className="info-card">
            <h2 className="info-title">Course Requirements</h2>

            <ul className="info-list">
              <li>💻 Computer or Laptop</li>
              <li>🌐 Internet Connection</li>
              <li>🧠 Basic Computer Knowledge</li>
              <li>🔥 Passion to Learn Web Development</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
