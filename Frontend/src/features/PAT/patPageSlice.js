import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch PAT details (existing)
export const fetchPATDetails = createAsyncThunk(
  "patDetails/fetch",
  async (patId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/v1/pat/showPATDetails/${patId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch PAT details");
    }
  }
);

// Fetch filtered projects (non-PAT)
export const fetchFilteredProjects = createAsyncThunk(
  "patDetails/fetchFilteredProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/v1/pat/filteredProjects`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch projects");
    }
  }
);

// Add PAT to a project
export const addPATinProject = createAsyncThunk(
  "patDetails/addPATinProject",
  async ({ projectId, nameOfPAT }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/api/v1/pat/addPATinProject`, { projectId, nameOfPAT });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add PAT to project");
    }
  }
);

export const removeProjectFromPAT = createAsyncThunk(
  "patPage/removeProjectFromPAT",
  async ({ patId, projectId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/api/v1/pat/removePATFromProject`, {
        patId,
        projectId,
      });
      return { projectId, data: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove project");
    }
  }
);

const patPageSlice = createSlice({
  name: "patPage",
  initialState: {
    pat: null,
    filteredProjects: [],
    loading: false,
    error: null,
    addProjectStatus: null,
  },
  reducers: {
    clearPATDetails: (state) => {
      state.pat = null;
      state.filteredProjects = [];
      state.error = null;
      state.loading = false;
      state.addProjectStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // PAT Details
      .addCase(fetchPATDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.pat = null;
      })
      .addCase(fetchPATDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.pat = action.payload;
      })
      .addCase(fetchPATDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Filtered Projects
      .addCase(fetchFilteredProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProjects = action.payload;
      })
      .addCase(fetchFilteredProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch projects";
      })

      // Add PAT to project
      .addCase(addPATinProject.pending, (state) => {
        state.addProjectStatus = "loading";
      })
      .addCase(addPATinProject.fulfilled, (state) => {
        state.addProjectStatus = "success";
      })
      .addCase(addPATinProject.rejected, (state, action) => {
        state.addProjectStatus = `error: ${action.payload}`;
      })

      .addCase(removeProjectFromPAT.fulfilled, (state, action) => {
        if (state.pat?.projects) {
          state.pat.projects = state.pat.projects.filter(
            (p) => p._id !== action.payload.projectId
          );
        }
      });
  },
});

export const { clearPATDetails } = patPageSlice.actions;

export default patPageSlice.reducer;
