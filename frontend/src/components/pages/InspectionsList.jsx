import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInspections } from '../../store/inspectionSlice'
import { OPEN, FOR_REVIEW, COMPLETED } from '../../utils/statusMap'
import StatusTabs from '../organisms/StatusTabs'
import { Link } from 'react-router-dom'
import Card from '../atoms/Card'
import Button from '../atoms/Button'

export default function InspectionsList() {
  const dispatch = useDispatch()
  const { list, status } = useSelector((s) => s.inspections)
  const [active, setActive] = useState('Open')

  useEffect(() => { dispatch(fetchInspections()) }, [dispatch])

  const sets = { Open: OPEN, 'For Review': FOR_REVIEW, Completed: COMPLETED }

  const rows = useMemo(() => {
    const set = sets[active]
    return (list || []).filter((x) => set.has(x.status))
  }, [list, active])

  const badgeVariant = (st) => ({
    'New': 'secondary',
    'In Progress': 'info',
    'Ready to Review': 'warning',
    'Completed': 'success'
  }[st] || 'secondary')

  return (
    <Card>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="h4 m-0">Inspections</h2>
        <Link to="/create">
          <Button variant="primary">Buat Baru</Button>
        </Link>
      </div>

      <StatusTabs active={active} onChange={setActive} />

      {status === 'loading' ? (
        <p className="text-muted mb-0">Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>No</th>
                <th>Status</th>
                <th>Service</th>
                <th>Scope</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((it) => (
                  <tr key={it.id}>
                    <td>{it.no}</td>
                    <td>
                      <span className={`badge bg-${badgeVariant(it.status)}`}>
                        {it.status}
                      </span>
                    </td>
                    <td>{it.serviceType}</td>
                    <td>{it.scopeId}</td>
                    <td>{new Date(it.createdAt).toLocaleString()}</td>
                    <td>
                      <Link to={`/inspections/${it.id}`}>Detail</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-3">
                    Tidak ada data untuk tab &quot;{active}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}