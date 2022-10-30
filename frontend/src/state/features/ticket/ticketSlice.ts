import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ticketServices from "./ticketServices";

type InitialState = {
  ticketsList: null | any;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
};

const initialState: InitialState = {
  ticketsList: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

//Get All Tickets
export const getAllTickets = createAsyncThunk(
  "tickets/getAllTickets",
  async (adminData: { token: string }, thunkAPI) => {
    try {
      return await ticketServices.getAllTickests(adminData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Create Ticket
export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async (paymentData: any, thunkAPI) => {
    try {
      return await ticketServices.createTicket(paymentData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Update Ticket
export const updateTicket = createAsyncThunk(
  "tickets/updateTicket",
  async (paymentData: any, thunkAPI) => {
    try {
      return await ticketServices.updateTicket(paymentData);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Delete Ticket
export const deleteTicket = createAsyncThunk(
  "tickets/deleteTicket",
  async (payload: { id: string; token: string }, thunkAPI) => {
    try {
      return await ticketServices.deleteTicket(payload);
    } catch (error: any) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Logout
export const ticketsLogout = createAsyncThunk("tickets/logout", async () => {
  ticketServices.ticketsLogout();
});

export const ticketSlice = createSlice({
  name: "ticketsData",
  initialState,
  reducers: {
    resetTicketsStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTickets.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getAllTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.ticketsList = action.payload as null | any;
      })
      .addCase(getAllTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(deleteTicket.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تــم حذف التذكرة بنجــاح";
        state.ticketsList = state.ticketsList.filter(
          (invoice: any) => invoice._id !== action.payload.id
        );
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تم حفظ التذكرة بنجــاح";
        state.ticketsList = [...state.ticketsList, action.payload];
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(updateTicket.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "تم تعديل التذكرة بنجــاح";
        state.ticketsList = state.ticketsList.map((payment: any) => {
          if (payment._id === action.payload._id) {
            return action.payload;
          }
          return payment;
        });
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      .addCase(ticketsLogout.fulfilled, (state) => {
        state.ticketsList = null;
      });
  },
});

export const { resetTicketsStatus } = ticketSlice.actions;

export default ticketSlice.reducer;
