import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bankServices from "./bankServices";

type InitialState = {
  banksList: null | any;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
};

const initialState: InitialState = {
  banksList: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

//Get All Banks
export const getAllBanks = createAsyncThunk(
  "banks/getAllBanks",
  async (adminData: { token: string }, thunkAPI) => {
    try {
      return await bankServices.getAllBanks(adminData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Create Bank
export const createBank = createAsyncThunk(
  "banks/createBank",
  async (bankData: any, thunkAPI) => {
    try {
      return await bankServices.createBank(bankData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Update Bank
export const updateBank = createAsyncThunk(
  "banks/updateBank",
  async (bankData: any, thunkAPI) => {
    try {
      return await bankServices.updateBank(bankData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Delete Bank
export const deleteBank = createAsyncThunk(
  "banks/deleteBank",
  async (payload: { id: string; token: string }, thunkAPI) => {
    try {
      return await bankServices.deleteBank(payload);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Logout
export const BanksLogout = createAsyncThunk("banks/logout", async () => {
  bankServices.BanksLogout();
});

export const bankSlice = createSlice({
  name: "banksData",
  initialState,
  reducers: {
    resetBanksStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBanks.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getAllBanks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.banksList = action.payload as null | any;
      })
      .addCase(getAllBanks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(deleteBank.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(deleteBank.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تم حذف المعاملة البنكية بنجاح";
        state.banksList = state.banksList.filter(
          (bank: any) => bank._id !== action.payload.id
        );
      })
      .addCase(deleteBank.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(createBank.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createBank.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تم حفظ المعاملة البنكية بنجاح";
        state.banksList = [...state.banksList, action.payload];
      })
      .addCase(createBank.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(updateBank.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateBank.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تم تعديل المعاملة البنكية بنجــاح";
        state.banksList = state.banksList.map((bank: any) => {
          if (bank._id === action.payload._id) {
            return action.payload;
          }
          return bank;
        });
      })
      .addCase(updateBank.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(BanksLogout.fulfilled, (state) => {
        state.banksList = null;
      });
  },
});

export const { resetBanksStatus } = bankSlice.actions;

export default bankSlice.reducer;
