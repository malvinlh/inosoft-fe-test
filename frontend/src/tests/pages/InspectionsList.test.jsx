import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InspectionsList from '../../components/pages/InspectionsList'
import inspectionsReducer, { fetchInspections } from '../../store/inspectionSlice'
import metaReducer from '../../store/metaSlice'
import { BrowserRouter } from 'react-router-dom'
import { inspectionsListFixture } from '../fixtures'

jest.mock('../../store/inspectionSlice', () => {
  const actual = jest.requireActual('../../store/inspectionSlice')
  return {
    __esModule: true,
    ...actual,
    fetchInspections: jest.fn(() => async () => Promise.resolve())
  }
})

function setup(preloadedInspections = inspectionsListFixture) {
  const store = configureStore({
    reducer: { inspections: inspectionsReducer, meta: metaReducer },
    preloadedState: {
      inspections: { list: preloadedInspections, selected:null, status:'succeeded', error:null },
      meta: { dropdowns:null, templates:null, items:[], status:'succeeded', error:null }
    }
  })

  const ui = (
    <Provider store={store}>
      <BrowserRouter>
        <InspectionsList />
      </BrowserRouter>
    </Provider>
  )

  return { ui, store }
}

test('Open/For Review/Completed tab filters rows correctly', async () => {
  const user = userEvent.setup()
  const { ui } = setup()
  render(ui)

  expect(screen.getByText('INSP-1')).toBeInTheDocument()
  expect(screen.getByText('INSP-2')).toBeInTheDocument()
  expect(screen.queryByText('INSP-3')).toBeNull()
  expect(screen.queryByText('INSP-4')).toBeNull()

  await user.click(screen.getByRole('button', { name: /for review/i }))
  expect(screen.getByText('INSP-3')).toBeInTheDocument()
  expect(screen.queryByText('INSP-1')).toBeNull()

  await user.click(screen.getByRole('button', { name: /completed/i }))
  expect(screen.getByText('INSP-4')).toBeInTheDocument()
  expect(screen.queryByText('INSP-3')).toBeNull()
})