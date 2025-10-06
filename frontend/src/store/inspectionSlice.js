import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getInspections, getInspection, createInspection } from '../api/mockApi'

export const fetchInspections = createAsyncThunk('inspections/fetchAll', async () => {
  const { data } = await getInspections()
  return data.inspections ?? []
})

export const fetchInspection = createAsyncThunk('inspections/fetchOne', async (id) => {
  const { data } = await getInspection(id)
  return data
})

export const postInspection = createAsyncThunk('inspections/create', async (payload) => {
  const { data } = await createInspection(payload)
  return data
})

const inspectionSlice = createSlice({
  name: 'inspections',
  initialState: { list: [], selected: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchInspections.pending, (s)=>{ s.status='loading' })
      .addCase(fetchInspections.fulfilled, (s,a)=>{ s.status='succeeded'; s.list=a.payload })
      .addCase(fetchInspections.rejected, (s,a)=>{ s.status='failed'; s.error=a.error?.message })
      .addCase(fetchInspection.fulfilled, (s,a)=>{ s.selected = a.payload })
      .addCase(postInspection.fulfilled, (s,a)=>{ s.list.unshift(a.payload) })
  }
})

export default inspectionSlice.reducer