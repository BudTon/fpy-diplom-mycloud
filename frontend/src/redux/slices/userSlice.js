import { createSlice } from '@reduxjs/toolkit';
import { fetchUserLogin } from '../../fetch/fetchUserLogin';

const initialState = {
  value: '',
  visible: true,
  results: [],
  loading: false,
  error: null,
};

// Slice
const userSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clear: (state) => {
      state.value = '';
      state.results = '';
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUserLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.results = action.payload || [];
    });
    builder.addCase(fetchUserLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clear } = userSlice.actions;
export default userSlice.reducer;
