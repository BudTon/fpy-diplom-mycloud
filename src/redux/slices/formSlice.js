import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalLoginForm: false,
  isModalRegistrationForm: false,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    visibleLoginForm: (state) => {
      state.isModalLoginForm = true;
    },
    invisibleLoginForm: (state) => {
      state.isModalLoginForm = false;
    },
    visibleRegistrationForm: (state) => {
      state.isModalRegistrationForm = true;
    },
    invisibleRegistrationForm: (state) => {
      state.isModalRegistrationForm = false;
    },
  },
});

export const {
  visibleLoginForm,
  invisibleLoginForm,
  visibleRegistrationForm,
  invisibleRegistrationForm
} = formSlice.actions;
export default formSlice.reducer;
