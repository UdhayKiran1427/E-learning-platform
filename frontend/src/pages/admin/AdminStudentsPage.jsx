import { useEffect, useState } from 'react'
import { api, unwrap } from '../../lib/api'

export function AdminStudentsPage() {
  const [students, setStudents] = useState([])
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  async function load() {
    const res = await api.get('/users/students')
    setStudents(unwrap(res) || [])
  }

  useEffect(() => {
    load().catch(() => {})
  }, [])

  async function setStatus(id, status) {
    try {
      setBusyId(id)
      setError('')
      if (status === 'active') await api.put(`/users/users/${id}/activate`)
      else await api.put(`/users/users/${id}/deactivate`)
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to update student status')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="stack gap-16">
      <div className="page-head">
        <div>
          <h1 className="h1">Students</h1>
          <p className="muted">View and activate/deactivate student accounts.</p>
        </div>
      </div>

      {error ? <div className="card error">{error}</div> : null}

      <div className="card">
        <div className="table">
          <div className="table-head">
            <div>ID</div>
            <div>Name</div>
            <div>Email</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {students?.map((s) => (
            <div className="table-row" key={s.id}>
              <div>#{s.id}</div>
              <div>{s.full_name || s.fullName}</div>
              <div>{s.email}</div>
              <div>
                <span className="badge">{s.status}</span>
              </div>
              <div className="row">
                {s.status === 'active' ? (
                  <button
                    className="btn btn-danger"
                    type="button"
                    disabled={busyId === s.id}
                    onClick={() => setStatus(s.id, 'inactive')}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    className="btn"
                    type="button"
                    disabled={busyId === s.id}
                    onClick={() => setStatus(s.id, 'active')}
                  >
                    Activate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {students.length === 0 ? <div className="muted" style={{ padding: 12 }}>No students found.</div> : null}
      </div>
    </div>
  )
}

