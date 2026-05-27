import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, unwrap } from '../lib/api'
import HtmlCourseTutorialPage from '../courses/Html.jsx'
import CSSCourseTutorialPage from '../courses/Css.jsx'
import JavascriptCourseTutorialPage from '../courses/Javascript.jsx'
import MysqlCourseTutorialPage from '../courses/Mysql.jsx'
import ReactCourseTutorialPage from '../courses/React.jsx'
export function CourseViewPage() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setError('')
        const res = await api.get(`/courses/${id}`)
        setCourse(unwrap(res))
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load course')
      }
    }
    load()
  }, [id])

  if (error && !course) {
    return (
      <div className="stack gap-16">
        <div className="card error">{error}</div>
        <Link className="btn btn-secondary" to="/me/enrollments">
          Back to enrollments
        </Link>
      </div>
    )
  }

  if (!course) return <div className="card">Loading…</div>

  function renderCourseContent() {
    const key = ( course.title || '').toLowerCase()
    console.log('Course key:', key); // Debugging line to check the course title
    if (/html/.test(key)) return <HtmlCourseTutorialPage />
    if (/css/.test(key)) return <CSSCourseTutorialPage />
    if (/javascript|js/.test(key)) return <JavascriptCourseTutorialPage />
    if (/mysql|sql/.test(key)) return <MysqlCourseTutorialPage />
    if (/react/.test(key)) return <ReactCourseTutorialPage />

    return (
      <div className="card">
        <div className="muted">
          No matching course content component found for this course. Add a course `link` or title that includes html, css, javascript, mysql, or react.
        </div>
      </div>
    )
  }

  return (
    <div className="stack gap-16">
      <div className="page-head">
        <div>
          <h1 className="h1">{course.title}</h1>
          <p className="muted">Instructor: {course.instructor}</p>
        </div>
        <Link className="btn" to={`/courses/${id}`}>
          Back to details
        </Link>
      </div>

      {renderCourseContent()}
    </div>
  )
}

export default CourseViewPage
