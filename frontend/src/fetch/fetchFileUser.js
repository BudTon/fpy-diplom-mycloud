import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFileUser = createAsyncThunk(
  'storage',
  async (results, { rejectWithValue, getState }) => {
    const { userId, page } = results
    const { token } = getState().user.results;
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    let fetchUrl = `${BASE_URL}storage/`

    if (!token) {
      return console.log("Invalid token.");
    }

    try {
      if (userId !== undefined) {
        fetchUrl += `?user_id=${encodeURIComponent(userId)}`;
      }
      if (page !== undefined) {
        fetchUrl += `${userId ? '&' : '?'}page=${page}`;
      }

      const response = await fetch(fetchUrl, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server returned:", text);
        throw new Error("Server responded with an error.");
      }
      const data = await response.json();
      console.log("Login successful:", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load files');
    }
  }
);
