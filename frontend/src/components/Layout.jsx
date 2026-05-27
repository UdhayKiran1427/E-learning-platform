import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export function Layout() {
  const { user, isAuthed, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <Link to="/" className="brand">
            Online Tutorial
          </Link>

          <nav className="nav">
           {!isAuthed ? (
           <NavLink to="/" end>
              Courses
            </NavLink>

           ): null} 
            {isAuthed && user?.role === 'student' ? (
              <>
              <NavLink to="/" end>
              Courses
            </NavLink>
              <NavLink to="/me/enrollments">My Enrollments</NavLink>
              <NavLink to="/me/profile">Profile</NavLink>
            </>
            ) : null}
            {isAuthed && user?.role === 'admin' ? (
              <>
                <NavLink to="/admin">Admin</NavLink>
                <NavLink to="/admin/courses">Manage Courses</NavLink>
                <NavLink to="/admin/students">Students</NavLink>
                <NavLink to="/admin/enrollments">Enrollments</NavLink>
                <NavLink to="/admin/admins">Create Admin</NavLink>
                <NavLink to="/me/profile">Profile</NavLink>
              </>
            ) : null}
          </nav>

          <div className="authbox">
            {isAuthed ? (
              <>
                <span className="chip">
                  {user?.fullName || user?.full_name || user?.email} ({user?.role})
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    logout()
                    navigate('/login')
                  }}
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className="btn btn-secondary" to="/login">
                  Login
                </NavLink>
                <NavLink className="btn" to="/register">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} Online Tutorial Platform</span>
        </div>
      </footer>
    </div>
  )
}

