import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LotsEditor from '../../components/molecules/LotsEditor.jsx'

test('selecting a lot autofills allocation/owner/condition/availableQty', async () => {
  const user = userEvent.setup()
  const lotsPool = [
    { lotNo: 'LOT-AX-001', allocation: 'Project A', owner: 'MITME', condition: 'good', availableQty: 8 }
  ]
  const onChange = jest.fn()

  render(
    <LotsEditor
      lotsPool={lotsPool}
      rows={[{ lotNo: '', allocation: '', owner: '', condition: '', availableQty: 0 }]}
      onChange={onChange}
    />
  )

  await user.selectOptions(screen.getByRole('combobox'), 'LOT-AX-001')

  expect(onChange).toHaveBeenCalledWith([
    expect.objectContaining({
      lotNo: 'LOT-AX-001',
      allocation: 'Project A',
      owner: 'MITME',
      condition: 'good',
      availableQty: 8
    })
  ])
})