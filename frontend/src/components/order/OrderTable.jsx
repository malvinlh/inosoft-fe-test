export default function OrderTable({ rows }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Item Code</th><th>Description</th><th>Qty Required</th><th>Lots</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r,idx)=>(
          <tr key={idx}>
            <td>{r.item?.item_code || '-'}</td>
            <td>{r.item?.item_desc || '-'}</td>
            <td>{r.qtyRequired || 0}</td>
            <td>
              {(r.lots||[]).map(l=> l.lotNo).join(', ')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}