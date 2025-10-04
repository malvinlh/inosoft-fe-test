import Select from '../common/Select'
import Button from '../common/Button'

export default function FilterBar({ criteria, options, onChange, onReset }) {
  const { lotNo, allocation, owner, condition } = criteria

  return (
    <div className="filterbar">
      <div>
        <label>Lot</label>
        <Select value={lotNo || ''} onChange={e=>onChange({lotNo: e.target.value || null})}>
          <option value="">(any)</option>
          {options.lotNumbers.map(v => <option key={v} value={v}>{v}</option>)}
        </Select>
      </div>

      <div>
        <label>Allocation</label>
        <Select value={allocation || ''} onChange={e=>onChange({allocation: e.target.value || null})}>
          <option value="">(any)</option>
          {options.allocations.map(v => <option key={v} value={v}>{v}</option>)}
        </Select>
      </div>

      <div>
        <label>Owner</label>
        <Select value={owner || ''} onChange={e=>onChange({owner: e.target.value || null})}>
          <option value="">(any)</option>
          {options.owners.map(v => <option key={v} value={v}>{v}</option>)}
        </Select>
      </div>

      <div>
        <label>Condition</label>
        <Select value={condition || ''} onChange={e=>onChange({condition: e.target.value || null})}>
          <option value="">(any)</option>
          {options.conditions.map(v => <option key={v} value={v}>{v}</option>)}
        </Select>
      </div>

      <Button type="button" onClick={onReset}>Reset</Button>
    </div>
  )
}