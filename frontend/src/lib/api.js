import axios from 'axios'
import { getToken, setToken, setStoredUser } from './storage'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401 || status === 403) {
      // Token invalid/expired: clear local session
      setToken('')
      setStoredUser(null)
    }
    return Promise.reject(err)
  },
)

export function unwrap(res) {
  return res?.data?.data ?? res?.data
}

