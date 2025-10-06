import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { postInspection } from '../../store/inspectionSlice'
import Card from '../atoms/Card'
import Button from '../atoms/Button'
import Select from '../atoms/Select'
import Input from '../atoms/Input'
import ScopeSelect from '../molecules/ScopeSelect'
import ItemPicker from '../molecules/ItemPicker'
import LotsEditor from '../molecules/LotsEditor'
import { filterLots, deriveOptions } from '../../utils/filter'

export default function CreateInspection() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { dropdowns, templates, items } = useSelector(s => s.meta)

  const [serviceType, setServiceType] = useState('')
  const [scopeId, setScopeId] = useState('')
  const [worksState, setWorksState] = useState({})
  const [customer, setCustomer] = useState({ name: '', ref: '' })
  const [chargeToCustomer, setChargeToCustomer] = useState(true)
  const [note, setNote] = useState('')

  const [headerExtras, setHeaderExtras] = useState({
    location: '',
    estimatedCompletionDate: '',
    relatedTo: '',
    dcCode: ''
  })

  const [orderRows, setOrderRows] = useState([{ item: null, qtyRequired: 1, lots: [] }])

  const [criteria, setCriteria] = useState({ lotNo: null, allocation: null, owner: null, condition: null })
  const lotsPool = useMemo(() => filterLots(items, criteria), [items, criteria])
  const options = useMemo(() => deriveOptions(lotsPool), [lotsPool])

  const scopeTemplate = useMemo(() => {
    const all = templates?.templates || []
    return all.find(t => t.id === scopeId)
  }, [templates, scopeId])

  useEffect(() => {
    if (!scopeTemplate) {
      setWorksState({})
      return
    }
    const offState = {}
    scopeTemplate.works.forEach(group => {
      (group.fields || []).forEach(f => {
        offState[f.key] = false
      })
    })
    setWorksState(offState)
  }, [scopeTemplate])

  const toggleWork = (key, val) => setWorksState(prev => ({ ...prev, [key]: val }))
  const addOrder    = () => setOrderRows(r => [...r, { item: null, qtyRequired: 1, lots: [] }])
  const removeOrder = (idx) => setOrderRows(r => r.filter((_, i) => i !== idx))
  const updateOrder = (idx, patch) => setOrderRows(r => r.map((row, i) => (i === idx ? { ...row, ...patch } : row)))
  const resetCriteria = () => setCriteria({ lotNo: null, allocation: null, owner: null, condition: null })

  const canSubmit =
    serviceType && scopeId && orderRows.length > 0 && orderRows.every(r => (r.qtyRequired || 0) >= 1)

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return

    const payload = {
      serviceType,
      scopeId,
      works: { template_name: scopeTemplate?.template_name, selected: worksState },
      customer: { ...customer, charge: chargeToCustomer ? 'ON' : 'OFF' },
      header: {
        notes: note,
        location: headerExtras.location,
        estimatedCompletionDate: headerExtras.estimatedCompletionDate,
        relatedTo: headerExtras.relatedTo,
        dcCode: headerExtras.dcCode
      },
      orderInformation: orderRows.map(r => ({
        id_item: r.item?.id_item,
        item_code: r.item?.item_code,
        item_desc: r.item?.item_desc,
        qtyRequired: Number(r.qtyRequired || 0),
        lots: r.lots
      }))
    }

    const res = await dispatch(postInspection(payload)).unwrap()
    navigate(`/inspections/${res.id}`)
  }

  return (
    <Card>
      <h2 className="h4 mb-3">Create Yard Services</h2>

      <form className="row g-3" onSubmit={submit}>
        <section className="col-lg-8 d-flex flex-column gap-3">
          <div className="card mb-2">
            <div className="card-body">
              <h6 className="card-title mb-3">Setup</h6>

              <div className="row gy-2 gx-4">
                <div className="col-md-6">
                  <label className="form-label">
                    Service Type<span className="text-danger">*</span>
                  </label>
                  <Select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Pilih service...</option>
                    {(dropdowns?.serviceTypes || []).map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </Select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Scope of Work<span className="text-danger">*</span>
                  </label>
                  <ScopeSelect
                    scopes={dropdowns?.scopes || []}
                    value={scopeId}
                    onChange={setScopeId}
                  />
                </div>

                <div className="col-md-6 mt-0">
                  <label className="form-label">Customer Name</label>
                  <Input
                    className="form-control"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  />
                </div>

                <div className="col-md-6 mt-0">
                  <label className="form-label">Customer Ref</label>
                  <Input
                    className="form-control"
                    value={customer.ref}
                    onChange={(e) => setCustomer({ ...customer, ref: e.target.value })}
                  />
                </div>

                <div className="col-md-6 mt-3">
                  <label className="form-label">Location</label>
                  <Input
                    className="form-control"
                    placeholder="Enter location"
                    value={headerExtras.location}
                    onChange={(e) => setHeaderExtras({ ...headerExtras, location: e.target.value })}
                  />
                </div>

                <div className="col-md-6 mt-3">
                  <label className="form-label">Estimated Completion Date</label>
                  <Input
                    type="date"
                    className="form-control"
                    value={headerExtras.estimatedCompletionDate}
                    onChange={(e) => setHeaderExtras({ ...headerExtras, estimatedCompletionDate: e.target.value })}
                  />
                </div>

                <div className="col-md-6 mt-4">
                  <label className="form-label">Related To</label>
                  <Input
                    className="form-control"
                    placeholder="Reference number / project"
                    value={headerExtras.relatedTo}
                    onChange={(e) => setHeaderExtras({ ...headerExtras, relatedTo: e.target.value })}
                  />
                </div>

                <div className="col-md-6 mt-4">
                  <label className="form-label">D/C Code</label>
                  <Input
                    className="form-control"
                    placeholder="Optional internal code"
                    value={headerExtras.dcCode}
                    onChange={(e) => setHeaderExtras({ ...headerExtras, dcCode: e.target.value })}
                  />
                </div>

                <div className="col-12 mt-4">
                  <label className="form-label mb-2">Scope Included</label>
                  <div className="d-flex flex-wrap gap-2">
                    {scopeTemplate ? (
                      scopeTemplate.works.flatMap(w => w.fields).map(f => {
                        const active = !!worksState[f.key]
                        return (
                          <button
                            key={f.key}
                            type="button"
                            className={`btn btn-sm ${active ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                            onClick={() => toggleWork(f.key, !active)}
                          >
                            {f.label}
                          </button>
                        )
                      })
                    ) : (
                      <small className="text-muted">
                        Pilih scope untuk melihat dan memilih checklist.
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-2">
            <div className="card-body">
              <div className="card-title h6 m-0 mb-3">Search Lots</div>

              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Lot</label>
                  <Select
                    value={criteria.lotNo || ''}
                    onChange={e => setCriteria(p => ({ ...p, lotNo: e.target.value || null }))}
                  >
                    <option value="">(any)</option>
                    {(options.lotNumbers || []).map(v => <option key={v} value={v}>{v}</option>)}
                  </Select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Allocation</label>
                  <Select
                    value={criteria.allocation || ''}
                    onChange={e => setCriteria(p => ({ ...p, allocation: e.target.value || null }))}
                  >
                    <option value="">(any)</option>
                    {(options.allocations || []).map(v => <option key={v} value={v}>{v}</option>)}
                  </Select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Owner</label>
                  <Select
                    value={criteria.owner || ''}
                    onChange={e => setCriteria(p => ({ ...p, owner: e.target.value || null }))}
                  >
                    <option value="">(any)</option>
                    {(options.owners || []).map(v => <option key={v} value={v}>{v}</option>)}
                  </Select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Condition</label>
                  <Select
                    value={criteria.condition || ''}
                    onChange={e => setCriteria(p => ({ ...p, condition: e.target.value || null }))}
                  >
                    <option value="">(any)</option>
                    {(options.conditions || []).map(v => <option key={v} value={v}>{v}</option>)}
                  </Select>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <Button type="button" variant="outline-secondary" onClick={resetCriteria}>
                  Reset
                </Button>
              </div>
            </div>
          </div>

          <div className="card mb-2">
            <div className="card-body">
              <div className="order-header mb-2">
                <div className="card-title h6 m-0">Order Information</div>
                <Button type="button" variant="secondary" onClick={addOrder}>
                  + Add Item
                </Button>
              </div>

              {orderRows.map((row, idx) => {
                const pool = row.item ? lotsPool.filter(l => l.item.id_item === row.item.id_item) : lotsPool

                return (
                  <div key={idx} className="order-card">
                    <div className="order-grid">
                      <div className="field-like">
                        <label className="form-label">Item</label>
                        <ItemPicker
                          items={items}
                          value={row.item}
                          onChange={(it) => updateOrder(idx, { item: it, lots: [] })}
                        />
                      </div>

                      <div className="field-like">
                        <label className="form-label">Qty Required<span className="text-danger">*</span></label>
                        <Input
                          type="number"
                          min="1"
                          value={row.qtyRequired}
                          onChange={e =>
                            updateOrder(idx, { qtyRequired: Math.max(1, Number(e.target.value || 1)) })
                          }
                        />
                      </div>

                      <div className="field-like d-flex flex-column">
                        <label className="form-label invisible">Action</label>
                        <Button
                          type="button"
                          variant="outline-danger"
                          onClick={() => removeOrder(idx)}
                          className="align-self-start"
                        >
                          Hapus Item
                        </Button>
                      </div>
                    </div>

                    <div className="subblock">
                      <div className="subblock__title mt-3">Lots</div>
                      <LotsEditor
                        lotsPool={pool}
                        rows={row.lots}
                        onChange={(lots) => updateOrder(idx, { lots })}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="card-title h6 mb-2">Note to Yard</div>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter note"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
          </div>
        </section>

        <aside className="col-lg-4">
          <div style={{ top: 12 }}>
            <div className="card charge-card">
              <div className="card-body">
                <div className="card-title h6">Charge & Status</div>

                <div className="switch-row">
                  <label htmlFor="chargeSwitch" className="me-3 mb-0">Charge to Customer</label>
                  <input
                    id="chargeSwitch"
                    className="form-check-input"
                    type="checkbox"
                    checked={chargeToCustomer}
                    onChange={e => setChargeToCustomer(e.target.checked)}
                  />
                </div>

                <div className="status-row">
                  <span>Status</span>
                  <span className="badge">Draft</span>
                </div>

                <Button type="submit" variant="primary" disabled={!canSubmit}>
                  Submit
                </Button>

                {!canSubmit && (
                  <p className="hint">Lengkapi Service Type, Scope, dan Qty ≥ 1.</p>
                )}
              </div>
            </div>
          </div>
        </aside>
      </form>
    </Card>
  )
}