import { apiSlice } from "../../../app/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export type LoginParams = {
  password: string;
  email: string;
};

export type TokenDataResponse = {
  accessToken: string;
};

export type AdminData = {
  name: string;
  email: string;
};

export type UpdateAdminData = {
  id: string;
  email: string;
  password: string;
  repeatedPassword: string;
  oldPassword: string;
};

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdmin: builder.query<AdminData, string>({
      query: (id) => ({
        url: `/api/admins/${id}`,
      }),
    }),
    login: builder.mutation<TokenDataResponse, LoginParams>({
      query: (credentials) => ({
        url: "/api/admins/login",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(_credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ ...data }));
        } catch {}
      },
    }),
    updateAdmin: builder.mutation<AdminData, UpdateAdminData>({
      query: (updateAdminData) => ({
        url: `/api/admins/${updateAdminData.id}`,
        method: "PUT",
        body: { ...updateAdminData },
      }),
    }),
    refresh: builder.mutation<TokenDataResponse, void>({
      query: () => ({
        url: "/api/admins/refresh",
        method: "GET",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken } = data;

          dispatch(setCredentials({ accessToken }));
        } catch {}
      },
    }),
    sendLogout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/admins/logout",
        method: "GET",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (_err) {}
      },
    }),
  }),
});

export const {
  useGetAdminQuery,
  useLoginMutation,
  useUpdateAdminMutation,
  useRefreshMutation,
  useSendLogoutMutation,
} = authApiSlice;
