import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';

export type ModalType = 
  | 'delete-building'
  | 'add-building'
  | 'edit-building'
  | 'delete-user'
  | 'confirm-action'
  | 'reference-fees'
  | 'reference-payments'
  | 'payment';

export interface ModalData {
  buildingId?: string;
  buildingName?: string;
  userId?: string;
  userName?: string;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
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
    openModal: (state, action: PayloadAction<{ type: ModalType; data?: ModalData }>) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.data = action.payload.data || null;
    },
    closeModal: (state) => {
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
