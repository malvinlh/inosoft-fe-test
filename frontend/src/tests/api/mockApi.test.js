jest.mock('../../api/http', () => ({
  get: jest.fn(),
  post: jest.fn()
}))
import http from '../../api/http'
import * as api from '../../api/mockApi'

test('calls correct GET endpoints', async () => {
  await api.getDropdowns();      expect(http.get).toHaveBeenCalledWith('/dropdowns')
  await api.getTemplates();      expect(http.get).toHaveBeenCalledWith('/inspection-templates')
  await api.getItems();          expect(http.get).toHaveBeenCalledWith('/items')
  await api.getInspections();    expect(http.get).toHaveBeenCalledWith('/inspections')
  await api.getInspection('X');  expect(http.get).toHaveBeenCalledWith('/inspections/X')
})

test('calls correct POST endpoint', async () => {
  const body = { a: 1 }
  await api.createInspection(body)
  expect(http.post).toHaveBeenCalledWith('/inspections', body)
})