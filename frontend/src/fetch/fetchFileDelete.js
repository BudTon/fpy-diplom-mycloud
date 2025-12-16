import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFileDelete = createAsyncThunk(
  'storage/deleteFile',
  async (results, { rejectWithValue, getState }) => {
    const token = getState().login.results?.token;
    const { fileId, userId } = results;
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    try {
      let deleteUrl = `${BASE_URL}storage/`;

      if (userId !== undefined) {
        deleteUrl += `?file_id=${encodeURIComponent(fileId)}&user_id=${encodeURIComponent(userId)}`;
      } else {
        return alert('Удалить файл НЕВОЗМОЖНО!\nОтсутствует ID пользователя')
      }
      console.log(deleteUrl, ' - deleteUrl');


      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          Authorization: `Token ${token}`,
        }
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server returned:", text);
        throw new Error("Server responded with an error.");
      }

      const data = await response.json();
      console.log("Delete successful:", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete file');
    }
  }
);
