import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import InspectionDetail from '../../components/pages/InspectionDetail.jsx'
import inspectionsReducer from '../../store/inspectionSlice'
import metaReducer from '../../store/metaSlice'

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return { ...actual, useParams: () => ({ id: 'INSP-X' }) }
})

jest.mock('../../store/inspectionSlice', () => {
  const actual = jest.requireActual('../../store/inspectionSlice')
  return { __esModule: true, ...actual, fetchInspection: () => () => Promise.resolve() }
})

const inspectionFixture = {
  id: 'INSP-X',
  no: 'INSP-X',
  status: 'Ready to Review',
  createdAt: '2025-10-01T10:00:00Z',
  serviceType: 'testing',
  scopeId: 'testing',
  header: {
    location: 'YRD-02',
    estimatedCompletionDate: '2025-10-30',
    relatedTo: 'WO-123',
    dcCode: 'DC-9'
  },
  customer: { name: 'ACME', ref: 'MR-1', charge: 'ON' },
  orderInformation: [
    {
      item_code: 'ITM001278',
      item_desc: 'Casing 13 3/8", ...',
      qtyRequired: 4,
      lots: [
        { lotNo: 'LOT-AX-001', allocation: 'Project A', owner: 'MITME', condition: 'good', availableQty: 8 }
      ]
    }
  ],
  works: {
    template_name: 'Testing',
    subscopes: [
      { subscope_id: 'lab-testing', fields: [{ key: 'hardness', selected: true }, { key: 'charpy', selected: false }] }
    ]
  },
  charges: [{ code:'SVC-TST', desc:'Testing Service', qty:4, uom:'pcs', price:20, currency:'USD' }]
}

function setup() {
  const store = configureStore({
    reducer: { inspections: inspectionsReducer, meta: metaReducer },
    preloadedState: {
      inspections: { list: [], selected: inspectionFixture, status:'succeeded', error:null },
      meta: { dropdowns:null, templates:null, items:[], status:'succeeded', error:null }
    }
  })

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <InspectionDetail />
      </BrowserRouter>
    </Provider>
  )
}

test('renders header, order, scope and charges sections', () => {
  setup()

  expect(screen.getByText(/detail inspection/i)).toBeInTheDocument()
  expect(screen.getByText('INSP-X')).toBeInTheDocument()
  expect(screen.getByText('YRD-02')).toBeInTheDocument()

  expect(screen.getByText('ITM001278')).toBeInTheDocument()
  expect(screen.getByText(/project a/i)).toBeInTheDocument()

  expect(screen.getByLabelText(/hardness/i)).toBeChecked()
  expect(screen.getByLabelText(/charpy/i)).not.toBeChecked()

  expect(screen.getByText(/USD \$80\.00/)).toBeInTheDocument()
})