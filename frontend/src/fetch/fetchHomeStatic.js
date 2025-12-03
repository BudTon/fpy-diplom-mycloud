import { createAsyncThunk } from '@reduxjs/toolkit';
import numberUsers from '../hooks/numberUsers';
import filesSize from '../hooks/filesSize';
import numberFiles from '../hooks/numberFiles';

export const fetchHomeStatic = createAsyncThunk(
  'home',
  async (_, { rejectWithValue }) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const fetchUrl = `${BASE_URL}home/`

    try {
      const response = await fetch(fetchUrl, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server returned:", text);
        throw new Error("Server responded with an error.");
      }
      const data = await response.json();
      const modifiedData = {
        ...data,
        totalUsers: {
          countInt: data.totalUsers,
          countStr: numberUsers(data.totalUsers),
        },
        totalSize: {
          countInt: filesSize(data.totalSize).countInt,
          countStr: filesSize(data.totalSize).countStr,
        },
        totalFiles: {
          countInt: data.totalFiles,
          countStr: numberFiles(data.totalFiles),
        }

      };
      console.log("Данные статистики:", modifiedData);
      return modifiedData;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load files');
    }
  }
);
