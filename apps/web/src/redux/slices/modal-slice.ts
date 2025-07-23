import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';

export type ModalType =
  | 'delete-building'
  | 'delete-apartment'
  | 'add-building'
  | 'edit-building'
  | 'delete-user'
  | 'confirm-action'
  | 'reference-fees'
  | 'reference-payments'
  | 'payment'
  | 'edit-apartment-irregularity'
  | 'delete-apartment-irregularity'
  | 'create-building-irregularity'
  | 'edit-building-irregularity'
  | 'create-new-message'
  | 'view-message'
  | 'edit-message'
  | 'delete-message'
  | 'create-inventory'
  | 'edit-inventory'
  | 'delete-inventory'
  | 'transfer-inventory-money'
  | 'inventory-transfers'
  | 'create-one-time-expense'
  | 'create-recurring-expense'
  | 'edit-recurring-expense'
  | 'delete-recurring-expense'
  | 'create-temporary-fee'
  | 'create-monthly-fee'
  | 'view-monthly-fee'
  | 'edit-monthly-fee'
  | 'add-calendar-event'
  | 'event-details';

export interface ModalData {
  buildingId?: string;
  buildingName?: string;
  apartmentId?: string;
  apartmentNumber?: string;
  userId?: string;
  userName?: string;
  irregularityId?: string;
  irregularityTitle?: string;
  inventoryId?: string;
  inventoryName?: string;
  inventoryData?: unknown;
  expenseData?: unknown;
  monthlyFeeId?: string;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  selectedStart?: string;
  selectedEnd?: string;
  event?: unknown; // Calendar event data for event details modal
  [key: string]: unknown; // Allow additional modal-specific data
}

interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  data: ModalData | null;
}

const initialState: ModalState = {
  isOpen: false,
  type: null,
  data: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ type: ModalType; data?: ModalData }>
    ) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.data = action.payload.data || null;
    },
    closeModal: state => {
      state.isOpen = false;
      state.type = null;
      state.data = null;
    },
    updateModalData: (state, action: PayloadAction<Partial<ModalData>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      } else {
        state.data = action.payload;
      }
    },
  },
});

export const { openModal, closeModal, updateModalData } = modalSlice.actions;

// Selectors
export const selectModal = (state: RootState) => state.modal;
export const selectIsModalOpen = (state: RootState) => state.modal.isOpen;
export const selectModalType = (state: RootState) => state.modal.type;
export const selectModalData = (state: RootState) => state.modal.data;

export default modalSlice.reducer;
