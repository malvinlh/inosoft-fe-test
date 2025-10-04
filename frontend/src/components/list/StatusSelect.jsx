const OPTIONS = ['New','In Progress','Ready to Review','Completed'];

export default function StatusSelect({ value='New', onChange }) {
  return (
    <select className="status-select" value={value} onChange={e=>onChange?.(e.target.value)}>
      {OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}