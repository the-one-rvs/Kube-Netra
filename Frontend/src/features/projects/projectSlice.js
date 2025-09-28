import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 random color generator
const colors = [
  "bg-purple-300",
  "bg-blue-200",
  "bg-gray-400",
  "bg-green-200",
  "bg-pink-300",
  "bg-yellow-200",
  "bg-indigo-300",
  "bg-teal-200",
  "bg-orange-300",
  "bg-red-200",
  "bg-lime-200",
  "bg-cyan-200",
  "bg-amber-200",
  "bg-fuchsia-200",
  "bg-rose-200",
  "bg-violet-200",
  "bg-emerald-200",
  "bg-sky-200",
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

// 🔹 API call
export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/v1/project/getAllProjects");

      // 🔹 response shape fix
      if (res.data && res.data.success) {
        return res.data.data.map((proj) => ({
          ...proj,
          color: getRandomColor(), // random color
        }));
      } else {
        return rejectWithValue("No projects found");
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch projects"
      );
    }
  }
);

export const enterProject = createAsyncThunk(
  "projects/enterProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/v1/project/enterProject/${projectId}`,
      { withCredentials: true } // yahi chalega
      );


      if (res.data && res.data.success) {
        return res.data;
      } else {
        return rejectWithValue("Failed to enter project");
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error entering project"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/v1/project/createProject", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create project");
    }
  }
);

export const alterFavorite = createAsyncThunk(
  "projects/alterFavorite",
  async (id) => {
    const res = await axios.post("api/v1/project/alterFaviorates", { projectId: id });
    const project = res.data.data;
    return {
      ...project,
      isFavorite: project.isfaviorate, // normalize spelling
    };
  }
);

export const fetchCurrentProject = createAsyncThunk(
  "projects/fetchCurrentProject",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/v1/project/getCurrentProjectDetails");
      if (res.data && res.data.success) {
        return res.data.data; // assume ek project object return hota h
      } else {
        return rejectWithValue("No current project found");
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch current project");
    }
  }
);

export const fetchCurrentProjectDetails = createAsyncThunk(
  "projectPage/fetchCurrent",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/v1/project/getCurrentProjectDetails");
      if (res.data.success) {
        return res.data.data;
      } else {
        return rejectWithValue("No current project found");
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch");
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentProject: null,
    project: null,
  },
  reducers: {
    clearProjectState: (state) => {
      state.project = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // enter project
      .addCase(enterProject.pending, (s) => {
        s.entering = true;
        s.error = null;
      })
      .addCase(enterProject.fulfilled, (s) => {
        s.entering = false;
      })
      .addCase(enterProject.rejected, (s, a) => {
        s.entering = false;
        s.error = a.payload;
      })

      // 📌 alter favorite
      .addCase(alterFavorite.fulfilled, (state, action) => {
        const { projectId, isfavorite } = action.payload;
        const projIndex = state.items.findIndex((p) => p._id === projectId);
        if (projIndex !== -1) {
          state.items[projIndex].isFavorite = isFavorite;
        }
      })

      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.project = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCurrentProject.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })
      .addCase(fetchCurrentProject.rejected, (state) => {
        state.currentProject = null;
      })
      .addCase(fetchCurrentProjectDetails.fulfilled, (state, action) => {
        state.isWorkflowRunning = action.payload.isWorkflowTriggered; // 🔑 sync
      });

  },
});

export const { clearProjectState } = projectSlice.actions;
export default projectSlice.reducer;
