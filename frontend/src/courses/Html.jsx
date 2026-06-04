import React from "react";
import "./css/coursecss.css";

/*
Create HtmlCourseTutorialPage.css and paste this CSS:

.page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 24px;
  font-family: Arial, sans-serif;
}

.container {
  max-width: 1200px;
  margin: auto;
}

.card,
.info-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  margin-bottom: 30px;
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  align-items: center;
}

.hero-title {
  font-size: 52px;
  margin-bottom: 20px;
  color: #111827;
}

.hero-text {
  color: #4b5563;
  font-size: 18px;
  line-height: 1.7;
  margin-bottom: 24px;
}

.button-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.primary-btn,
.watch-btn,
.cta-btn {
  background: black;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;
}

.primary-btn:hover,
.watch-btn:hover,
.cta-btn:hover {
  transform: scale(1.05);
}

.secondary-btn {
  background: white;
  border: 1px solid #d1d5db;
  padding: 14px 24px;
  border-radius: 14px;
  cursor: pointer;
}

.hero-banner {
  height: 280px;
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 72px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, orange, red);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
}

.stat-label {
  color: #6b7280;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 25px;
}

.section-title,
.info-title,
.cta-title {
  font-size: 32px;
  font-weight: bold;
}

.search-input {
  padding: 12px 18px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  width: 250px;
}

.lesson-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.lesson-card {
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.lesson-title {
  font-size: 22px;
  margin-bottom: 10px;
}

.lesson-description {
  color: #4b5563;
}

.lesson-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.duration {
  background: #f3f4f6;
  padding: 10px 16px;
  border-radius: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.info-list {
  line-height: 2;
  color: #374151;
}

.footer-cta {
  background: black;
  color: white;
  border-radius: 24px;
  padding: 50px;
  text-align: center;
}

.cta-text {
  color: #d1d5db;
  font-size: 18px;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 38px;
  }

  .section-title,
  .info-title,
  .cta-title {
    font-size: 26px;
  }

  .hero-banner {
    font-size: 52px;
  }

  .lesson-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
*/

export default function HtmlCourseTutorialPage() {
  const lessons = [
    {
      title: "HTML Introduction",
      description:
        "HTML stands for HyperText Markup Language. It is the standard language used to create web pages. HTML describes the structure of a webpage using elements and tags.",
    },
    {
      title: "HTML Editors",
      description:
        "HTML code can be written using editors like VS Code, Sublime Text, or Notepad. After saving the file with a .html extension, it can be opened in any browser.",
    },
    {
      title: "HTML Basic Structure",
      description:
        "Every HTML page contains a basic structure including html, head, title, and body tags. These elements define the webpage layout.",
    },
    {
      title: "HTML Elements",
      description:
        "HTML elements are the building blocks of webpages. They usually contain an opening tag, content, and a closing tag.",
    },
    {
      title: "HTML Headings",
      description:
        "HTML provides heading tags from h1 to h6. h1 is the largest heading and h6 is the smallest.",
    },
    {
      title: "HTML Paragraphs",
      description:
        "Paragraphs are created using the p tag. They are used to display blocks of text content on webpages.",
    },
    {
      title: "HTML Links",
      description:
        "Links are created using the anchor tag. They allow users to navigate between webpages and websites.",
    },
    {
      title: "HTML Images",
      description:
        "Images can be displayed using the img tag with attributes like src, alt, width, and height.",
    },
    {
      title: "HTML Lists",
      description:
        "HTML supports ordered lists, unordered lists, and description lists to organize content properly.",
    },
    {
      title: "HTML Tables",
      description:
        "Tables are used to display data in rows and columns using table, tr, th, and td tags.",
    },
    {
      title: "HTML Forms",
      description:
        "Forms collect user input using text fields, radio buttons, checkboxes, dropdowns, and buttons.",
    },
    {
      title: "Semantic HTML",
      description:
        "Semantic tags like header, nav, section, article, and footer make webpages more meaningful and improve SEO.",
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
                HTML Complete Course
              </h1>
              <p className="hero-text">
                Master HTML from beginner to advanced with hands-on examples,
                exercises, and mini projects.
              </p>
            </div>

            <div className="hero-banner">
              HTML5
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
          ]?.map((item, index) => (
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
            {lessons?.map((lesson, index) => (
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
                  <span className="duration">HTML Topic</span>
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
              <li>✅ HTML Structure & Boilerplate</li>
              <li>✅ Forms and Validation</li>
              <li>✅ Semantic HTML</li>
              <li>✅ Tables, Lists, Media</li>
              <li>✅ Responsive Web Basics</li>
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
