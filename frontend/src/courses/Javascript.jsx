import React from "react";
import "./css/coursecss.css";


export default function JavascriptCourseTutorialPage() {
  const lessons = [
    {
      title: "JavaScript Introduction",
      description:
        "JavaScript is a programming language that conforms to the ECMAScript specification. JavaScript is high-level, often just-in-time compiled, and multi-paradigm.",
    },
    {
      title: "JavaScript Variables",
      description:
        "Variables are containers for storing data values. In JavaScript, there are three ways to declare a variable: var, let, and const.",
    },
    {
      title: "JavaScript Data Types",
      description:
        "JavaScript has several data types including primitive types like string, number, boolean, null, undefined, and symbol, as well as complex types like object and function.",
    },
    {
      title: "JavaScript Functions",
      description:
        "Functions are blocks of code designed to perform a particular task. They are executed when they are invoked.",
    },
    {
      title: "JavaScript Arrays",
      description:
        "Arrays are special variables that can hold more than one value at a time. Each value in an array has a numeric index that starts from zero.",
    },
    {
      title: "JavaScript Objects",
      description:
        "Objects in JavaScript are collections of key-value pairs. They can contain properties and methods.",
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
                JavaScript Complete Course
              </h1>
              <p className="hero-text">
                Master JavaScript from beginner to advanced with hands-on examples,
                exercises, and mini projects.
              </p>
            </div>

            <div className="hero-banner">
              JavaScript
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
                  <span className="duration">JavaScript Topic</span>
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
              <li>✅ Javascript Introduction</li>
              <li>✅ Javascript Variables</li>
              <li>✅ Javascript Functions</li>
              <li>✅ Javascript Arrays</li>
              <li>✅ Javascript Objects</li>
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
