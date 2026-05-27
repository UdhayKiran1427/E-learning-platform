import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, unwrap } from '../lib/api'

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

  return (
    <div className="stack gap-16">
      <div className="page-head">
        <div>
          <h1 className="h1">{course.title}</h1>
          <p className="muted">Instructor: {course.instructor}</p>
        </div>
        <Link className="btn btn-secondary" to="/me/enrollments">
          Back
        </Link>
      </div>

      <div className="card">
        {course.link ? (
            console.log('Course link:', course.link) ||
          <iframe
            src={"https://www.w3schools.com/css/"}
            title={course.title || 'Course content'}
            style={{ width: '100%', height: '75vh', border: 'none' }}
          />
        ) : (
          <div className="muted">No course link available for this course.</div>
        )}
      </div>
    </div>
  )
}

export default CourseViewPage
