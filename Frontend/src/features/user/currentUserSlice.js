// src/features/currentUser/currentUserSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// REFRESH TOKENS
export const refreshTokens = createAsyncThunk(
  "currentUser/refreshTokens",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/v1/users/reclaimTokens", {}, { withCredentials: true });
      if (res.status >= 200 && res.status < 300) {
        return res.data; // { accessToken, refreshToken }
      } else {
        return rejectWithValue(res.data?.message || "Failed to refresh tokens");
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Token refresh failed");
    }
  }
);

// GET CURRENT USER (with retry on token refresh)
export const fetchCurrentUser = createAsyncThunk(
  "currentUser/fetchCurrentUser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.get("/api/v1/users/currentUser", {
        withCredentials: true,
      });

      if (res.status >= 200 && res.status < 300) {
        return res.data; // { data: {...user} }
      } else {
        return rejectWithValue(res.data?.message || "Failed to fetch user");
      }
    } catch (err) {
      // ✅ If unauthorized, try refreshing tokens once
      if (err.response?.status === 401 || err.response?.status === 403) {
        try {
          const refreshRes = await dispatch(refreshTokens()).unwrap();

          if (refreshRes?.accessToken) {
            // retry current user API after refresh
            const retryRes = await axios.get("/api/v1/users/currentUser", {
              withCredentials: true,
            });
            return retryRes.data;
          }
        } catch (refreshErr) {
          return rejectWithValue("Session expired. Please login again.");
        }
      }

      return rejectWithValue(err.response?.data?.message || "Server error");
    }
  }
);

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentUser: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data; // ✅ user object inside `data`
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })

      // REFRESH TOKENS
      .addCase(refreshTokens.fulfilled, (state, action) => {
        // optional: you can save tokens in state if needed
        state.error = null;
      })
      .addCase(refreshTokens.rejected, (state, action) => {
        state.error = action.payload;
        state.user = null;
      });
  },
});

export const { clearCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;
