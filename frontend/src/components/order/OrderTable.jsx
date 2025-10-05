export default function OrderTable({ rows = [] }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead className="table-light">
          <tr>
            <th scope="col">Item Code</th>
            <th scope="col">Description</th>
            <th scope="col">Qty Required</th>
            <th scope="col">Lots</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((r, idx) => (
              <tr key={idx}>
                <td>{r.item?.item_code || '-'}</td>
                <td>{r.item?.item_desc || '-'}</td>
                <td>{r.qtyRequired || 0}</td>
                <td>{(r.lots || []).map((l) => l.lotNo).join(', ') || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted py-3">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}