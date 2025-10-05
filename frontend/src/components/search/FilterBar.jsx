import Select from '../common/Select'
import Button from '../common/Button'

export default function FilterBar({ criteria, options, onChange, onReset }) {
  const { lotNo, allocation, owner, condition } = criteria

  return (
    <div className="row g-3 align-items-end mb-3">
      <div className="col-md-3">
        <label className="form-label fw-semibold">Lot</label>
        <Select
          className="form-select"
          value={lotNo || ''}
          onChange={(e) => onChange({ lotNo: e.target.value || null })}
        >
          <option value="">(any)</option>
          {options.lotNumbers.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </Select>
      </div>

      <div className="col-md-3">
        <label className="form-label fw-semibold">Allocation</label>
        <Select
          className="form-select"
          value={allocation || ''}
          onChange={(e) => onChange({ allocation: e.target.value || null })}
        >
          <option value="">(any)</option>
          {options.allocations.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </Select>
      </div>

      <div className="col-md-3">
        <label className="form-label fw-semibold">Owner</label>
        <Select
          className="form-select"
          value={owner || ''}
          onChange={(e) => onChange({ owner: e.target.value || null })}
        >
          <option value="">(any)</option>
          {options.owners.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </Select>
      </div>

      <div className="col-md-3">
        <label className="form-label fw-semibold">Condition</label>
        <Select
          className="form-select"
          value={condition || ''}
          onChange={(e) => onChange({ condition: e.target.value || null })}
        >
          <option value="">(any)</option>
          {options.conditions.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </Select>
      </div>

      <div className="col-12 d-flex justify-content-end">
        <Button
          type="button"
          onClick={onReset}
          className="btn btn-outline-secondary"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}