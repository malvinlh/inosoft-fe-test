import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getDropdowns, getTemplates, getItems } from '../api/mockApi'

export const bootstrapMeta = createAsyncThunk('meta/bootstrap', async () => {
  const [dd, tpl, it] = await Promise.all([getDropdowns(), getTemplates(), getItems()])
  return { dropdowns: dd.data, templates: tpl.data, items: it.data.items ?? [] }
})

const metaSlice = createSlice({
  name: 'meta',
  initialState: { dropdowns: null, templates: null, items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(bootstrapMeta.pending, (s)=>{ s.status='loading' })
      .addCase(bootstrapMeta.fulfilled, (s,a)=>{ s.status='succeeded'; s.dropdowns=a.payload.dropdowns; s.templates=a.payload.templates; s.items=a.payload.items })
      .addCase(bootstrapMeta.rejected, (s,a)=>{ s.status='failed'; s.error=a.error?.message })
  }
})

export default metaSlice.reducer