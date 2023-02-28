import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../store/store";

const initialState: { token: string | null } = {
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;

      state.token = accessToken;
    },
    logOut: (state) => {
      state.token = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
