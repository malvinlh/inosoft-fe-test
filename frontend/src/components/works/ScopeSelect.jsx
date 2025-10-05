export default function ScopeSelect({ scopes, value, onChange }) {
  return (
    <div className="mb-3">
      <select
        className="form-select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">Pilih scope...</option>
        {scopes.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  )
}