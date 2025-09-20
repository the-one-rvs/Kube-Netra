import { configureStore, current } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import queryReducer from "../features/query/querySlice"
import currentUserReducer from "../features/user/currentUserSlice"
import editProfileReducer from "../features/user/editProfileSlice"
import changePasswordReducer from "../features/user/changePasswordSlice";
import projectReducer from "../features/projects/projectSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    query: queryReducer,
    currentUser: currentUserReducer,
    editProfile: editProfileReducer,
    changePassword: changePasswordReducer,
    projects: projectReducer
  },
});
