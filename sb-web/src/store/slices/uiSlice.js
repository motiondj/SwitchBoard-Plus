import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: false,
  toast: null,
  modals: {
    preset: false,
    group: false
  },
  loading: false,
  loadingMessage: '',
  error: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    hideToast: (state) => {
      state.toast = null;
    },
    openGroupModal: (state) => {
      state.modals.group = true;
    },
    closeGroupModal: (state) => {
      state.modals.group = false;
    },
    openPresetModal: (state) => {
      state.modals.preset = true;
    },
    closePresetModal: (state) => {
      state.modals.preset = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLoadingMessage: (state, action) => {
      state.loadingMessage = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  toggleTheme,
  showToast,
  hideToast,
  openGroupModal,
  closeGroupModal,
  openPresetModal,
  closePresetModal,
  setLoading,
  setLoadingMessage,
  setError,
  clearError
} = uiSlice.actions;

export default uiSlice.reducer; 