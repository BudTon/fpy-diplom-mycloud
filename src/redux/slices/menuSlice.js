import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hiddenStoragePage: 'hidden',
  hiddenUserAdminPage: 'hidden',
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    hiddenStoragePage: (state) => {
      state.hiddenStoragePage = 'hidden';
    },
    notHiddenStoragePage: (state) => {
      state.hiddenStoragePage = '';
    },
    hiddenUserAdminPage: (state) => {
      state.hiddenUserAdminPage = 'hidden';
    },
    notHiddenUserAdminPage: (state) => {
      state.hiddenUserAdminPage = '';
    },
  },
});

export const {
  hiddenStoragePage,
  notHiddenStoragePage,
  hiddenUserAdminPage,
  notHiddenUserAdminPage
} = menuSlice.actions;
export default menuSlice.reducer;
