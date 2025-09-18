import { configureStore, current } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import queryReducer from "../features/query/querySlice"
import currentUserReducer from "../features/user/currentUserSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    query: queryReducer,
    currentUser: currentUserReducer
  },
});
