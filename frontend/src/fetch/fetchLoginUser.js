import { createAsyncThunk } from '@reduxjs/toolkit';
// import { useDispatch, useSelector } from 'react-redux';
// import { notHiddenUserAdminPage } from '../redux/slices/menuSlice';

export const fetchLoginUser = createAsyncThunk(
  'login',
  async ({ username, password }, {rejectWithValue}) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const fetchUrl = `${BASE_URL}login/`
    try {
      const response = await fetch(fetchUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'X-CSRFToken': csrfToken, // Здесь передаётся токен
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const text = await response.text(); // Получаем текст ответа
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
