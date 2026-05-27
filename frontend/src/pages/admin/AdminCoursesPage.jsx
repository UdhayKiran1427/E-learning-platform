import { useEffect, useState } from 'react'
import { api, unwrap } from '../../lib/api'

const emptyForm = {
  title: '',
  description: '',
  modules: 1,
  durationHours: 1,
  instructor: '',
  link: '',
}

export function AdminCoursesPage() {
  const [courses, setCourses] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function load() {
    const res = await api.get('/courses')
    setCourses(unwrap(res) || [])
  }

  useEffect(() => {
    load().catch(() => {})
  }, [])

  function startEdit(c) {
    setEditingId(c.id)
    setForm({
      title: c.title || '',
      description: c.description || '',
      modules: c.modules ?? 1,
      durationHours: c.duration_hours ?? c.durationHours ?? 1,
      instructor: c.instructor || '',
      link: c.link || '',
    })
  }

  function reset() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function submit(e) {
    e.preventDefault()
    try {
      setBusy(true)
      setError('')
      setNotice('')
      const payload = { ...form }
      if (!payload.link) delete payload.link
      if (editingId) await api.put(`/courses/${editingId}`, payload)
      else await api.post('/courses/', payload)
      await load()
      setNotice(editingId ? 'Course updated.' : 'Course created.')
      reset()
    } catch (e2) {
      setError(e2?.response?.data?.message || e2.message || 'Failed to save course')
    } finally {
      setBusy(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this course?')) return
    try {
      setBusy(true)
      setError('')
      setNotice('')
      await api.delete(`/courses/${id}`)
      await load()
      setNotice('Course deleted.')
      if (editingId === id) reset()
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to delete course')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="stack gap-16">
      <div className="page-head">
        <div>
          <h1 className="h1">Manage Courses</h1>
          <p className="muted">Create, edit, and deactivate courses.</p>
        </div>
      </div>

      {error ? <div className="card error">{error}</div> : null}
      {notice ? <div className="card success">{notice}</div> : null}

      <div className="grid cols-2">
        <div className="card">
          <div className="card-title">{editingId ? `Edit Course #${editingId}` : 'Create Course'}</div>
          <form className="stack gap-12" onSubmit={submit}>
            <label className="label">
              Title
              <input
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                minLength={3}
              />
            </label>
            <label className="label">
              Description
              <textarea
                className="input"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                minLength={10}
              />
            </label>
            <div className="row">
              <label className="label">
                Modules
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={form.modules}
                  onChange={(e) => setForm({ ...form, modules: Number(e.target.value) })}
                  required
                />
              </label>
              <label className="label">
                Duration (hours)
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={form.durationHours}
                  onChange={(e) => setForm({ ...form, durationHours: Number(e.target.value) })}
                  required
                />
              </label>
            </div>
            <label className="label">
              Instructor
              <input
                className="input"
                value={form.instructor}
                onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                required
                minLength={3}
              />
            </label>
            <label className="label">
              Link (optional)
              <input className="input" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
            </label>

            <div className="row space">
              <button className="btn" disabled={busy} type="submit">
                {busy ? 'Saving…' : editingId ? 'Update' : 'Create'}
              </button>
              {editingId ? (
                <button className="btn btn-secondary" disabled={busy} type="button" onClick={reset}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="card">
          <div className="card-title">Active courses</div>
          <div className="stack gap-12">
            {courses.map((c) => (
              <div key={c.id} className="item">
                <div className="stack gap-4">
                  <div className="row space">
                    <strong>{c.title}</strong>
                    <span className="badge">#{c.id}</span>
                  </div>
                  <div className="muted">{c.instructor}</div>
                  <div className="row">
                    <button className="btn btn-secondary" disabled={busy} type="button" onClick={() => startEdit(c)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" disabled={busy} type="button" onClick={() => remove(c.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {courses.length === 0 ? <div className="muted">No courses found.</div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

