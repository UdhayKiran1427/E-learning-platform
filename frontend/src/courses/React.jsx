import React from "react";
import "./css/coursecss.css";


export default function ReactCourseTutorialPage() {
  const lessons = [
    {
      title: "React Introduction",
      description:
        "React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and manage the state of their applications efficiently.",
    },
    {
      title: "React Components",
      description:
        "React components are the building blocks of a React application. They can be functional or class-based and are used to create reusable UI elements.",
    },
    {
      title: "React Props",
      description:
        "Props (short for properties) are read-only attributes that are passed to a React component. They allow data to be passed from a parent component to a child component.",
    },
    {
      title: "React Hooks",
      description:
        "Hooks allow functions to have access to state and other React features without using classes. They provide a more direct API to React concepts like props, state, context, refs, and lifecycle.",
    },
    {
      title: "React State",
      description:
        "The React useState Hook allows us to track state in a function component. State generally refers to data or properties that need to be tracking in an application",
    },
    {
      title: "React UseEffect",
      description:
        "The React useEffect Hook allows us to perform side effects in function components. It is a replacement for lifecycle methods like componentDidMount, componentDidUpdate, and componentWillUnmount.",
    },
    {
      title: "React Context",
      description:
        "Context provides a way to pass data through the component tree without having to pass props down manually at every level.",
    },
    {
      title: "React UseReducer",
      description:
        "The useReducer Hook is similar to the useState Hook. It allows for custom state logic.If you find yourself keeping track of multiple pieces of state that rely on complex logic, useReducer may be useful.",
    },
    {
      title: "React UseCallback",
      description:
        "The useCallback Hook returns a memoized version of the callback function that only changes if one of its dependencies has changed.",
    },
    {
      title: "React Router",
      description:
        "React Router is a library for handling routing in React applications. It allows you to navigate between different components based on the URL.",
    },
    {
      title: "React UseMemo",
      description:
        "The useMemo Hook returns a memoized value that only changes if one of its dependencies has changed.",
    },
    {
      title: "React Suspense",
      description:
        "Suspense allows you to display a loading indicator while waiting for something to load.",
    },
    {
      title: "React Performance Optimization",
      description:
        "Performance optimization techniques for React applications, including memoization, lazy loading, and efficient rendering.",
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
                React Complete Course
              </h1>
              <p className="hero-text">
                Master React from beginner to advanced with hands-on examples,
                exercises, and mini projects.
              </p>
            </div>

            <div className="hero-banner">
              ReactJS
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
                  <span className="duration">React Topic</span>
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
              <li>✅ React Introduction</li>
              <li>✅ React Components</li>
              <li>✅ React Props & State</li>
              <li>✅ React Router</li>
              <li>✅ React Hooks</li>
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
