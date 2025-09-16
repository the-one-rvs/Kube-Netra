// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const registerAdmin = createAsyncThunk(
  "auth/registerAdmin",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/v1/users/createRootAdmin", formData);

      // ✅ 200 range response
      if (res.status >= 200 && res.status < 300) {
        return res.data; 
      } else {
        return rejectWithValue(res.data?.message || "Something went wrong");
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Server error");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
