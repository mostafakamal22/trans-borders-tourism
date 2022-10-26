import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import paymentServices from "./paymentServices";

type InitialState = {
  paymentsList: null | any;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
};

const initialState: InitialState = {
  paymentsList: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

//Get All Payment
export const getAllPayments = createAsyncThunk(
  "payments/getAllPayments",
  async (adminData: { token: string }, thunkAPI) => {
    try {
      return await paymentServices.getAllPayments(adminData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Create Payment
export const createPayment = createAsyncThunk(
  "payments/createPayment",
  async (paymentData: any, thunkAPI) => {
    try {
      return await paymentServices.createPayment(paymentData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Update Payment
export const updatePayment = createAsyncThunk(
  "payments/updatePayment",
  async (paymentData: any, thunkAPI) => {
    try {
      return await paymentServices.updatePayment(paymentData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Delete Visa
export const deletePayment = createAsyncThunk(
  "payments/deletePayment",
  async (payload: { id: string; token: string }, thunkAPI) => {
    try {
      return await paymentServices.deletePayment(payload);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Logout
export const paymentsLogout = createAsyncThunk("payments/logout", async () => {
  paymentServices.paymentsLogout();
});

export const paymentSlice = createSlice({
  name: "paymentsData",
  initialState,
  reducers: {
    resetPaymentsStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPayments.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getAllPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.paymentsList = action.payload as null | any;
      })
      .addCase(getAllPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(deletePayment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تــم حذف المصــروف بنجــاح";
        state.paymentsList = state.paymentsList.filter(
          (invoice: any) => invoice._id !== action.payload.id
        );
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(createPayment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تم حفظ المصــروف بنجــاح";
        state.paymentsList = [...state.paymentsList, action.payload];
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(updatePayment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تم تعديل المصــروف بنجــاح";
        state.paymentsList = state.paymentsList.map((payment: any) => {
          if (payment._id === action.payload._id) {
            return action.payload;
          }
          return payment;
        });
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(paymentsLogout.fulfilled, (state) => {
        state.paymentsList = null;
      });
  },
});

export const { resetPaymentsStatus } = paymentSlice.actions;

export default paymentSlice.reducer;
