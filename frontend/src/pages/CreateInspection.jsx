import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { postInspection } from '../store/inspectionSlice'
import { getItems } from '../api/mockApi'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Select from '../components/common/Select'
import Input from '../components/common/Input'
import ScopeSelect from '../components/works/ScopeSelect'
import ItemPicker from '../components/order/ItemPicker'
import LotsEditor from '../components/order/LotsEditor'
import { filterLots, deriveOptions } from '../utils/filter'

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      className={`chip ${active ? 'chip--on' : ''}`}
      onClick={onClick}
      aria-pressed={!!active}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </button>
  )
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label className="field__label">{label}</label>
      <div className="field__control">{children}</div>
    </div>
  )
}

export default function CreateInspection() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { dropdowns, templates } = useSelector(s => s.meta)

  const [serviceType, setServiceType] = useState('')
  const [scopeId, setScopeId] = useState('')
  const [worksState, setWorksState] = useState({})
  const [customer, setCustomer] = useState({ name: '', ref: '' })
  const [chargeToCustomer, setChargeToCustomer] = useState(true)
  const [note, setNote] = useState('')

  const [items, setItems] = useState([])
  const [orderRows, setOrderRows] = useState([{ item: null, qtyRequired: 1, lots: [] }])

  const [criteria, setCriteria] = useState({ lotNo: null, allocation: null, owner: null, condition: null })
  const lotsPool = useMemo(() => filterLots(items, criteria), [items, criteria])
  const options = useMemo(() => deriveOptions(lotsPool), [lotsPool])

  useEffect(() => { getItems().then(({ data }) => setItems(data.items || [])) }, [])

  const scopeTemplate = useMemo(() => {
    const all = templates?.templates || []
    return all.find(t => t.id === scopeId)
  }, [templates, scopeId])

  useEffect(() => {
    if (!scopeTemplate) { 
      setWorksState({});
      return;
    }
    const offState = {};
    scopeTemplate.works.forEach(group => {
      (group.fields || []).forEach(f => {
        offState[f.key] = false;
      });
    });
    setWorksState(offState);
  }, [scopeTemplate]);

  const toggleWork = (key, val) => setWorksState(prev => ({ ...prev, [key]: val }))

  const addOrder = () => setOrderRows(r => [...r, { item: null, qtyRequired: 1, lots: [] }])
  const removeOrder = (idx) => setOrderRows(r => r.filter((_, i) => i !== idx))
  const updateOrder = (idx, patch) => setOrderRows(r => r.map((row, i) => (i === idx ? { ...row, ...patch } : row)))

  const resetCriteria = () => setCriteria({ lotNo: null, allocation: null, owner: null, condition: null })

  const canSubmit = serviceType && scopeId && orderRows.length > 0 && orderRows.every(r => (r.qtyRequired || 0) >= 1)

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return

    const payload = {
      serviceType,
      scopeId,
      works: { template_name: scopeTemplate?.template_name, selected: worksState },
      customer: { ...customer, charge: chargeToCustomer ? 'ON' : 'OFF' },
      header: { notes: note },
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
      <h2>Create Yard Services</h2>

      <form className="cis-grid" onSubmit={submit}>
        <section className="cis-left">
          <div className="panel">
            <div className="panel__title">Setup</div>

            <div className="setup-grid">
              <Field label="Service Type*">
                <Select value={serviceType} onChange={e => setServiceType(e.target.value)}>
                  <option value="">Pilih service...</option>
                  {(dropdowns?.serviceTypes || []).map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Scope of Work*">
                <ScopeSelect scopes={dropdowns?.scopes || []} value={scopeId} onChange={setScopeId} />
              </Field>

              <Field label="Customer Name">
                <Input value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
              </Field>

              <Field label="Customer Ref">
                <Input value={customer.ref} onChange={e => setCustomer({ ...customer, ref: e.target.value })} />
              </Field>
            </div>

            <div className="field setup-scope">
              <label className="field__label">Scope Included</label>
              <div className="chips">
                {scopeTemplate ? (
                  scopeTemplate.works.flatMap(w => w.fields).map(f => {
                    const active = !!(worksState[f.key])
                    return (
                      <Chip
                        key={f.key}
                        active={active}
                        onClick={() => toggleWork(f.key, !active)}
                      >
                        {f.label}
                      </Chip>
                    )
                  })
                ) : (
                  <span className="muted">Pilih scope untuk melihat dan memilih checklist.</span>
                )}
              </div>
            </div>
          </div>

          <div className="panel panel--full">
            <div className="panel__title">Search Lots</div>

            <div className="filterbar">
              <div>
                <label>Lot</label>
                <Select value={criteria.lotNo || ''} onChange={e => setCriteria(p => ({ ...p, lotNo: e.target.value || null }))}>
                  <option value="">(any)</option>
                  {(options.lotNumbers || []).map(v => <option key={v} value={v}>{v}</option>)}
                </Select>
              </div>
              <div>
                <label>Allocation</label>
                <Select value={criteria.allocation || ''} onChange={e => setCriteria(p => ({ ...p, allocation: e.target.value || null }))}>
                  <option value="">(any)</option>
                  {(options.allocations || []).map(v => <option key={v} value={v}>{v}</option>)}
                </Select>
              </div>
              <div>
                <label>Owner</label>
                <Select value={criteria.owner || ''} onChange={e => setCriteria(p => ({ ...p, owner: e.target.value || null }))}>
                  <option value="">(any)</option>
                  {(options.owners || []).map(v => <option key={v} value={v}>{v}</option>)}
                </Select>
              </div>
              <div>
                <label>Condition</label>
                <Select value={criteria.condition || ''} onChange={e => setCriteria(p => ({ ...p, condition: e.target.value || null }))}>
                  <option value="">(any)</option>
                  {(options.conditions || []).map(v => <option key={v} value={v}>{v}</option>)}
                </Select>
              </div>
            </div>

            <div className="panel__actions">
              <Button type="button" onClick={resetCriteria}>Reset</Button>
            </div>
          </div>

          <div className="panel panel--full">
            <div className="panel__title panel__title--withbtn">
              <span>Order Information</span>
              <Button type="button" onClick={addOrder}>+ Add Item</Button>
            </div>

            {orderRows.map((row, idx) => {
              const pool = row.item ? lotsPool.filter(l => l.item.id_item === row.item.id_item) : lotsPool
              return (
                <div key={idx} className="order-card">
                  <div className="grid three">
                    <Field label="Item">
                      <ItemPicker items={items} value={row.item} onChange={(it) => updateOrder(idx, { item: it, lots: [] })} />
                    </Field>
                    <Field label="Qty Required*">
                      <Input
                        type="number"
                        min="1"
                        value={row.qtyRequired}
                        onChange={e => updateOrder(idx, { qtyRequired: Math.max(1, Number(e.target.value || 1)) })}
                      />
                    </Field>
                    <Field label=" ">
                      <Button type="button" onClick={() => removeOrder(idx)}>Hapus Item</Button>
                    </Field>
                  </div>

                  <div className="subblock">
                    <div className="subblock__title">Lots</div>
                    <LotsEditor lotsPool={pool} rows={row.lots} onChange={(lots) => updateOrder(idx, { lots })} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="panel panel--full">
            <div className="panel__title">Note to Yard</div>
            <textarea
              className="textarea"
              rows="3"
              placeholder="Enter note"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
        </section>

        <aside className="cis-right sticky">
          <div className="panel">
            <div className="panel__title">Charge & Status</div>

            <div className="switchline">
              <span>Charge to Customer</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={chargeToCustomer}
                  onChange={e => setChargeToCustomer(e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="statusline">
              <span>Status</span>
              <span className="badge">Draft</span>
            </div>

            <div className="actions mt-2">
              <Button type="submit" disabled={!canSubmit}>Submit</Button>
            </div>
            {!canSubmit && <p className="muted mt-1">Lengkapi Service Type, Scope, dan Qty ≥ 1.</p>}
          </div>
        </aside>
      </form>
    </Card>
  )
}