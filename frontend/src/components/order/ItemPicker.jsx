import Select from '../common/Select'

export default function ItemPicker({ items, value, onChange, className = '', size = '' }) {
  return (
    <Select
      className={`${size ? `form-select-${size}` : ''} ${className}`}
      value={value?.id_item || ''}
      onChange={(e) => {
        const it = items.find(x => x.id_item === e.target.value)
        onChange(it || null)
      }}
      aria-label="Pilih item"
    >
      <option value="">Pilih item...</option>
      {items.map(it => (
        <option key={it.id_item} value={it.id_item}>
          {it.item_code} — {it.item_desc}
        </option>
      ))}
    </Select>
  )
}