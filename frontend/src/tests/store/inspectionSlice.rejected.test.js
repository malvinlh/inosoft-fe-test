import reducer, { fetchInspections } from '../../store/inspectionSlice'

test('fetchInspections.rejected sets failed status', () => {
  const initial = { list: [], selected: null, status: 'loading', error: null }
  const error = { message: 'api down' }
  const next = reducer(initial, { type: fetchInspections.rejected.type, error })
  expect(next.status).toBe('failed')
  expect(next.error).toBe('api down')
})