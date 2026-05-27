import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { useAuth } from './auth/AuthContext.jsx'
import { Layout } from './components/Layout.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { CoursesPage } from './pages/CoursesPage.jsx'
import { CourseDetailsPage } from './pages/CourseDetailsPage.jsx'
import CourseViewPage from './pages/CourseViewPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { MyEnrollmentsPage } from './pages/MyEnrollmentsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.jsx'
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage.jsx'
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage.jsx'
import { AdminEnrollmentsPage } from './pages/admin/AdminEnrollmentsPage.jsx'
import { AdminCreateAdminPage } from './pages/admin/AdminCreateAdminPage.jsx'

export default function App() {
  const { ready } = useAuth()
  if (!ready) return <div className="container">Loading…</div>

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailsPage />} />
        <Route path="/courses/:id/view" element={<CourseViewPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/me/enrollments"
          element={
            <ProtectedRoute role="student">
              <MyEnrollmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/me/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute role="admin">
              <AdminCoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute role="admin">
              <AdminStudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/enrollments"
          element={
            <ProtectedRoute role="admin">
              <AdminEnrollmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/admins"
          element={
            <ProtectedRoute role="admin">
              <AdminCreateAdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
