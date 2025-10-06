import reducer, { fetchInspections, fetchInspection, postInspection } from '../../store/inspectionSlice'
import { inspectionsListFixture } from '../fixtures'

describe('store/inspectionSlice', () => {
  test('fetchInspections.fulfilled sets list & status', () => {
    const initial = { list: [], selected: null, status: 'idle', error: null }
    const next = reducer(initial, { type: fetchInspections.fulfilled.type, payload: inspectionsListFixture })
    expect(next.status).toBe('succeeded')
    expect(next.list).toHaveLength(4)
    expect(next.list[0].id).toBe('INSP-1')
  })

  test('fetchInspection.fulfilled sets selected', () => {
    const initial = { list: [], selected: null, status: 'idle', error: null }
    const payload = { id:'INSP-X', no:'INSP-X', status:'New', createdAt: new Date().toISOString() }
    const next = reducer(initial, { type: fetchInspection.fulfilled.type, payload })
    expect(next.selected).toEqual(payload)
  })

  test('postInspection.fulfilled unshifts into list', () => {
    const initial = { list: [{ id:'A' }], selected: null, status:'idle', error:null }
    const payload = { id:'B', no:'B' }
    const next = reducer(initial, { type: postInspection.fulfilled.type, payload })
    expect(next.list[0].id).toBe('B')
    expect(next.list[1].id).toBe('A')
  })
})