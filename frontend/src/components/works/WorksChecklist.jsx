export default function WorksChecklist({ template, selected, onToggle }) {
  if (!template) return <p>Tidak ada template.</p>
  return (
    <div className="works">
      {template.works.map(w => (
        <fieldset key={w.subscope_id} className="workset">
          <legend>{w.subscope_name}</legend>
          {w.fields.map(f => {
            const checked = selected?.[f.key] ?? !!f.selected
            return (
              <label key={f.key} className="checkbox">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={()=>onToggle(f.key, !checked)}
                />
                {f.label}
              </label>
            )
          })}
        </fieldset>
      ))}
    </div>
  )
}