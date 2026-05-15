import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, unwrap } from '../lib/api'
import { getStoredUser, getToken, setStoredUser, setToken } from '../lib/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken())
  const [user, setUser] = useState(() => getStoredUser())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // If we have a token but no user info, try fetching profile
    async function boot() {
      try {
        if (token && !user) {
          const res = await api.get('/auth/profile')
          const profile = unwrap(res)
          setUser(profile)
          setStoredUser(profile)
        }
      } finally {
        setReady(true)
      }
    }
    boot()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo(() => {
    const isAuthed = Boolean(token)

    async function login({ email, password }) {
      const res = await api.post('/auth/login', { email, password })
      const payload = res.data
      const nextToken = payload?.token || payload?.data?.token
      const nextUser = payload?.user || payload?.data?.user
      if (!nextToken) throw new Error('No token returned from server')

      setToken(nextToken)
      setTokenState(nextToken)

      if (nextUser) {
        setUser(nextUser)
        setStoredUser(nextUser)
        return nextUser
      }

      const prof = unwrap(await api.get('/auth/profile'))
      setUser(prof)
      setStoredUser(prof)
      return prof
    }

    async function register({ fullName, email, password, role, adminCode }) {
      const res = await api.post('/auth/register', { fullName, email, password, role, adminCode })
      return res.data
    }

    function logout() {
      setToken('')
      setTokenState('')
      setUser(null)
      setStoredUser(null)
    }

    return { ready, token, user, isAuthed, login, register, logout }
  }, [ready, token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

