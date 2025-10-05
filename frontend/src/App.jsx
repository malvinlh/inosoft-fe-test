import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { bootstrapMeta } from './store/metaSlice'
import Spinner from './components/common/Spinner'
import Card from './components/common/Card'
import './styles/custom.css' // pastikan diimpor

export default function App() {
  const dispatch = useDispatch()
  const { status } = useSelector(s => s.meta)
  const loc = useLocation()

  useEffect(() => { dispatch(bootstrapMeta()) }, [dispatch])

  return (
    <div className="bg-light min-vh-100">
      <header className="appbar border-bottom bg-white py-3 mb-4 shadow-sm-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="h4 fw-bold m-0 text-dark">Inspection SPA</h1>
          <nav className="nav">
            <Link
              to="/"
              className={`nav-link nav-pill ${loc.pathname === '/' ? 'active' : ''}`}
            >
              List
            </Link>
            <Link
              to="/create"
              className={`nav-link nav-pill ${loc.pathname === '/create' ? 'active' : ''}`}
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