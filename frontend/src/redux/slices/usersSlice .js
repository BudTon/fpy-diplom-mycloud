import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers } from '../../fetch/fetchUsers';

const initialState = {
  value: '',
  visible: true,
  results: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
      clear: (state) => {
        state.value = '';
        state.results = '';
        state.error = null;
      },
    },
    extraReducers(builder) {
      builder.addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload || [];
      });
      builder.addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },
});

export const { clear } = usersSlice.actions;
export default usersSlice.reducer;
