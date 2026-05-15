import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, unwrap } from '../../lib/api'

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setError('')
        const res = await api.get('/users/dashboard/stats')
        setStats(unwrap(res))
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load dashboard stats')
      }
    }
    load()
  }, [])

  return (
    <div className="stack gap-16">
      <div className="page-head">
        <div>
          <h1 className="h1">Admin Dashboard</h1>
          <p className="muted">Quick overview and shortcuts.</p>
        </div>
      </div>

      {error ? <div className="card error">{error}</div> : null}

      <div className="grid">
        <div className="card">
          <div className="stack gap-8">
            <div className="card-title">Stats</div>
            {!stats ? (
              <div className="muted">Loading…</div>
            ) : (
              <div className="stack gap-8">
                <div className="row">
                  <span className="badge">Students: {stats.totalStudents}</span>
                  <span className="badge">Courses: {stats.totalCourses}</span>
                </div>
                <div className="row">
                  <span className="badge">Approved: {stats.approvedEnrollments}</span>
                  <span className="badge">Pending: {stats.pendingRequests}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="stack gap-8">
            <div className="card-title">Manage</div>
            <div className="row">
              <Link className="btn" to="/admin/courses">
                Courses
              </Link>
              <Link className="btn btn-secondary" to="/admin/students">
                Students
              </Link>
              <Link className="btn btn-secondary" to="/admin/enrollments">
                Enrollments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

