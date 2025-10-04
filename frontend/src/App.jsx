import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { bootstrapMeta } from './store/metaSlice'
import Spinner from './components/common/Spinner'
import Card from './components/common/Card'

export default function App() {
  const dispatch = useDispatch()
  const { status } = useSelector(s => s.meta)
  const loc = useLocation()

  useEffect(() => { dispatch(bootstrapMeta()) }, [dispatch])

  return (
    <div className="container">
      <header className="appbar">
        <h1>Inspection SPA</h1>
        <nav>
          <Link to="/" className={loc.pathname === '/' ? 'active' : ''}>List</Link>
          <Link to="/create" className={loc.pathname === '/create' ? 'active' : ''}>Create</Link>
        </nav>
      </header>

      {status === 'loading' ? (
        <Card><Spinner label="Prefetch dropdown & templates..." /></Card>
      ) : (
        <main><Outlet/></main>
      )}
    </div>
  )
}