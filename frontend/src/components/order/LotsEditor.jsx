import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'

export default function LotsEditor({ lotsPool = [], rows = [], onChange }) {
  const changeRow = (idx, patch) => {
    const next = rows.map((r, i) => (i === idx ? { ...r, ...patch } : r))
    onChange(next)
  }

  const chosen = new Set(rows.map(r => r.lotNo).filter(Boolean))
  const optionsForRow = (idx) => {
    const current = rows[idx]?.lotNo
    return lotsPool.filter(l => !chosen.has(l.lotNo) || l.lotNo === current)
  }

  const addRow = () =>
    onChange([...rows, { lotNo: '', allocation: '', owner: '', condition: '', availableQty: 0 }])

  const removeRow = (idx) => onChange(rows.filter((_, i) => i !== idx))

  return (
    <div className="lots-editor">
      <div className="lots-head">
        <span className="head-lot">Lot</span>
        <span>Alloc</span>
        <span>Owner</span>
        <span>Cond</span>
        <span>Avail</span>
        <span></span>
      </div>

      {rows.map((r, idx) => (
        <div key={idx} className="lots-row align-items-center">
          <div className="lot-cell wide">
            <Select
              value={r.lotNo || ''}
              onChange={(e) => {
                const val = e.target.value
                const selected = lotsPool.find((l) => l.lotNo === val)
                changeRow(
                  idx,
                  selected
                    ? {
                        lotNo: selected.lotNo,
                        allocation: selected.allocation,
                        owner: selected.owner,
                        condition: selected.condition,
                        availableQty: Number(selected.availableQty) || 0,
                      }
                    : { lotNo: '', allocation: '', owner: '', condition: '', availableQty: 0 }
                )
              }}
            >
              <option value="">Pilih lot...</option>
              {optionsForRow(idx).map((l) => (
                <option key={l.lotNo} value={l.lotNo}>
                  {l.lotNo}
                </option>
              ))}
            </Select>
          </div>

          <div className="lot-cell mid">
            <Input value={r.allocation || ''} onChange={(e) => changeRow(idx, { allocation: e.target.value })} />
          </div>

          <div className="lot-cell mid">
            <Input value={r.owner || ''} onChange={(e) => changeRow(idx, { owner: e.target.value })} />
          </div>

          <div className="lot-cell mid">
            <Input value={r.condition || ''} onChange={(e) => changeRow(idx, { condition: e.target.value })} />
          </div>

          <div className="lot-cell small">
            <Input value={r.availableQty ?? 0} readOnly className="text-center" />
          </div>

          <div className="lot-cell action">
            <Button type="button" variant="outline-danger" size="sm" onClick={() => removeRow(idx)}>
              Hapus
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={addRow} className="mt-2">
        Tambah Lot
      </Button>
    </div>
  )
}