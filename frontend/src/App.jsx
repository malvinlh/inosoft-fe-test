import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { bootstrapMeta } from './store/metaSlice'
import Spinner from './components/atoms/Spinner'
import Card from './components/atoms/Card'
import './styles/custom.css'

export default function App() {
  const dispatch = useDispatch()
  const { status } = useSelector(s => s.meta)
  const loc = useLocation()
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => { dispatch(bootstrapMeta()) }, [dispatch])

  useEffect(() => { setNavOpen(false) }, [loc.pathname])

  const isList   = loc.pathname === '/'
  const isCreate = loc.pathname === '/create'

  return (
    <div className="bg-light min-vh-100">
      <header className="appbar border-bottom bg-white py-3 mb-4 shadow-sm-sm">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/" className="text-decoration-none">
              <h1 className="h4 fw-bold m-0 text-dark">Inspection SPA</h1>
            </Link>

            {/* desktop nav */}
            <nav className="nav d-none d-sm-flex">
              <Link
                to="/"
                className={`nav-link nav-pill ${isList ? 'active' : ''}`}
              >
                List
              </Link>
              <Link
                to="/create"
                className={`nav-link nav-pill ${isCreate ? 'active' : ''}`}
              >
                Create
              </Link>
            </nav>

            {/* mobile toggle */}
            <button
              type="button"
              className="btn btn-outline-secondary nav-toggle d-sm-none"
              onClick={() => setNavOpen(v => !v)}
              aria-expanded={navOpen}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
          </div>

          {/* mobile nav */}
          <nav className={`nav-mobile d-sm-none ${navOpen ? 'show' : ''}`}>
            <Link
              to="/"
              className={`nav-mobile-link ${isList ? 'active' : ''}`}
            >
              List
            </Link>
            <Link
              to="/create"
              className={`nav-mobile-link ${isCreate ? 'active' : ''}`}
            >
              Create
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mb-5">
        {status === 'loading'
          ? <Card><Spinner label="Prefetch dropdown & templates..." /></Card>
          : <Outlet />}
      </main>
    </div>
  )
}