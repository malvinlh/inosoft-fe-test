import reducer, { bootstrapMeta } from '../../store/metaSlice'

test('bootstrapMeta.rejected sets failed status and error', () => {
  const initial = { dropdowns:null, templates:null, items:[], status:'loading', error:null }
  const error = { message: 'boom' }
  const next = reducer(initial, { type: bootstrapMeta.rejected.type, error })
  expect(next.status).toBe('failed')
  expect(next.error).toBe('boom')
})