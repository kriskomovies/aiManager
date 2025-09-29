import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { companyApi } from './services/company.service';
import { buildingApi } from './services/building.service';
import { apartmentService } from './services/apartment.service';
import { inventoryService } from './services/inventory.service';
import { paymentMethodService } from './services/payment-method.service';
import { expenseService } from './services/expense.service';
import { monthlyFeeService } from './services/monthly-fee.service';
import { calendarService } from './services/calendar-service';
import appStateReducer from './slices/app-state';
import alertReducer from './slices/alert-slice';
import modalReducer from './slices/modal-slice';
import { recurringExpenseService } from './services/recurring-expense.service';

export const store = configureStore({
  reducer: {
    appState: appStateReducer,
    alert: alertReducer,
    modal: modalReducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [buildingApi.reducerPath]: buildingApi.reducer,
    [apartmentService.reducerPath]: apartmentService.reducer,
    [inventoryService.reducerPath]: inventoryService.reducer,
    [paymentMethodService.reducerPath]: paymentMethodService.reducer,
    [expenseService.reducerPath]: expenseService.reducer,
    [monthlyFeeService.reducerPath]: monthlyFeeService.reducer,
    [calendarService.reducerPath]: calendarService.reducer,
    [recurringExpenseService.reducerPath]: recurringExpenseService.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      companyApi.middleware,
      buildingApi.middleware,
      apartmentService.middleware,
      inventoryService.middleware,
      paymentMethodService.middleware,
      expenseService.middleware,
      monthlyFeeService.middleware,
      calendarService.middleware,
      recurringExpenseService.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
