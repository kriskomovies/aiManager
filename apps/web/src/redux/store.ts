import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { companyApi } from './services/company.service';
import { buildingApi } from './services/building.service';
import { apartmentService } from './services/apartment.service';
import appStateReducer from './slices/app-state';
import alertReducer from './slices/alert-slice';
import modalReducer from './slices/modal-slice';

export const store = configureStore({
  reducer: {
    appState: appStateReducer,
    alert: alertReducer,
    modal: modalReducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [buildingApi.reducerPath]: buildingApi.reducer,
    [apartmentService.reducerPath]: apartmentService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      companyApi.middleware,
      buildingApi.middleware,
      apartmentService.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
