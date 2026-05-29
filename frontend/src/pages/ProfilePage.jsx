import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { api, unwrap } from '../lib/api'
import { setStoredUser } from '../lib/storage'

export function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', currentPassword: '', newPassword: '' })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setError('')
        const res = await api.get('/auth/profile')
        const prof = unwrap(res)
        setForm((s) => ({ ...s, fullName: prof?.fullName || prof?.full_name || '', email: prof?.email || '' }))
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function onChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword || undefined,
      }
      await api.put('/users/profile', payload)
      // refresh stored profile
      const prof = unwrap(await api.get('/auth/profile'))
      setStoredUser(prof)
      setSuccess('Profile updated successfully. Reloading...')
      // small delay then reload to refresh AuthContext
      setTimeout(() => window.location.reload(), 800)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to update profile')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <div className="card">Loading…</div>

  return (
    <div className="stack gap-16">
      <div className="page-head">
        <div>
          <h1 className="h1">Profile</h1>
          <p className="muted">View and update your profile information.</p>
        </div>
        <Link className="btn btn-secondary" to={user && user.role === 'admin' ? '/admin' : '/'}>
          Back
        </Link>
      </div>

      {error ? <div className="card error">{error}</div> : null}
      {success ? <div className="card success">{success}</div> : null}

      <form onSubmit={onSubmit} className="card stack gap-12">
        <label className="label">
          Full name
          <input name="fullName" value={form.fullName} onChange={onChange} className="input" />
        </label>

        <label className="label">
          Email
          <input name="email" value={form.email} onChange={onChange} type="email" className="input" />
        </label>

        <label className="label">
          Current password (required)
          <input name="currentPassword" value={form.currentPassword} onChange={onChange} type="password" className="input" />
        </label>

        <label className="label">
          New password (leave empty to keep current)
          <input name="newPassword" value={form.newPassword} onChange={onChange} type="password" className="input" />
        </label>

        <div className="row">
          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfilePage
