import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

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
      await register({ fullName, email, password, role: 'student' })
      setSuccess('Registered successfully. Please login.')
      setTimeout(() => navigate('/login'), 500)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="h1">Register</h1>
        <p className="muted">Create a student account.</p>

        {error ? <div className="alert error">{error}</div> : null}
        {success ? <div className="alert success">{success}</div> : null}

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
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <div className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

