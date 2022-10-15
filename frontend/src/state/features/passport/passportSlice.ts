import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import passportServices from "./passportServices";

type InitialState = {
  passportsList: null | any;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
};

const initialState: InitialState = {
  passportsList: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

//Get All passports
export const getAllPassports = createAsyncThunk(
  "passports/getAllPassports",
  async (adminData: { token: string }, thunkAPI) => {
    try {
      return await passportServices.getAllPassports(adminData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Create passport
export const createPassport = createAsyncThunk(
  "passports/createPassport",
  async (passportData: any, thunkAPI) => {
    try {
      return await passportServices.createPassport(passportData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Update passport
export const updatePassport = createAsyncThunk(
  "passports/updatePassport",
  async (
    payload: { id: string; token: string; newState: string; oldState: string },
    thunkAPI
  ) => {
    try {
      return await passportServices.updatePassport(payload);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Delete passport
export const deletePassport = createAsyncThunk(
  "passports/deletePassport",
  async (payload: { id: string; token: string }, thunkAPI) => {
    try {
      return await passportServices.deletePassport(payload);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Logout
export const passportsLogout = createAsyncThunk(
  "passports/logout",
  async () => {
    passportServices.passportsLogout();
  }
);

export const passportSlice = createSlice({
  name: "PassportsData",
  initialState,
  reducers: {
    resetPassportsStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPassports.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getAllPassports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.passportsList = action.payload as null | any;
      })
      .addCase(getAllPassports.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(updatePassport.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updatePassport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "State Updated Successfully!";
        state.passportsList = state.passportsList.map((passport: any) => {
          if (passport._id === action.payload._id) {
            return action.payload;
          }
          return passport;
        });
      })
      .addCase(updatePassport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(deletePassport.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(deletePassport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Passport Deleted Successfully!";
        state.passportsList = state.passportsList.filter(
          (invoice: any) => invoice._id !== action.payload.id
        );
      })
      .addCase(deletePassport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(createPassport.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createPassport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Passport Has Been Created Successfully!";
        state.passportsList = [...state.passportsList, action.payload];
      })
      .addCase(createPassport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(passportsLogout.fulfilled, (state) => {
        state.passportsList = null;
      });
  },
});

export const { resetPassportsStatus } = passportSlice.actions;

export default passportSlice.reducer;
