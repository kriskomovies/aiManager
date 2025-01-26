import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { store } from './redux/store'
import { RootLayout } from './components/layout/root-layout'
import './styles/globals.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <div className="p-4">Dashboard</div>,
      },
      {
        path: '/companies',
        element: <div className="p-4">Companies</div>,
      },
      {
        path: '/buildings',
        element: <div className="p-4">Buildings</div>,
      },
      {
        path: '/contractors',
        element: <div className="p-4">Contractors</div>,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
) 