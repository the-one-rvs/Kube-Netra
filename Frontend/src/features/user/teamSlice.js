import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ============================
   🔹 Member APIs
===============================*/

// 🟢 Fetch all team members
export const fetchAllMembers = createAsyncThunk(
  "team/fetchAllMembers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/users/allUsers");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🟢 Register new member
export const registerMember = createAsyncThunk(
  "team/registerMember",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/users/register", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🟢 Fetch available permissions
export const fetchPermissions = createAsyncThunk(
  "team/fetchPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/users/getPermission");
      return response.data.data.map((p) => p.name) || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🟢 Get single user details
export const fetchUserDetails = createAsyncThunk(
  "team/fetchUserDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/users/getUser/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/* ============================
   🔹 Permission APIs
===============================*/

// Add user permissions
export const addUserPermission = createAsyncThunk(
  "team/addUserPermission",
  async ({ userId, newPermissions }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/api/v1/users/addPermissions/${userId}`,
        { newPermissions }
      );
      return { userId, permissions: response.data.data.permissions };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Remove user permissions
export const removeUserPermission = createAsyncThunk(
  "team/removeUserPermission",
  async ({ userId, permissionsToRemove }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/api/v1/users/removePermissions/${userId}`,
        { permissionsToRemove }
      );
      return { userId, permissions: response.data.data.permissions };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add project permission
export const addUserProjectPermission = createAsyncThunk(
  "team/addUserProjectPermission",
  async ({ userId, type, projectName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/api/v1/users/addProjectPermission/${userId}`,
        { type, projectName }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Remove project permission
export const removeUserProjectPermission = createAsyncThunk(
  "team/removeUserProjectPermission",
  async ({ userId, type, projectName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/api/v1/users/removeProjectPermission/${userId}`,
        { type, projectName }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Add PAT permission
export const addUserPatPermission = createAsyncThunk(
  "team/addUserPatPermission",
  async ({ userId, type, patName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/v1/users/addPatPermission/${userId}`, {
        type,
        patName,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Remove PAT permission
export const removeUserPatPermission = createAsyncThunk(
  "team/removeUserPatPermission",
  async ({ userId, type, patName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/v1/users/removePatPermission/${userId}`, {
        type,
        patName,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUserPermissions = createAsyncThunk(
  "team/fetchUserPermissions",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/users/getPermission/${userId}`);
      const perms = response.data.permissions || [];

      // Transform flat array into structured object
      const structured = {
        global: [],
        project: [],
        pat: [],
      };

      perms.forEach((p) => {
        if (p.startsWith("access_project:")) {
          // project: projectName:type
          const parts = p.split(":"); // ["access_project", "Test-Java", "workflow"]
          structured.project.push({ projectName: parts[1], type: parts[2] });
        } else if (p.startsWith("access_pat:")) {
          // if you use PAT-specific permissions like "access_pat:MyPAT:create"
          const parts = p.split(":");
          structured.pat.push({ patName: parts[1], type: parts[2] });
        } else {
          // global permission
          structured.global.push(p);
        }
      });

      return structured;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


/* ============================
   🔹 Slice
===============================*/

const teamSlice = createSlice({
  name: "team",
  initialState: {
    items: [],
    loading: false,
    error: null,

    // register
    registerLoading: false,
    registerError: null,
    registerSuccess: false,

    // permissions
    permissions: [],
    permissionsLoading: false,
    permissionsError: null,

    // single user
    userDetails: null,
    userDetailsLoading: false,
    userDetailsError: null,

    // permission actions
    permissionActionLoading: false,
    permissionActionError: null,

    userPermissions: { global: [], project: [], pat: [] },
    userPermissionsLoading: false,
    userPermissionsError: null,
  },
  reducers: {
    addMember: (state, action) => {
      state.items.push(action.payload);
    },
    removeMember: (state, action) => {
      state.items = state.items.filter((m) => m._id !== action.payload);
    },
    updateMember: (state, action) => {
      const index = state.items.findIndex((m) => m._id === action.payload._id);
      // Add the new member to the team state.
      if (index !== -1) state.items[index] = action.payload;
    },
    clearRegisterState: (state) => {
      state.registerLoading = false;
      state.registerError = null;
      state.registerSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===== Members ===== */
      .addCase(fetchAllMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== Register Member ===== */
      .addCase(registerMember.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
        state.registerSuccess = false;
      })
      .addCase(registerMember.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.registerSuccess = true;
        state.items.push(action.payload);
      })
      .addCase(registerMember.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload;
      })

      /* ===== Fetch Permissions ===== */
      .addCase(fetchPermissions.pending, (state) => {
        state.permissionsLoading = true;
        state.permissionsError = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissionsLoading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.permissionsLoading = false;
        state.permissionsError = action.payload;
      })

      /* ===== Fetch Single User ===== */
      .addCase(fetchUserDetails.pending, (state) => {
        state.userDetailsLoading = true;
        state.userDetailsError = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userDetailsLoading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.userDetailsLoading = false;
        state.userDetailsError = action.payload;
      })

      /* ===== Add/Remove User Permissions ===== */
      .addCase(addUserPermission.pending, (state) => {
        state.permissionActionLoading = true;
        state.permissionActionError = null;
      })
      .addCase(addUserPermission.fulfilled, (state, action) => {
        state.permissionActionLoading = false;
        const user = state.items.find((u) => u._id === action.payload.userId);
        if (user) user.permissions = action.payload.permissions;
      })
      .addCase(addUserPermission.rejected, (state, action) => {
        state.permissionActionLoading = false;
        state.permissionActionError = action.payload;
      })
      .addCase(removeUserPermission.pending, (state) => {
        state.permissionActionLoading = true;
        state.permissionActionError = null;
      })
      .addCase(removeUserPermission.fulfilled, (state, action) => {
        state.permissionActionLoading = false;
        const user = state.items.find((u) => u._id === action.payload.userId);
        if (user) user.permissions = action.payload.permissions;
      })
      .addCase(removeUserPermission.rejected, (state, action) => {
        state.permissionActionLoading = false;
        state.permissionActionError = action.payload;
      })

      /* ===== Project & PAT Permissions ===== */
      .addCase(addUserProjectPermission.pending, (state) => {
        state.permissionActionLoading = true;
        state.permissionActionError = null;
      })
      .addCase(addUserProjectPermission.fulfilled, (state) => {
        state.permissionActionLoading = false;
      })
      .addCase(addUserProjectPermission.rejected, (state, action) => {
        state.permissionActionLoading = false;
        state.permissionActionError = action.payload;
      })
      .addCase(removeUserProjectPermission.pending, (state) => {
        state.permissionActionLoading = true;
        state.permissionActionError = null;
      })
      .addCase(removeUserProjectPermission.fulfilled, (state) => {
        state.permissionActionLoading = false;
      })
      .addCase(removeUserProjectPermission.rejected, (state, action) => {
        state.permissionActionLoading = false;
        state.permissionActionError = action.payload;
      })
      .addCase(addUserPatPermission.pending, (state) => {
        state.permissionActionLoading = true;
        state.permissionActionError = null;
      })
      .addCase(addUserPatPermission.fulfilled, (state) => {
        state.permissionActionLoading = false;
      })
      .addCase(addUserPatPermission.rejected, (state, action) => {
        state.permissionActionLoading = false;
        state.permissionActionError = action.payload;
      })
      .addCase(removeUserPatPermission.pending, (state) => {
        state.permissionActionLoading = true;
        state.permissionActionError = null;
      })
      .addCase(removeUserPatPermission.fulfilled, (state) => {
        state.permissionActionLoading = false;
      })
      .addCase(removeUserPatPermission.rejected, (state, action) => {
        state.permissionActionLoading = false;
        state.permissionActionError = action.payload;
      })

      .addCase(fetchUserPermissions.pending, (state) => {
        state.userPermissionsLoading = true;
        state.userPermissionsError = null;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.userPermissionsLoading = false;
        state.userPermissions = action.payload;
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.userPermissionsLoading = false;
        state.userPermissionsError = action.payload;
      });
  },
});

export const {
  addMember,
  removeMember,
  updateMember,
  clearRegisterState,
} = teamSlice.actions;

export default teamSlice.reducer;
