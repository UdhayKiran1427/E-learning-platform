import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, unwrap } from '../lib/api'

export function MyEnrollmentsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        const res = await api.get('/users/my/enrollments')
        setItems(unwrap(res) || [])
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load enrollments')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="stack gap-16">
      <div className="page-head">
        <div>
          <h1 className="h1">My Enrollments</h1>
          <p className="muted">Your course requests and approvals.</p>
        </div>
      </div>

      {loading ? <div className="card">Loading…</div> : null}
      {error ? <div className="card error">{error}</div> : null}

      <div className="grid">
        {items?.map((e) => (
          <div className="card" key={e.id}>
            <div className="stack gap-8">
              <div className="card-title">{e.course_title || e.title || 'Course'}</div>
              <div className="row">
                <span className="badge">Status: {e.status}</span>
                <span className="badge">Progress: {e.progress_percentage ?? 0}%</span>
              </div>
              {e.course_id ? (
                <Link className="btn btn-secondary" to={`/courses/${e.course_id}/view`}>
                  View course
                </Link>
              ) : (
                <span className="muted">Course link unavailable (backend doesn’t return course_id).</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && items.length === 0 ? (
        <div className="card muted">No enrollments yet.</div>
      ) : null}
    </div>
  )
}

