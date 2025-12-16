import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAuthAdmin = createAsyncThunk(
  'register_user_auth_admin',
  async ({ auchAdmin }, { rejectWithValue }) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const fetchUrl = `${BASE_URL}register/authadmin/`

    try {
      const response = await fetch(fetchUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auth_admin: auchAdmin })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server returned:", errorData);
        return rejectWithValue(errorData);
      }
      const data = await response.json();
      console.log("User Admin validate successful:", data);
      return data.validate;
    } catch (err) {
      return rejectWithValue({ error_code: 'NETWORK_ERROR', detail: err.message } || 'Failed to load files');
    }
  }

);
