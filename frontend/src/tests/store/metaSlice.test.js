import reducer, { bootstrapMeta } from '../../store/metaSlice'
import { dropdownsFixture, templatesFixture, itemsFixture } from '../fixtures'

jest.mock('../../api/mockApi', () => ({
  getDropdowns: jest.fn().mockResolvedValue({ data: require('../fixtures').dropdownsFixture }),
  getTemplates: jest.fn().mockResolvedValue({ data: require('../fixtures').templatesFixture }),
  getItems:     jest.fn().mockResolvedValue({ data: { items: require('../fixtures').itemsFixture } })
}))

describe('store/metaSlice bootstrapMeta', () => {
  test('pending → loading', () => {
    const initial = { dropdowns:null, templates:null, items:[], status:'idle', error:null }
    const next = reducer(initial, { type: bootstrapMeta.pending.type })
    expect(next.status).toBe('loading')
  })

  test('fulfilled stores dropdowns, templates, items', () => {
    const initial = { dropdowns:null, templates:null, items:[], status:'loading', error:null }
    const payload = { dropdowns: dropdownsFixture, templates: templatesFixture, items: itemsFixture }
    const next = reducer(initial, { type: bootstrapMeta.fulfilled.type, payload })
    expect(next.status).toBe('succeeded')
    expect(next.dropdowns.serviceTypes.length).toBeGreaterThan(0)
    expect(next.templates.templates[0].id).toBe('inspection-basic')
    expect(next.items).toHaveLength(2)
  })
})