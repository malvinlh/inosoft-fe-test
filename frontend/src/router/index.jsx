import { createBrowserRouter } from 'react-router-dom'
import InspectionsList from '../pages/InspectionsList'
import CreateInspection from '../pages/CreateInspection'
import InspectionDetail from '../pages/InspectionDetail'
import App from '../App'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <InspectionsList /> },
      { path: 'create', element: <CreateInspection /> },
      { path: 'inspections/:id', element: <InspectionDetail /> }
    ]
  }
])