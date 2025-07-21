import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  currentPageTitle: string;
  currentPageSubtitle?: string;
}

const initialState: AppState = {
  currentPageTitle: 'Home Manager',
  currentPageSubtitle: undefined,
};

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.currentPageTitle = action.payload;
    },
    setPageSubtitle: (state, action: PayloadAction<string | undefined>) => {
      state.currentPageSubtitle = action.payload;
    },
    setPageInfo: (
      state,
      action: PayloadAction<{ title: string; subtitle?: string }>
    ) => {
      state.currentPageTitle = action.payload.title;
      state.currentPageSubtitle = action.payload.subtitle;
    },
  },
});

export const { setPageTitle, setPageSubtitle, setPageInfo } =
  appStateSlice.actions;

// Selectors - will be typed properly when used with useAppSelector
export const selectCurrentPageTitle = (state: { appState: AppState }) =>
  state.appState.currentPageTitle;
export const selectCurrentPageSubtitle = (state: { appState: AppState }) =>
  state.appState.currentPageSubtitle;
export const selectPageInfo = (state: { appState: AppState }) => ({
  title: state.appState.currentPageTitle,
  subtitle: state.appState.currentPageSubtitle,
});

export default appStateSlice.reducer;
