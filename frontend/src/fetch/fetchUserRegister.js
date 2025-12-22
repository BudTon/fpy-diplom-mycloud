import { createAsyncThunk } from '@reduxjs/toolkit';
import { errorText } from '../hooks/errorText';

export const fetchUserRegister = createAsyncThunk(
  'register_user',
  async ({ username, firstname, email, password, isStaff }, { rejectWithValue }) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const fetchUrl = `${BASE_URL}register/`

    try {
      const response = await fetch(fetchUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, firstname: firstname, email: email, password: password, is_staff: isStaff })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server returned:", errorData);
        return rejectWithValue(errorText(errorData));
      }
      const data = await response.json();
      console.log("Registration User successful:", data);
      return data;
    } catch (err) {
      return rejectWithValue({ error_code: 'NETWORK_ERROR', detail: err.message } || 'Failed to load files');
    }
  }

);
