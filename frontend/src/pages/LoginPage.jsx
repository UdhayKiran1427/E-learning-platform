import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    try {
      setBusy(true)
      setError('')
      const u = await login({ email, password })
      navigate(u?.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="h1">Login</h1>
        <p className="muted">Use your student/admin credentials.</p>
        {error ? <div className="alert error">{error}</div> : null}

        <form className="stack gap-12" onSubmit={onSubmit}>
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
            />
          </label>

          <button className="btn" disabled={busy} type="submit">
            {busy ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <div className="muted">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  )
}

