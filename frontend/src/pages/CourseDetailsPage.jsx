import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { api, unwrap } from '../lib/api'
import { loadRazorpay } from '../lib/razorpay'

export function CourseDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthed, user } = useAuth()

  const [course, setCourse] = useState(null)
  const [status, setStatus] = useState(null)
  const [amount, setAmount] = useState(499)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const isStudent = isAuthed && user?.role === 'student'

  useEffect(() => {
    async function load() {
      try {
        setError('')
        const res = await api.get(`/courses/${id}`)
        setCourse(unwrap(res))
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load course')
      }
    }
    load()
  }, [id])

  useEffect(() => {
    async function loadStatus() {
      if (!isStudent) return
      try {
        const res = await api.get(`/enrollments/course/${id}/status`)
        setStatus(unwrap(res))
      } catch {
        // ignore
      }
    }
    loadStatus()
  }, [id, isStudent])

  const canPay = useMemo(() => {
    if (!isStudent) return false
    if (status?.hasPaid) return false
    return true
  }, [isStudent, status])

  async function startPayment() {
    if (!isAuthed) return navigate('/login')
    if (!isStudent) return

    try {
      setBusy(true)
      setError('')

      await loadRazorpay()

      const createRes = await api.post('/payments/create-order', {
        courseId: Number(id),
        amount: Number(amount),
      })
      const data = unwrap(createRes)
      const orderId = data?.orderId
      const keyId = data?.keyId
      const paymentId = data?.paymentId
      if (!orderId || !keyId || !paymentId) throw new Error('Invalid order response')

      const options = {
        key: keyId,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'Online Tutorial Platform',
        description: course?.title || 'Course enrollment',
        order_id: orderId,
        handler: async function (response) {
          try {
            await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              paymentId: paymentId,
            })
            const s = unwrap(await api.get(`/enrollments/course/${id}/status`))
            setStatus(s)
          } catch (e) {
            setError(e?.response?.data?.message || e.message || 'Payment verification failed')
          }
        },
        prefill: {
          name: user?.fullName,
          email: user?.email,
        },
        theme: { color: '#111827' },
      }

      // eslint-disable-next-line no-undef
      const rz = new Razorpay(options)
      rz.open()
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Payment failed to start')
    } finally {
      setBusy(false)
    }
  }

  if (error && !course) {
    return (
      <div className="stack gap-16">
        <div className="card error">{error}</div>
        <Link className="btn btn-secondary" to="/">
          Back to courses
        </Link>
      </div>
    )
  }

  if (!course) return <div className="card">Loading…</div>

  return (
    <div className="stack gap-16">
      <div className="page-head">
        <div>
          <h1 className="h1">{course.title}</h1>
          <p className="muted">Instructor: {course.instructor}</p>
        </div>
        <Link className="btn" to="/">
          Back
        </Link>
      </div>

      {error ? <div className="card error">{error}</div> : null}

      <div className="card">
        <div className="stack gap-8">
          <div className="muted">{course.description}</div>
          <div className="row">
            <span className="badge">Modules: {course.modules}</span>
            <span className="badge">Hours: {course.duration_hours}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="stack gap-12">
          <div className="card-title">Enrollment & Payment</div>

          {!isAuthed ? (
            <div className="row space">
              <span className="muted">Login as student to enroll.</span>
              <Link className="btn" to="/login">
                Login
              </Link>
            </div>
          ) : user?.role !== 'student' ? (
            <div className="muted">Only students can enroll in courses.</div>
          ) : (
            <>
              <div className="row">
                <span className="badge">
                  Enrolled: {status?.isEnrolled ? 'Yes' : 'No'} (status: {status?.enrollment?.status || 'none'})
                </span>
                <span className="badge">Paid: {status?.hasPaid ? 'Yes' : 'No'}</span>
              </div>

              <div className="row space">
                <div className="row">
                  <label className="label">
                    Amount (INR)
                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={{ width: 140 }}
                      disabled={!canPay || busy}
                    />
                  </label>
                </div>

                <button className="btn" onClick={startPayment} disabled={!canPay || busy} type="button">
                  {status?.hasPaid ? 'Already paid' : busy ? 'Starting…' : 'Pay & Enroll'}
                </button>

                {status?.hasPaid ? (
                  <Link className="btn btn-primary" to={`/courses/${id}/view`} style={{ marginLeft: 12 }}>
                    View course
                  </Link>
                ) : null}
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  )
}

