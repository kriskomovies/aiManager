import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './redux/store';
import { RootLayout } from './components/layout/root-layout';
import { BuildingDetailsPage } from './pages/buildings/building-details';
import { BuildingsListPage } from './pages/buildings/buildings-list';
import { AddEditBuildingPage } from './pages/buildings/add-edit-building';
import { AddEditApartmentPage } from './pages/apartments/add-edit-apartment';
import { ApartmentDetailsPage } from './pages/apartments/apartment-details';
import { PartnersListPage } from './pages/partners/partners-list';
import { AddEditPartnerPage } from './pages/partners/add-edit-partner';
import { PartnerDetailsPage } from './pages/partners/partners-details';
import { HomePage } from './pages/home/home';
import { CalendarPage } from './pages/calendar/calendar-page';
import { ErrorBoundary } from './components/error-boundary';
import { NotFoundPage } from './components/error-pages/not-found';
import { GeneralErrorPage } from './components/error-pages/general-error';
import './lib/error-logger'; // Initialize global error handlers
import './styles/globals.css';
import './styles/calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <GeneralErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        errorElement: <GeneralErrorPage />,
      },
      {
        path: '/buildings',
        element: <BuildingsListPage />,
        errorElement: <GeneralErrorPage />,
      },
      {
        path: '/buildings/add',
        element: <AddEditBuildingPage />,
        errorElement: <GeneralErrorPage />,
      },
      {
        path: '/buildings/:id/edit',
        element: <AddEditBuildingPage />,
        errorElement: <GeneralErrorPage />,
      },
      {
        path: '/buildings/:id',
        element: <BuildingDetailsPage />,
        errorElement: <GeneralErrorPage />,
      },
      {
        path: '/apartments/add/:buildingId',
        element: <AddEditApartmentPage />,
        errorElement: <GeneralErrorPage />,
      },
      {
        path: '/buildings/:buildingId/apartments/:id/edit',
        element: <AddEditApartmentPage />,
        errorElement: <GeneralErrorPage />,
      },
      {
        path: '/apartments/:id/edit',
        element: <AddEditApartmentPage />,
        errorElement: <GeneralErrorPage />,
      },
      {
        path: '/apartments/:id',
        element: <ApartmentDetailsPage />,
        errorElement: <GeneralErrorPage />,
      },
      {
        path: '/partners',
        element: <PartnersListPage />,
        errorElement: <GeneralErrorPage />,
      },
      {
        path: '/partners/add',
        element: <AddEditPartnerPage />,
        errorElement: <GeneralErrorPage />,
      },
      {
        path: '/partners/:id/edit',
        element: <AddEditPartnerPage />,
        errorElement: <GeneralErrorPage />,
      },
      {
        path: '/partners/:id',
        element: <PartnerDetailsPage />,
        errorElement: <GeneralErrorPage />,
      },
      {
        path: '/users',
        element: <div className="text-gray-500">Users page coming soon...</div>,
        errorElement: <GeneralErrorPage />,
      },
      {
        path: '/calendar',
        element: <CalendarPage />,
        errorElement: <GeneralErrorPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
