// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// REGISTER ADMIN
export const registerAdmin = createAsyncThunk(
  "auth/registerAdmin",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/v1/users/createRootAdmin", formData);
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

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/v1/users/login", formData, {
        withCredentials: true, // ✅ important if you’re using cookies
      });

      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        return rejectWithValue(res.data?.message || "Invalid credentials");
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Server error");
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // 🔑 ab GET request
      const res = await axios.get("/api/v1/users/logout", {
        withCredentials: true,
      });

      if (res.status >= 200 && res.status < 300) {
        return true;
      } else {
        return rejectWithValue(res.data?.message || "Logout failed");
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
    accessToken: null,
    refreshToken: null,
  },
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER ADMIN
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
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.loading = false;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
