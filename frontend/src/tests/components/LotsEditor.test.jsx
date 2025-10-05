import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LotsEditor from '../../components/molecules/LotsEditor.jsx';

describe('LotsEditor component', () => {
  test('should render rows and allow lot selection', async () => {
    const lotsPool = [
      { lotNo: 'LOT-AX-001', allocation: 'Project A', owner: 'MITME', condition: 'good', availableQty: 8 },
      { lotNo: 'LOT-BX-777', allocation: 'Project B', owner: 'ONSHORE', condition: 'quarantine', availableQty: 10 }
    ];
    const handle = jest.fn();
    const user = userEvent.setup();

    render(
      <LotsEditor
        lotsPool={lotsPool}
        rows={[{ lotNo: '', allocation: '', owner: '', condition: '', availableQty: 0 }]}
        onChange={handle}
      />
    );

    const select = screen.getAllByRole('combobox')[0];
    await user.selectOptions(select, 'LOT-AX-001');
    expect(handle).toHaveBeenCalled();
  });
});