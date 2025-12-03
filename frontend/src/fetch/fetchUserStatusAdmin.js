import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserStatusAdmin = createAsyncThunk(
  'user/StatusAdminUser',
  async ({ userId, newIsStaff, token }, { rejectWithValue }) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const fetchUrl = `${BASE_URL}user/${userId}/`

    if (!token) {
      return rejectWithValue('No valid token provided!');
    }

    try {
      const response = await fetch(fetchUrl, {
        method: 'PATCH',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({newIsStaff}),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server returned:", text);
        throw new Error("Server responded with an error.");
      }

      const isStaff = await response.json();
      console.log("Status isStaff installed:", isStaff);
      return isStaff;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update isStaff');
    }
  }
);
