import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatusTabs from '../../components/organisms/StatusTabs';

test('clicking tabs calls onChange with correct label', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(<StatusTabs active="Open" onChange={onChange} />);

  await user.click(screen.getByRole('button', { name: /for review/i }));
  expect(onChange).toHaveBeenCalledWith('For Review');

  await user.click(screen.getByRole('button', { name: /completed/i }));
  expect(onChange).toHaveBeenCalledWith('Completed');
});