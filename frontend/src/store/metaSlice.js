import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getDropdowns, getTemplates } from '../api/mockApi'

export const bootstrapMeta = createAsyncThunk('meta/bootstrap', async () => {
  const [dd, tpl] = await Promise.all([getDropdowns(), getTemplates()])
  return { dropdowns: dd.data, templates: tpl.data }
})

const metaSlice = createSlice({
  name: 'meta',
  initialState: { dropdowns: null, templates: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(bootstrapMeta.pending, (s)=>{ s.status='loading' })
     .addCase(bootstrapMeta.fulfilled, (s,a)=>{ s.status='succeeded'; s.dropdowns=a.payload.dropdowns; s.templates=a.payload.templates })
     .addCase(bootstrapMeta.rejected, (s,a)=>{ s.status='failed'; s.error=a.error?.message })
  }
})

export default metaSlice.reducer