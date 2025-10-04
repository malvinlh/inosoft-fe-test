import Select from '../common/Select'

export default function ScopeSelect({ scopes, value, onChange }) {
  return (
    <Select value={value || ''} onChange={e=>onChange(e.target.value || null)}>
      <option value="">Pilih scope...</option>
      {scopes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
    </Select>
  )
}