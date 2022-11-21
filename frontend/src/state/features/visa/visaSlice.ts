import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import visaServices from "./visaServices";

type InitialState = {
  visasList: null | any;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
};

const initialState: InitialState = {
  visasList: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

//Get All Visas
export const getAllVisas = createAsyncThunk(
  "visas/getAllVisas",
  async (adminData: { token: string }, thunkAPI) => {
    try {
      return await visaServices.getAllVisas(adminData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Create Visa
export const createVisa = createAsyncThunk(
  "visas/createVisa",
  async (visaData: any, thunkAPI) => {
    try {
      return await visaServices.createVisa(visaData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Update Visa
export const updateVisa = createAsyncThunk(
  "visas/updateVisa",
  async (visaData: any, thunkAPI) => {
    try {
      return await visaServices.updateVisa(visaData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Delete Visa
export const deleteVisa = createAsyncThunk(
  "visas/deleteVisa",
  async (payload: { id: string; token: string }, thunkAPI) => {
    try {
      return await visaServices.deleteVisa(payload);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Logout
export const visasLogout = createAsyncThunk("visas/logout", async () => {
  visaServices.visasLogout();
});

export const visaSlice = createSlice({
  name: "visasData",
  initialState,
  reducers: {
    resetVisasStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllVisas.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getAllVisas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.visasList = action.payload as null | any;
      })
      .addCase(getAllVisas.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(deleteVisa.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(deleteVisa.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تم حذف التأشيرة بنجاح";
        state.visasList = state.visasList.filter(
          (invoice: any) => invoice._id !== action.payload.id
        );
      })
      .addCase(deleteVisa.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(createVisa.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createVisa.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تم حفظ التأشيرة بنجاح";
        state.visasList = [...state.visasList, action.payload];
      })
      .addCase(createVisa.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(updateVisa.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateVisa.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تم تعديل التأشيرة بنجــاح";
        state.visasList = state.visasList.map((visa: any) => {
          if (visa._id === action.payload._id) {
            return action.payload;
          }
          return visa;
        });
      })
      .addCase(updateVisa.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(visasLogout.fulfilled, (state) => {
        state.visasList = null;
      });
  },
});

export const { resetVisasStatus } = visaSlice.actions;

export default visaSlice.reducer;
