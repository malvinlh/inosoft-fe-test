import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchInspection } from '../store/inspectionSlice'
import Card from '../components/common/Card'

export default function InspectionDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selected } = useSelector(s => s.inspections)

  useEffect(() => { dispatch(fetchInspection(id)) }, [dispatch, id])

  if (!selected) return (
    <Card>
      <p className="text-muted mb-0">Loading...</p>
    </Card>
  )

  const statusVariant = {
    'New': 'secondary',
    'In Progress': 'info',
    'Ready to Review': 'warning',
    'Completed': 'success'
  }[selected.status] || 'secondary'

  return (
    <Card>
      <h2 className="h4 mb-3">Detail Inspection</h2>

      <section className="row g-3 mb-3">
        <div className="col-sm-6">
          <div><span className="text-muted">No:</span> <strong>{selected.no}</strong></div>
        </div>
        <div className="col-sm-6">
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">Status:</span>
            <span className={`badge bg-${statusVariant}`}>{selected.status}</span>
          </div>
        </div>
        <div className="col-sm-6">
          <div><span className="text-muted">Service:</span> {selected.serviceType}</div>
        </div>
        <div className="col-sm-6">
          <div><span className="text-muted">Scope:</span> {selected.scopeId}</div>
        </div>
        <div className="col-sm-6">
          <div><span className="text-muted">Created:</span> {new Date(selected.createdAt).toLocaleString()}</div>
        </div>
        <div className="col-sm-6">
          <div>
            <span className="text-muted">Customer:</span>{' '}
            {selected.customer?.name} {selected.customer?.ref ? `(${selected.customer.ref})` : ''}
          </div>
        </div>
      </section>

      <h3 className="h6 mt-3">Order Information</h3>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>Item</th>
              <th>Desc</th>
              <th>QtyReq</th>
              <th>Lots</th>
            </tr>
          </thead>
          <tbody>
            {(selected.orderInformation || []).map((o, idx) => (
              <tr key={idx}>
                <td>{o.item_code}</td>
                <td>{o.item_desc}</td>
                <td>{o.qtyRequired}</td>
                <td>{(o.lots || []).map(l => l.lotNo).join(', ') || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="h6 mt-3">Works</h3>
      <div className="d-flex flex-column gap-3">
        {(selected.works?.subscopes || []).map(sc => (
          <div key={sc.subscope_id} className="card">
            <div className="card-header fw-semibold">{sc.subscope_id}</div>
            <div className="card-body">
              {(sc.fields || []).map(f => (
                <div className="form-check mb-2" key={f.key}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`w-${sc.subscope_id}-${f.key}`}
                    checked={!!f.selected}
                    disabled
                    readOnly
                  />
                  <label className="form-check-label" htmlFor={`w-${sc.subscope_id}-${f.key}`}>
                    {f.key}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="h6 mt-3">Charges</h3>
      {(selected.charges || []).length ? (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>Code</th>
                <th>Desc</th>
                <th>Qty</th>
                <th>UoM</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {selected.charges.map((c, i) => (
                <tr key={i}>
                  <td>{c.code}</td>
                  <td>{c.desc}</td>
                  <td>{c.qty}</td>
                  <td>{c.uom}</td>
                  <td>{c.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted">-</p>
      )}
    </Card>
  )
}