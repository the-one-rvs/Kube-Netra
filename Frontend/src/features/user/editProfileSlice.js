// src/features/user/editProfileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateUserDetails = createAsyncThunk(
  "user/updateUserDetails",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.patch("/api/v1/users/updateUserDetails", formData, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const editProfileSlice = createSlice({
  name: "editProfile",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetEditState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetEditState } = editProfileSlice.actions;
export default editProfileSlice.reducer;
