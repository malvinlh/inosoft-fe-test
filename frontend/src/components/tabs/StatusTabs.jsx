export default function StatusTabs({ active, onChange }) {
  const tabs = ['Open', 'For Review', 'Completed']

  return (
    <ul className="nav nav-tabs mb-3">
      {tabs.map((t) => (
        <li className="nav-item" key={t}>
          <button
            className={`nav-link ${active === t ? 'active' : ''}`}
            onClick={() => onChange(t)}
            type="button"
          >
            {t}
          </button>
        </li>
      ))}
    </ul>
  )
}