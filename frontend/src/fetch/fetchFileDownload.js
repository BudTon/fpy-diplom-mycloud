import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFileDownload = createAsyncThunk(
  "storage/downloadFile",
  async (results, { rejectWithValue, getState }) => {
    const { fileId, file_name } = results
    const { token } = getState().login.results;
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const fetchUrl = `${BASE_URL}storage/files/${fileId}/`

    try {
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
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = file_name;
      link.click();
      URL.revokeObjectURL(link.href);
      link.remove();
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load files');
    }
  }
);
