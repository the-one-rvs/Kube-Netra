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

// ✅ Delete project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async ( _ , { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        "/api/v1/project/deleteProject"
      );
      return data.message; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Exit project
export const exitProject = createAsyncThunk(
  "projects/exitProject",
  async ( _ ,{ rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        "/api/v1/project/exitProject"
      );
      return data.message; 
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
    actionMessage: null,
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
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.details = null; // project delete hone ke baad details clear
        state.actionMessage = action.payload;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ exit project
      .addCase(exitProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exitProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.details = null; // exit hone pe bhi project clear
        state.actionMessage = action.payload;
      })
      .addCase(exitProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProjectState } = projectOpSlice.actions;
export default projectOpSlice.reducer;
