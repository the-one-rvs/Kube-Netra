// src/features/projects/projectSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch current project details
export const fetchProjectDetails = createAsyncThunk(
  "projects/fetchProjectDetails",
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/project/getCurrentProjectDetails?projectId=${projectId}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`/api/v1/project/updateProject`, formData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const projectOpSlice = createSlice({
  name: "projects",
  initialState: {
    loading: false,
    error: null,
    success: false,
    details: null,
  },
  reducers: {
    resetProjectState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch project
      .addCase(fetchProjectDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.details = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetProjectState } = projectOpSlice.actions;
export default projectOpSlice.reducer;
