import { configureStore } from '@reduxjs/toolkit';
import loginSlice from "../slices/loginSlice";
import fileSlice from "../slices/fileSlice";
import menuRegSlice from "../slices/menuRegSlice";
import menuSlice from "../slices/menuSlice";
import formSlice from "../slices/formSlice";
import homeSlice from "../slices/homeSlice";
import usersSlice from "../slices/usersSlice ";

export const store = configureStore({
  reducer: {
    login: loginSlice,
    users: usersSlice,
    file: fileSlice,
    menuReg: menuRegSlice,
    menu: menuSlice,
    form: formSlice,
    home: homeSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

