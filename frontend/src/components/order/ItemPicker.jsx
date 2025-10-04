import Select from '../common/Select'

export default function ItemPicker({ items, value, onChange }) {
  return (
    <Select value={value?.id_item || ''} onChange={(e)=>{
      const it = items.find(x => x.id_item === e.target.value)
      onChange(it || null)
    }}>
      <option value="">Pilih item...</option>
      {items.map(it => (
        <option key={it.id_item} value={it.id_item}>
          {it.item_code} — {it.item_desc}
        </option>
      ))}
    </Select>
  )
}