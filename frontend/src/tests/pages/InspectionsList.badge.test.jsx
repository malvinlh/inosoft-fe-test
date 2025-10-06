import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import InspectionsList from '../../components/pages/InspectionsList'
import inspectionsReducer from '../../store/inspectionSlice'
import metaReducer from '../../store/metaSlice'
import { inspectionsListFixture } from '../fixtures'

function setup(preloaded = inspectionsListFixture) {
  const store = configureStore({
    reducer: { inspections: inspectionsReducer, meta: metaReducer },
    preloadedState: {
      inspections: { list: preloaded, selected: null, status: 'succeeded', error: null },
      meta: { dropdowns: null, templates: null, items: [], status: 'succeeded', error: null }
    }
  })

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <InspectionsList />
      </BrowserRouter>
    </Provider>
  )
}

test('For Review tab shows badge count', () => {
  setup()
  const tab = screen.getByRole('button', { name: /for review/i })
  const badge = tab.querySelector('.badge')
  expect(badge).toBeTruthy()
  expect(Number(badge.textContent)).toBeGreaterThanOrEqual(1)
})