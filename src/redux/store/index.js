import { configureStore } from '@reduxjs/toolkit';
import userSlice from "../slices/userSlice";
import fileSlice from "../slices/fileSlice";
import menuRegSlice from "../slices/menuRegSlice";
import menuSlice from "../slices/menuSlice";
import formSlice from "../slices/formSlice";
import homeSlice from "../slices/homeSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    file: fileSlice,
    menuReg: menuRegSlice,
    menu: menuSlice,
    form: formSlice,
    home: homeSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

