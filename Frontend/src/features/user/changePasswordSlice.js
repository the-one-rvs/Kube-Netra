// src/features/user/changePasswordSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// CHANGE PASSWORD
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.patch("/api/v1/users/changePassword", formData, {
        withCredentials: true, // ✅ agar cookies/jwt use ho raha hai toh
      });

      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        return rejectWithValue(res.data?.message || "Failed to change password");
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Server error");
    }
  }
);

const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetPasswordState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetPasswordState } = changePasswordSlice.actions;
export default changePasswordSlice.reducer;
