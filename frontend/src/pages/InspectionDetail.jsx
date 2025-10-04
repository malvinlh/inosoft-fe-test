import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchInspection } from '../store/inspectionSlice'
import Card from '../components/common/Card'

export default function InspectionDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selected } = useSelector(s=>s.inspections)

  useEffect(()=>{ dispatch(fetchInspection(id)) }, [dispatch,id])

  if (!selected) return <Card><p>Loading...</p></Card>

  return (
    <Card>
      <h2>Detail Inspection</h2>
      <section className="grid two">
        <div><strong>No:</strong> {selected.no}</div>
        <div><strong>Status:</strong> {selected.status}</div>
        <div><strong>Service:</strong> {selected.serviceType}</div>
        <div><strong>Scope:</strong> {selected.scopeId}</div>
        <div><strong>Created:</strong> {new Date(selected.createdAt).toLocaleString()}</div>
        <div><strong>Customer:</strong> {selected.customer?.name} ({selected.customer?.ref})</div>
      </section>

      <h3 style={{marginTop:16}}>Order Information</h3>
      <table className="table">
        <thead><tr><th>Item</th><th>Desc</th><th>QtyReq</th><th>Lots</th></tr></thead>
        <tbody>
          {(selected.orderInformation||[]).map((o,idx)=>(
            <tr key={idx}>
              <td>{o.item_code}</td>
              <td>{o.item_desc}</td>
              <td>{o.qtyRequired}</td>
              <td>{(o.lots||[]).map(l=>l.lotNo).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{marginTop:16}}>Works</h3>
      <div className="works">
        {(selected.works?.subscopes||[]).map(sc => (
          <fieldset key={sc.subscope_id} className="workset">
            <legend>{sc.subscope_id}</legend>
            {(sc.fields||[]).map(f => (
              <div key={f.key}>
                <input type="checkbox" checked={!!f.selected} readOnly /> {f.key}
              </div>
            ))}
          </fieldset>
        ))}
      </div>

      <h3 style={{marginTop:16}}>Charges</h3>
      {(selected.charges||[]).length ? (
        <table className="table">
          <thead><tr><th>Code</th><th>Desc</th><th>Qty</th><th>UoM</th><th>Price</th></tr></thead>
          <tbody>
            {selected.charges.map((c,i)=>(
              <tr key={i}><td>{c.code}</td><td>{c.desc}</td><td>{c.qty}</td><td>{c.uom}</td><td>{c.price}</td></tr>
            ))}
          </tbody>
        </table>
      ) : <p>-</p>}
    </Card>
  )
}