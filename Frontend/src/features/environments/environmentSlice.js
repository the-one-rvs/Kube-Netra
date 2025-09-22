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

export const fetchEnvironmentDetails = createAsyncThunk(
  "environments/fetchEnvironmentDetails",
  async ({ projectId, environmentNumber }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/api/v1/environment/getEnvironment/${projectId}/${environmentNumber}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch environment details");
    }
  }
);

export const updateEnvironment = createAsyncThunk(
  "environments/updateEnvironment",
  async ({ environmentId, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `/api/v1/environment/updateEnvironment/${environmentId}`,
        formData,
        {
          // headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update environment");
    }
  }
);

// Delete Environment API
export const deleteEnvironment = createAsyncThunk(
  "environments/deleteEnvironment",
  async (environmentId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `/api/v1/environment/deleteEnvironment/${environmentId}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete environment"
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
    resetEnvironmentState: (state) => {
      state.success = false;
      state.error = null;
      state.environment = null;
    }

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
        state.environment = action.payload.data;
      })
      .addCase(createEnvironment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEnvironmentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.details = null;
      })
      .addCase(fetchEnvironmentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload.data;
      })
      .addCase(fetchEnvironmentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update environment
      .addCase(updateEnvironment.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateEnvironment.fulfilled, (state, action) => {
      state.loading = false;
      state.environment = action.payload;
      state.success = true;   // ✅ success flag
    })
    .addCase(updateEnvironment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update environment";
      state.success = false;
    })
    // Delete environment
  .addCase(deleteEnvironment.pending, (state) => {
    state.loading = true;
    state.error = null;
    state.success = false;
  })
  .addCase(deleteEnvironment.fulfilled, (state, action) => {
    state.loading = false;
    state.success = true;   // mark as success
    state.environment = null; // clear environment since deleted
  })
  .addCase(deleteEnvironment.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload || "Failed to delete environment";
    state.success = false;
  });

  },
});

export const { clearEnvironmentState, resetEnvironmentState } = environmentSlice.actions;
// export { deleteEnvironment };
export default environmentSlice.reducer;
