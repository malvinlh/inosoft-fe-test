import { render, screen, within, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LotsEditor from '../../components/molecules/LotsEditor.jsx'

test('dedupes selected lot across rows but allows current row selection', async () => {
  const user = userEvent.setup()
  const lotsPool = [
    { lotNo: 'LOT-AX-001', allocation: 'A', owner: 'X', condition: 'good', availableQty: 1 },
    { lotNo: 'LOT-BX-777', allocation: 'B', owner: 'Y', condition: 'good', availableQty: 1 }
  ]

  const rows = [
    { lotNo: '', allocation: '', owner: '', condition: '', availableQty: 0 },
    { lotNo: '', allocation: '', owner: '', condition: '', availableQty: 0 }
  ]

  const onChange = jest.fn()

  const { rerender } = render(<LotsEditor lotsPool={lotsPool} rows={rows} onChange={onChange} />)

  const firstRow = document.querySelectorAll('.lots-row')[0]
  const firstSelect = within(firstRow).getByRole('combobox')
  await user.selectOptions(firstSelect, 'LOT-AX-001')

  const updatedRows = [
    { lotNo: 'LOT-AX-001', allocation: 'A', owner: 'X', condition: 'good', availableQty: 1 },
    { lotNo: '', allocation: '', owner: '', condition: '', availableQty: 0 }
  ]

  rerender(<LotsEditor lotsPool={lotsPool} rows={updatedRows} onChange={onChange} />)

  const secondRow = document.querySelectorAll('.lots-row')[1]
  const secondSelect = within(secondRow).getByRole('combobox')

  const opts = Array.from(secondSelect.querySelectorAll('option')).map(o => o.value)
  expect(opts).toContain('')
  expect(opts).toContain('LOT-BX-777')
  expect(opts).not.toContain('LOT-AX-001')
})