import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './redux/store';
import { RootLayout } from './components/layout/root-layout';
import { BuildingDetailsPage } from './pages/building-details';
import './styles/globals.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <div className="text-gray-500">Welcome to Tax Manager</div>,
      },
      {
        path: '/buildings',
        element: <BuildingDetailsPage />,
      },
      {
        path: '/buildings/:id',
        element: <BuildingDetailsPage />,
      },
      {
        path: '/users',
        element: <div className="text-gray-500">Users page coming soon...</div>,
      },
      {
        path: '/calendar',
        element: (
          <div className="text-gray-500">Calendar page coming soon...</div>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
