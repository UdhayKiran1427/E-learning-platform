import { useState } from 'react'
import { api } from '../../lib/api'

export function AdminCreateAdminPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    try {
      setBusy(true)
      setError('')
      setSuccess('')
      await api.post('/users/admins', { fullName, email, password })
      setSuccess('Admin created successfully.')
      setFullName('')
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create admin')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="stack gap-16">
      <div className="page-head">
        <div>
          <h1 className="h1">Create Admin</h1>
          <p className="muted">Only existing admins can create new admins.</p>
        </div>
      </div>

      {error ? <div className="card error">{error}</div> : null}
      {success ? <div className="card success">{success}</div> : null}

      <div className="card">
        <form className="stack gap-12" onSubmit={onSubmit}>
          <label className="label">
            Full name
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </label>

          <label className="label">
            Email
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label className="label">
            Password
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          <button className="btn" disabled={busy} type="submit">
            {busy ? 'Creating…' : 'Create admin'}
          </button>
        </form>
      </div>
    </div>
  )
}

