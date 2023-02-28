import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../app/apiSlice";
import authReducer from "../../state/features/admin/auth/authSlice";
import { toastHandlingMiddlware } from "./toastHandlingMiddlware";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      apiSlice.middleware,
      toastHandlingMiddlware,
    ]),
  devTools: import.meta.env.MODE === "production" ? false : true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
