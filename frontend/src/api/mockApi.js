import http from './http'

export const getDropdowns      = () => http.get('/dropdowns')
export const getTemplates      = () => http.get('/inspection-templates')
export const getItems          = () => http.get('/items')
export const getInspections    = () => http.get('/inspections')
export const getInspection     = (id) => http.get(`/inspections/${id}`)
export const createInspection  = (body) => http.post('/inspections', body)