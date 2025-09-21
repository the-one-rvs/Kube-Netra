import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ================== Async Thunks ==================

// Fetch all environments
export const fetchEnvironments = createAsyncThunk(
  "projectPage/fetchEnvironments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/v1/environment/getAllEnvironment");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch environments");
    }
  }
);

// Fetch current project details
export const fetchCurrentProjectDetails = createAsyncThunk(
  "projectPage/fetchCurrentProjectDetails",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/v1/project/getCurrentProjectDetails");
      return res.data.data; // { isWorkflowTriggered: true/false }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch project details");
    }
  }
);

// Start workflow
export const startWorkflow = createAsyncThunk(
  "projectPage/startWorkflow",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/v1/callCore/startWorkflow`);
      await dispatch(fetchCurrentProjectDetails());
      dispatch(startLogsSSE());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to start workflow");
    }
  }
);

// Stop workflow
export const stopWorkflow = createAsyncThunk(
  "projectPage/stopWorkflow",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axios.get(`/api/v1/callCore/stopWorkflow`);
      dispatch(stopSSE());
      dispatch(clearLogs());
      await dispatch(fetchCurrentProjectDetails());
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to stop workflow");
    }
  }
);

// Start manual patcher
export const startManualPatcher = createAsyncThunk(
  "projectPage/startManualPatcher",
  async (envId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/v1/callCore/startManualPatcher/${envId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to start manual patcher");
    }
  }
);

// ================== Slice ==================
const projectPageSlice = createSlice({
  name: "projectPage",
  initialState: {
    environments: [],
    watcherLogs: [],
    workflowLogs: [],
    patcherLogs: {},
    isWorkflowRunning: false,
    loading: false,
    error: null,
    sseSources: {},
  },
  reducers: {
    startWorkflowState: (state) => {
      state.isWorkflowRunning = true;
    },
    stopWorkflowState: (state) => {
      state.isWorkflowRunning = false;
      Object.values(state.sseSources).forEach((src) => src.close());
      state.sseSources = {};
    },
    appendWatcherLog: (state, action) => {
      state.watcherLogs.push(action.payload);
    },
    appendWorkflowLog: (state, action) => {
      state.workflowLogs.push(action.payload);
    },
    appendPatcherLog: (state, action) => {
      const { envId, log } = action.payload;
      if (!state.patcherLogs[envId]) state.patcherLogs[envId] = [];
      state.patcherLogs[envId].push(log);
    },
    registerSSESource: (state, action) => {
      state.sseSources[action.payload.key] = action.payload.source;
    },
    clearLogs: (state) => {
      state.watcherLogs = [];
      state.workflowLogs = [];
      state.patcherLogs = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnvironments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnvironments.fulfilled, (state, action) => {
        state.loading = false;
        state.environments = action.payload;
      })
      .addCase(fetchEnvironments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentProjectDetails.fulfilled, (state, action) => {
        state.isWorkflowRunning = action.payload?.isWorkflowTriggered || false;
      })
      .addCase(startWorkflow.fulfilled, (state) => {
        state.isWorkflowRunning = true;
      })
      .addCase(stopWorkflow.fulfilled, (state) => {
        state.isWorkflowRunning = false;
      });
  },
});

export const {
  startWorkflowState,
  stopWorkflowState,
  appendWatcherLog,
  appendWorkflowLog,
  appendPatcherLog,
  registerSSESource,
  clearLogs,
} = projectPageSlice.actions;

export default projectPageSlice.reducer;

// ================== SSE Functions ==================
// projectPageSlice.js
export const startLogsSSE = () => (dispatch, getState) => {
  const { environments, sseSources } = getState().projectPage;

  // ✅ Agar pehle se open hai to dobara mat khol
  if (sseSources.watcher || sseSources.workflow) {
    console.log("SSE already connected, skipping re-init...");
    return;
  }

  // Watcher logs
  const watcherSource = new EventSource("/api/v1/callCore/logs/watcher");
  watcherSource.onmessage = (e) => dispatch(appendWatcherLog(e.data));
  watcherSource.onerror = (err) => console.error("Watcher SSE error:", err);
  watcherSource.onopen = () => console.log("Watcher SSE connected");
  dispatch(registerSSESource({ key: "watcher", source: watcherSource }));

  // Workflow logs
  const workflowSource = new EventSource("/api/v1/callCore/logs/workflow");
  workflowSource.onmessage = (e) => dispatch(appendWorkflowLog(e.data));
  workflowSource.onerror = (err) => console.error("Workflow SSE error:", err);
  workflowSource.onopen = () => console.log("Workflow SSE connected");
  dispatch(registerSSESource({ key: "workflow", source: workflowSource }));

  // Patcher logs
  environments.forEach((env) => {
    if (sseSources[`patcher-${env._id}`]) return; // ✅ skip duplicate
    const source = new EventSource(`/api/v1/callCore/logs/patcher/${env._id}`);
    source.onmessage = (e) => dispatch(appendPatcherLog({ envId: env._id, log: e.data }));
    source.onerror = (err) => console.error(`Patcher SSE error [${env._id}]:`, err);
    source.onopen = () => console.log(`Patcher SSE connected [${env.environmentName}]`);
    dispatch(registerSSESource({ key: `patcher-${env._id}`, source }));
  });
};



export const stopSSE = () => (dispatch, getState) => {
  const { sseSources } = getState().projectPage;
  Object.values(sseSources).forEach((src) => src.close());
  dispatch(stopWorkflowState());
};
