import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import purchaseServices from "./purchaseServices";

type InitialState = {
  purchasesList: null | any;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
};

const initialState: InitialState = {
  purchasesList: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

//Get All Purchases
export const getAllPurchases = createAsyncThunk(
  "Purchases/getAllPurchases",
  async (adminData: { token: string }, thunkAPI) => {
    try {
      return await purchaseServices.getAllPurchases(adminData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Create Purchase
export const createPurchase = createAsyncThunk(
  "Purchases/createPurchase",
  async (purchaseData: any, thunkAPI) => {
    try {
      return await purchaseServices.createPurchase(purchaseData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Update Purchase
export const updatePurchase = createAsyncThunk(
  "Purchases/updatePurchase",
  async (purchaseData: any, thunkAPI) => {
    try {
      return await purchaseServices.updatePurchase(purchaseData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Delete Purchase
export const deletePurchase = createAsyncThunk(
  "Purchases/deletePurchase",
  async (payload: { id: string; token: string }, thunkAPI) => {
    try {
      return await purchaseServices.deletePurchase(payload);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Logout
export const purchasesLogout = createAsyncThunk(
  "Purchases/logout",
  async () => {
    purchaseServices.purchasesLogout();
  }
);

export const purchaseSlice = createSlice({
  name: "purchasesData",
  initialState,
  reducers: {
    resetPurchasesStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPurchases.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getAllPurchases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.purchasesList = action.payload as null | any;
      })
      .addCase(getAllPurchases.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(deletePurchase.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تــم حذف المشترى بنجــاح";
        state.purchasesList = state.purchasesList.filter(
          (invoice: any) => invoice._id !== action.payload.id
        );
      })
      .addCase(deletePurchase.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(createPurchase.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تم حفظ المشترى بنجــاح";
        state.purchasesList = [...state.purchasesList, action.payload];
      })
      .addCase(createPurchase.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(updatePurchase.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تم تعديل المشترى بنجــاح";
        state.purchasesList = state.purchasesList.map((payment: any) => {
          if (payment._id === action.payload._id) {
            return action.payload;
          }
          return payment;
        });
      })
      .addCase(updatePurchase.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(purchasesLogout.fulfilled, (state) => {
        state.purchasesList = null;
      });
  },
});

export const { resetPurchasesStatus } = purchaseSlice.actions;

export default purchaseSlice.reducer;
