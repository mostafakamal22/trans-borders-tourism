import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import invoiceServices from "./invoiceServices";

type InitialState = {
  invoiceList: null | any;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
};

const initialState: InitialState = {
  invoiceList: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

//Get All invoices
export const getAllInvoices = createAsyncThunk(
  "admin/getAllInvoices",
  async (adminData: { token: string }, thunkAPI) => {
    try {
      return await invoiceServices.getAllInvoices(adminData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Create invoice
export const createInvoice = createAsyncThunk(
  "admin/createInvoice",
  async (invoiceData, thunkAPI) => {
    try {
      return await invoiceServices.createInvoice(invoiceData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Delete invoice
export const deleteInvoice = createAsyncThunk(
  "admin/deleteInvoice",
  async (payload: { id: string; token: string }, thunkAPI) => {
    try {
      return await invoiceServices.deleteInvoice(payload);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Logout
export const adminsLogout = createAsyncThunk("admins/logout", async () => {
  invoiceServices.adminsLogout();
});

export const invoiceSlice = createSlice({
  name: "InvoicesData",
  initialState,
  reducers: {
    resetInvoicesStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllInvoices.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getAllInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.invoiceList = action.payload as null | any;
      })
      .addCase(getAllInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(deleteInvoice.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Invoice Deleted Successfully!";
        state.invoiceList = state.invoiceList.filter(
          (invoice: any) => invoice._id !== action.payload.id
        );
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(createInvoice.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Invioce Has Been Created Successfully!";
        state.invoiceList = [...state.invoiceList, action.payload];
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(adminsLogout.fulfilled, (state) => {
        state.invoiceList = null;
      });
  },
});

export const { resetInvoicesStatus } = invoiceSlice.actions;

export default invoiceSlice.reducer;
