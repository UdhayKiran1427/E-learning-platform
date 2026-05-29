import { useEffect, useState } from 'react'
import { api, unwrap } from '../../lib/api'

export function AdminEnrollmentsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  async function load() {
    const res = await api.get('/enrollments/admin/all')
    setItems(unwrap(res) || [])
  }

  useEffect(() => {
    load().catch(() => {})
  }, [])

  async function setStatus(enrollmentId, status) {
    try {
      setBusyId(enrollmentId)
      setError('')
      await api.put(`/enrollments/${enrollmentId}/status`, { status })
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to update enrollment')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="stack gap-16">
      <div className="page-head">
        <div>
          <h1 className="h1">Enrollments</h1>
          <p className="muted">Approve or reject student course requests.</p>
        </div>
      </div>

      {error ? <div className="card error">{error}</div> : null}

      <div className="card">
        <div className="table">
          <div className="table-head">
            <div className='stack'><b>ID</b></div>
            <div className='stack'><b>Student</b></div>
            <div className='stack'><b>Course</b></div>
            <div className='stack'><b>Status</b></div>
          </div>
          {items.map((e) => (
            <div className="table-row" key={e.id}>
              <div>#{e.id}</div>
              <div>
                <div className="stack gap-4">
                  <strong>{e.student_name}</strong>
                  <span className="muted">{e.student_email}</span>
                </div>
              </div>
              <div>
                <div className="stack gap-4">
                  <strong >{e.course_title}</strong>
                  <span className="muted">{e.instructor}</span>
                </div>
              </div>
              <div>
                <span className="stack"><strong>{e.status}</strong></span>
              </div>
              {/* <div className="row">
                <button
                  className="btn"
                  type="button"
                  disabled={busyId === e.id}
                  onClick={() => setStatus(e.id, 'approved')}
                >
                  Approve
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  disabled={busyId === e.id}
                  onClick={() => setStatus(e.id, 'pending')}
                >
                  Pending
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  disabled={busyId === e.id}
                  onClick={() => setStatus(e.id, 'rejected')}
                >
                  Reject
                </button>
              </div> */}
            </div>
          ))}
        </div>

        {items.length === 0 ? <div className="muted" style={{ padding: 12 }}>No enrollments found.</div> : null}
      </div>
    </div>
  )
}

