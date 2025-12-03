import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFileUploaded = createAsyncThunk(
  'storege_uploaded',
  async (values, { rejectWithValue, getState }) => {
    const results = getState().user.results;
    const userNameStorage = getState().file.results.user_name
    const token = results?.token;
    const formData = new FormData();
    formData.append('file', values.selectedFile);
    formData.append('comment', values.comment);
    formData.append('user_storage', userNameStorage);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const fetchUrl = `${BASE_URL}storage/`

    try {
      const response = await fetch(fetchUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          Authorization: `Token ${token}`,
        },
        body: formData
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
