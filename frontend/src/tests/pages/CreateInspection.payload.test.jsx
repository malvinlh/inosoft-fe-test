import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

import CreateInspection from '../../components/pages/CreateInspection.jsx'
import inspectionsReducer, { postInspection } from '../../store/inspectionSlice'
import metaReducer from '../../store/metaSlice'
import { dropdownsFixture, templatesFixture, itemsFixture } from '../fixtures'

jest.mock('../../store/inspectionSlice', () => {
  const actual = jest.requireActual('../../store/inspectionSlice')
  return {
    __esModule: true,
    ...actual,
    postInspection: jest.fn((payload) => () => {
      const value = { id: 'INSP-NEW', ...payload }
      const promise = Promise.resolve({ type: 'x', payload: value })
      promise.unwrap = () => Promise.resolve(value)
      return promise
    }),
  }
})

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return { ...actual, useNavigate: () => jest.fn() }
})

function setup() {
  const store = configureStore({
    reducer: { inspections: inspectionsReducer, meta: metaReducer },
    preloadedState: {
      inspections: { list: [], selected: null, status: 'idle', error: null },
      meta: {
        dropdowns: dropdownsFixture,
        templates: templatesFixture,
        items: itemsFixture,
        status: 'succeeded',
        error: null,
      },
    },
  })

  const ui = (
    <Provider store={store}>
      <BrowserRouter>
        <CreateInspection />
      </BrowserRouter>
    </Provider>
  )

  return { store, ui }
}

test('submit sends correct payload shape including works.selected and orderInformation', async () => {
  const user = userEvent.setup()
  const { ui } = setup()
  render(ui)

  const setupHeading = screen.getByText(/setup/i)
  const setupCardBody = setupHeading.closest('.card-body') ?? setupHeading.parentElement
  const selects = within(setupCardBody).getAllByRole('combobox')

  await user.selectOptions(selects[0], 'new-arrival')
  await user.selectOptions(selects[1], 'inspection-basic')

  const toggleBtn = screen.getByRole('button', { name: /visual body/i })
  await user.click(toggleBtn)

  await user.click(screen.getByRole('button', { name: /\+ add item/i }))
  const itemSelects = screen.getAllByRole('combobox', { name: /pilih item/i })
  await user.selectOptions(itemSelects[1], 'ITM001278')

  await user.click(screen.getByRole('button', { name: /submit/i }))

  expect(postInspection).toHaveBeenCalledWith(expect.objectContaining({
    serviceType: 'new-arrival',
    scopeId: 'inspection-basic',
    works: expect.objectContaining({
      selected: expect.objectContaining({
        'visual-body': true
      })
    }),
    customer: expect.objectContaining({ charge: 'ON' }),
    orderInformation: expect.arrayContaining([
      expect.objectContaining({
        id_item: expect.any(String),
        item_code: expect.any(String),
        item_desc: expect.any(String),
        qtyRequired: expect.any(Number),
        lots: expect.any(Array)
      })
    ])
  }))
})