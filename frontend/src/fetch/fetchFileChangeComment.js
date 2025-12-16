import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFileChangeComment = createAsyncThunk(
  'storage/renameFile',
  async ({ fileId, newComment, token }, { rejectWithValue }) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const fetchUrl = `${BASE_URL}file/comment/${fileId}/`
    if (!token) {
      return rejectWithValue('No valid token provided!');
    }
    const data = { newComment }

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
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server returned:", text);
        throw new Error("Server responded with an error.");
      }

      const updatedFile = await response.json();
      console.log("File Change Comment successfully:", updatedFile);
      return updatedFile;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update file');
    }
  }
);
