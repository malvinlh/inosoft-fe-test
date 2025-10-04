import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInspections } from '../store/inspectionSlice'
import { OPEN, FOR_REVIEW, COMPLETED } from '../utils/statusMap'
import StatusTabs from '../components/tabs/StatusTabs'
import { Link } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function InspectionsList() {
  const dispatch = useDispatch()
  const { list, status } = useSelector(s=>s.inspections)
  const [active, setActive] = useState('Open')

  useEffect(()=>{ dispatch(fetchInspections()) }, [dispatch])

  const sets = { 'Open': OPEN, 'For Review': FOR_REVIEW, 'Completed': COMPLETED }

  const rows = useMemo(()=>{
    const set = sets[active]
    return (list||[]).filter(x=> set.has(x.status))
  }, [list, active])

  return (
    <Card>
      <div className="header-row">
        <h2>Inspections</h2>
        <Link to="/create"><Button>Buat Baru</Button></Link>
      </div>

      <StatusTabs active={active} onChange={setActive} />

      {status==='loading' ? <p>Loading...</p> : (
        <table className="table">
          <thead>
            <tr><th>No</th><th>Status</th><th>Service</th><th>Scope</th><th>Created</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map(it=>(
              <tr key={it.id}>
                <td>{it.no}</td>
                <td>{it.status}</td>
                <td>{it.serviceType}</td>
                <td>{it.scopeId}</td>
                <td>{new Date(it.createdAt).toLocaleString()}</td>
                <td><Link to={`/inspections/${it.id}`}>Detail</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  )
}