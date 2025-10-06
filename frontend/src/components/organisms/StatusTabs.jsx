export default function StatusTabs({ active, onChange, forReviewCount = 0 }) {
  const tabs = ['Open', 'For Review', 'Completed'];

  return (
    <ul className="nav nav-tabs mb-3">
      {tabs.map((t) => {
        const isActive = active === t;
        return (
          <li key={t} className="nav-item">
            <button
              type="button"
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => onChange(t)}
            >
              {t}
              {t === 'For Review' && forReviewCount > 0 && (
                <span className="ms-2 badge rounded-pill bg-info text-dark">
                  {forReviewCount}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}