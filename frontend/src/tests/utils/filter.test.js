import { filterLots, deriveOptions } from '../../utils/filter';
import { itemsFixture } from '../fixtures';

describe('utils/filter', () => {
  test('filterLots filters by multiple criteria', () => {
    const res = filterLots(itemsFixture, { lotNo: null, allocation: 'Project A', owner: null, condition: 'good' });
    expect(res).toHaveLength(1);
    expect(res[0].lotNo).toBe('LOT-AX-001');
  });

  test('deriveOptions returns unique lists based on filtered lots', () => {
    const filtered = filterLots(itemsFixture, { lotNo: null, allocation: null, owner: null, condition: 'good' });
    const opts = deriveOptions(filtered);
    expect(opts.lotNumbers).toEqual(expect.arrayContaining(['PO-2024-00457-A-RR', 'LOT-AX-001']));
    expect(opts.allocations).toEqual(expect.arrayContaining(['Unallocated', 'Project A']));
    expect(opts.owners).toContain('MITME');
    expect(opts.conditions).toContain('good');
  });
});