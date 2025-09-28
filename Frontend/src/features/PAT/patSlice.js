// src/features/PAT/patSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch all PATs
export const fetchAllPAT = createAsyncThunk("pat/fetchAll", async () => {
  const res = await axios.get("/api/v1/pat/showAllPAT");
  return res.data.data;
});

// ✅ Add new PAT
export const addGithubPAT = createAsyncThunk(
  "pat/addGithubPAT",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/v1/pat/addGithubPAT", payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add GitHub PAT"
      );
    }
  }
);

// ✅ Delete PAT
export const deletePAT = createAsyncThunk(
  "pat/deletePAT",
  async (patId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/api/v1/pat/deletePAT/${patId}`);
      return patId; // return id to remove from state.items
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete PAT"
      );
    }
  }
);

const patSlice = createSlice({
  name: "pat",
  initialState: {
    items: [],
    loading: false,
    error: null,
    pat: null, // for add or details
  },
  reducers: {
    clearPATState: (state) => {
      state.pat = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch All
      .addCase(fetchAllPAT.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPAT.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllPAT.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 🔹 Add PAT
      .addCase(addGithubPAT.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.pat = null;
      })
      .addCase(addGithubPAT.fulfilled, (state, action) => {
        state.loading = false;
        state.pat = action.payload;
        state.items.push(action.payload);
      })
      .addCase(addGithubPAT.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // 🔹 Delete PAT
      .addCase(deletePAT.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePAT.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((p) => p._id !== action.payload);
        if (state.pat?._id === action.payload) state.pat = null;
      })
      .addCase(deletePAT.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete PAT";
      });
  },
});

export const { clearPATState } = patSlice.actions;
export default patSlice.reducer;
