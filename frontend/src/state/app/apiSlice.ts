import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setCredentials } from "../../state/features/admin/auth/authSlice";

const API_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_CORS_DOMAINS
    : "http://localhost:5000";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // console.log(args) // request url, method, body
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions);

  if (
    result?.error &&
    "originalStatus" in result?.error &&
    (result?.error?.originalStatus === 403 ||
      result?.error?.originalStatus === 401)
  ) {
    // send refresh token to get new access token
    const refreshResult = await baseQuery(
      "/api/admins/refresh",
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));
      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      //Okay Login Session Ended.
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Passport", "Invoice", "Ticket", "Purchase", "Payment"],
  endpoints: (_builder) => ({}),
});
