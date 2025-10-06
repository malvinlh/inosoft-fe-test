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

  const forReviewCount = useMemo(
    () => (list || []).filter(x => FOR_REVIEW.has(x.status)).length,
    [list]
  );

  const badgeVariant = (st) => ({
    'New': 'secondary',
    'In Progress': 'info',
    'Ready to Review': 'warning',
    'Completed': 'success'
  }[st] || 'secondary')

  const fmtDate = (v) =>
    v ? new Date(v).toLocaleString() : '-'

  const fmtDateOnly = (v) =>
    v ? new Date(v).toLocaleDateString() : '-'

  return (
    <Card>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="h4 m-0">Inspections</h2>
        <Link to="/create">
          <Button variant="primary">Buat Baru</Button>
        </Link>
      </div>

      <StatusTabs active={active} onChange={setActive} forReviewCount={forReviewCount} />

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
                <th>Location</th>
                <th>Created</th>
                <th>ECD</th>
                <th>Related To</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((it) => {
                  const header = it.header || {}
                  return (
                    <tr key={it.id}>
                      <td>{it.no}</td>
                      <td>
                        <span className={`badge bg-${badgeVariant(it.status)}`}>
                          {it.status}
                        </span>
                      </td>
                      <td>{it.serviceType}</td>
                      <td>{it.scopeId}</td>
                      <td>{header.location || '-'}</td>
                      <td>{fmtDate(it.createdAt)}</td>
                      <td>{fmtDateOnly(header.estimatedCompletionDate)}</td>
                      <td>{header.relatedTo || '-'}</td>
                      <td>
                        <Link to={`/inspections/${it.id}`}>Detail</Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-muted py-3">
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