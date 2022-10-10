import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminAuthServices from "./adminAuthServices";

type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
};

type InitialState = {
  info: null | Admin;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
};

type AdminData = { token: string; id: string };

const initialState: InitialState = {
  info: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

//Login
export const adminLogin = createAsyncThunk(
  "auth/admin/login",
  async (adminData, thunkAPI) => {
    try {
      return await adminAuthServices.adminLogin(adminData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Get Admin
export const getAdmin = createAsyncThunk(
  "auth/admin/getAdmin",
  async (adminData: AdminData, thunkAPI) => {
    try {
      return await adminAuthServices.getAdmin(adminData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Update Admin
export const updateAdmin = createAsyncThunk(
  "auth/admin/updateAdmin",
  async (adminData: AdminData, thunkAPI) => {
    try {
      return await adminAuthServices.updateAdmin(adminData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Logout
export const adminLogout = createAsyncThunk("auth/admin/logout", async () => {
  adminAuthServices.adminLogout();
});

export const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    resetAdminAuthStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.info = action.payload;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
        state.info = null;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.info = null;
      })
      .addCase(getAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.info = {
          ...state.info,
          email: action.payload.email,
          role: action.payload.role,
        } as Admin;
      })
      .addCase(getAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(updateAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Your Profile Has Been Updated Successfully!";
        state.info = {
          ...state.info,
          email: action.payload.email,
        } as Admin;
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      });
  },
});

export const { resetAdminAuthStatus } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
