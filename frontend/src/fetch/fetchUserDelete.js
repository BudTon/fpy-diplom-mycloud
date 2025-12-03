import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserDelete = createAsyncThunk(
  'storage/deleteUser',
  async ({userId, token}, { rejectWithValue }) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const fetchUrl = `${BASE_URL}user/${userId}/`

    if (!token) {
      return rejectWithValue('No valid token provided!');
    }

    try {
      const response = await fetch(fetchUrl, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        }
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server returned:", text);
        throw new Error("Server responded with an error.");
      }
      console.log("Delete successful:", response.ok);
      return { status: response.status };;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete user');
    }
  }
);
