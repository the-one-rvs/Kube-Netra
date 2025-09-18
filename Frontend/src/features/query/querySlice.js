import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔥 Async thunk for sending query
export const sendQuery = createAsyncThunk(
  "query/sendQuery",
  async ({ email, msg }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/v1/mail/sendQuery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, msg }),
      });

      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to send query");
      }
      return data.message || "Query sent successfully!";
    } catch (err) {
      return rejectWithValue(err.message || "Something went wrong");
    }
  }
);

const querySlice = createSlice({
  name: "query",
  initialState: {
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearStatus: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendQuery.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(sendQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(sendQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStatus } = querySlice.actions;
export default querySlice.reducer;
