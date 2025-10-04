import { configureStore } from '@reduxjs/toolkit'
import meta from './metaSlice'
import inspections from './inspectionSlice'

export const store = configureStore({
  reducer: { meta, inspections }
})