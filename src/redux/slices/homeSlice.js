import { createSlice } from '@reduxjs/toolkit';
import { fetchHomeStatic } from '../../fetch/fetchHomeStatic';

const initialState = {
  value: '',
  visible: true,
  results: [],
  loading: false,
  error: null,
};

// Slice
const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    clear: (state) => {
      state.value = '';
      state.results = [];
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchHomeStatic.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchHomeStatic.fulfilled, (state, action) => {
      state.loading = false;
      state.results = action.payload || [];
    });
    builder.addCase(fetchHomeStatic.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clear } = homeSlice.actions;
export default homeSlice.reducer;
