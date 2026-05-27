import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, unwrap } from '../lib/api'

export function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        const res = await api.get('/courses')
        setCourses(unwrap(res) || [])
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load courses')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return courses
    return courses.filter((c) => {
      const title = String(c.title || '').toLowerCase()
      const instructor = String(c.instructor || '').toLowerCase()
      return title.includes(term) || instructor.includes(term)
    })
  }, [courses, q])

  return (
    <div className="stack gap-16">
      <div className="page-head">
        <div>
          <h1 className="h1">Courses</h1>
          <p className="muted">Browse available courses and enroll after payment.</p>
        </div>
        
      </div>

      {loading ? <div className="card">Loading…</div> : null}
      {error ? <div className="card error">{error}</div> : null}

      <div className="grid">
        {filtered.map((c) => (
          <div key={c.id} className="card">
            <div className="stack gap-8">
              <div className="card-title">{c.title}</div>
              <div className="muted">{c.description}</div>
              <div className="row">
                <span className="badge">Modules: {c.modules}</span>
                <span className="badge">Hours: {c.duration_hours}</span>
                <span className="badge">By {c.instructor}</span>
              </div>
              <div className="row space">
                <Link className="btn" to={`/courses/${c.id}`}>
                  View details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

