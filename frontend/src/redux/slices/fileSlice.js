import { createSlice } from '@reduxjs/toolkit';
import { fetchFileUser } from '../../fetch/fetchFileUser';
// import { setUserId } from './actions';

const initialState = {
  value: '',
  visible: true,
  results: {
    userId: null,
  },
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    clear: (state) => {
      state.value = '';
      state.results = [];
      state.error = null;
    },
    setUserId: (state, action) => {
      console.log(action.payload, ' - action.payload');

      state.results.userId = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchFileUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFileUser.fulfilled, (state, action) => {
      state.loading = false;
      state.results = action.payload || [];
    });
    builder.addCase(fetchFileUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clear, setUserId } = fileSlice.actions;
export default fileSlice.reducer;
