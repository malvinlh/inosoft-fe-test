export default function WorksChecklist({ template, selected, onToggle }) {
  if (!template) return <p className="text-muted">Tidak ada template.</p>

  return (
    <div className="d-flex flex-column gap-3">
      {template.works.map((w) => (
        <div key={w.subscope_id} className="card">
          <div className="card-header fw-semibold">
            {w.subscope_name}
          </div>
          <div className="card-body">
            {w.fields.map((f) => {
              const checked = selected?.[f.key] ?? !!f.selected
              return (
                <div key={f.key} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`chk-${w.subscope_id}-${f.key}`}
                    checked={checked}
                    onChange={() => onToggle(f.key, !checked)}
                  />
                  <label className="form-check-label" htmlFor={`chk-${w.subscope_id}-${f.key}`}>
                    {f.label}
                  </label>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}