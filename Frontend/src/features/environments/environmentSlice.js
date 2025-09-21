import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create Environment API
export const createEnvironment = createAsyncThunk(
  "environments/createEnvironment",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/v1/environment/createEnvironment", formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create environment"
      );
    }
  }
);

const environmentSlice = createSlice({
  name: "environments",
  initialState: {
    loading: false,
    error: null,
    environment: null,
  },
  reducers: {
    clearEnvironmentState: (state) => {
      state.loading = false;
      state.error = null;
      state.environment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEnvironment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.environment = null;
      })
      .addCase(createEnvironment.fulfilled, (state, action) => {
        state.loading = false;
        state.environment = action.payload;
      })
      .addCase(createEnvironment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEnvironmentState } = environmentSlice.actions;
export default environmentSlice.reducer;
