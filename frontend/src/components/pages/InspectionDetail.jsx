import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { fetchInspection } from '../../store/inspectionSlice'
import Card from '../atoms/Card'
import Button from '../atoms/Button'
import { toMap, lookup } from '../../utils/lookup'

export default function InspectionDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selected } = useSelector(s => s.inspections)
  const { dropdowns, templates } = useSelector(s => s.meta)

  useEffect(() => { dispatch(fetchInspection(id)) }, [dispatch, id])

  const fmtDate = (v) =>
    v ? new Date(v).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '-'

  const header    = selected?.header ?? {}
  const createdAt = useMemo(() => fmtDate(selected?.createdAt), [selected?.createdAt])
  const estDate   = useMemo(() => fmtDate(header?.estimatedCompletionDate), [header?.estimatedCompletionDate])

  const svcMap   = useMemo(() => toMap(dropdowns?.serviceTypes), [dropdowns])
  const scopeMap = useMemo(() => toMap(dropdowns?.scopes), [dropdowns])

  const tplForScope = useMemo(() => {
    const all = templates?.templates || []
    return all.find(t => t.id === selected?.scopeId) || null
  }, [templates, selected?.scopeId])

  const subsIndex = useMemo(() => {
    if (!tplForScope) return {}
    const idx = {}
    for (const w of tplForScope.works || []) {
      const labels = {}
      for (const f of w.fields || []) labels[f.key] = f.label || f.key
      idx[w.subscope_id] = { name: w.subscope_name || w.subscope_id, labels }
    }
    return idx
  }, [tplForScope])

  const getSubscopeName = (id) => subsIndex[id]?.name || id
  const getFieldLabel   = (subId, key) => subsIndex[subId]?.labels?.[key] || key

  if (!selected) {
    return (
      <Card>
        <p className="text-muted mb-0">Loading...</p>
      </Card>
    )
  }

  const statusVariant = ({
    'New': 'secondary',
    'In Progress': 'info',
    'Ready to Review': 'warning',
    'Completed': 'success'
  })[selected.status] || 'secondary'

  const chargeText =
    selected?.customer?.charge === 'ON'
      ? (selected?.customer?.name || 'ON')
      : (selected?.customer?.name ? `${selected.customer.name} (OFF)` : 'OFF')

  return (
    <Card>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="h4 m-0">Yard Services Details</h2>
        <Link to="/" className="text-decoration-none">
          <Button variant="secondary" className="w-100 d-sm-inline-block">
            ← Back to List
          </Button>
        </Link>
      </div>

      <section className="row g-3 mb-3">
        <div className="col-lg-9">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="text-muted">Request No.</div>
              <div className="fw-semibold">{selected.no}</div>
            </div>

            <div className="col-md-4">
              <div className="text-muted">Service Type</div>
              <div className="fw-semibold">
                {selected.serviceType ? lookup(svcMap, selected.serviceType) : '-'}
              </div>
            </div>

            <div className="col-md-4">
              <div className="text-muted">Scope</div>
              <div className="fw-semibold">
                {selected.scopeId ? lookup(scopeMap, selected.scopeId) : '-'}
              </div>
            </div>

            <div className="col-md-4">
              <div className="text-muted">Location</div>
              <div className="fw-semibold">{header.location || '-'}</div>
            </div>

            <div className="col-md-4">
              <div className="text-muted">Date Submitted</div>
              <div className="fw-semibold">{createdAt}</div>
            </div>

            <div className="col-md-4">
              <div className="text-muted">Estimated Completion Date</div>
              <div className="fw-semibold">{estDate}</div>
            </div>

            <div className="col-md-4">
              <div className="text-muted">Related To</div>
              <div className="fw-semibold">
                {header.relatedTo ? <span className="text-info">{header.relatedTo}</span> : '-'}
              </div>
            </div>

            <div className="col-md-12">
              <hr className="my-2" />
            </div>

            <div className="col-md-6">
              <div className="text-muted">D/C Code</div>
              <div className="fw-semibold">{header.dcCode || '-'}</div>
            </div>

            <div className="col-md-6">
              <div className="text-muted">Customer</div>
              <div>
                {selected.customer?.name || '-'}
                {selected.customer?.ref ? ` (${selected.customer.ref})` : ''}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="d-flex flex-column gap-2 ps-lg-3" style={{ borderLeft: '1px solid #eef2f7' }}>
            <div>
              <div className="text-muted">Charge to customer</div>
              <div className="fw-semibold">{chargeText}</div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted">Status</span>
              <span className={`badge bg-${statusVariant}`}>{selected.status}</span>
            </div>
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
              <th>Qty Req</th>
              <th>Lot</th>
              <th>Allocation</th>
              <th>Owner</th>
              <th>Condition</th>
              <th>Available Qty</th>
            </tr>
          </thead>
          <tbody>
            {(selected.orderInformation || []).map((o, idx) => {
              const lots = Array.isArray(o.lots) ? o.lots : []
              const show = (getter) =>
                lots.length
                  ? lots.map((l, i) => <div key={i}>{getter(l) ?? '-'}</div>)
                  : '-'

              return (
                <tr key={idx}>
                  <td>{o.item_code || '-'}</td>
                  <td>{o.item_desc || '-'}</td>
                  <td>{o.qtyRequired ?? 0}</td>
                  <td>{show((l) => l.lotNo)}</td>
                  <td>{show((l) => l.allocation)}</td>
                  <td>{show((l) => l.owner)}</td>
                  <td>{show((l) => l.condition)}</td>
                  <td>{show((l) => (l.availableQty ?? 0))}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h3 className="h6 mt-3">Scope of Work</h3>
      <div className="d-flex flex-column gap-3">
        {(selected.works?.subscopes || []).map((sc) => (
          <div key={sc.subscope_id} className="card">
            <div className="card-header fw-semibold">
              {getSubscopeName(sc.subscope_id)}
            </div>
            <div className="card-body">
              {(sc.fields || []).map((f) => (
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
                    {getFieldLabel(sc.subscope_id, f.key)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="h6 mt-3">Charges to Customer</h3>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: '80px' }}>No</th>
              <th>Code</th>
              <th>Desc</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {(selected.charges || []).length > 0 ? (
              selected.charges.map((c, i) => {
                const qty   = Number(c.qty) || 0
                const price = Number(c.price) || 0
                const unit  = (c.uom || 'pcs').toUpperCase()
                const cur   = (c.currency || 'USD').toUpperCase()
                const total = qty * price

                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{c.code || '-'}</td>
                    <td>{c.desc || '-'}</td>
                    <td>{qty} {unit}</td>
                    <td>{`${cur} $${price.toFixed(2)}`}</td>
                    <td>{`${cur} $${total.toFixed(2)}`}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No charges recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}