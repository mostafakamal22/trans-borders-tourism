import { PaginateOptions } from "mongoose";
import { apiSlice } from "../../app/apiSlice";
import { ListResponse } from "../passport/passportsApiSlice";

export interface OtherServiceSearchQuery {
  option?: PaginateOptions;
  query?: {
    name?: string;
  };
}

export type IOtherService = {
  id: string;
  type: "Other";
  desc: string;
  price: number;
  quantity: number;
  date: Date | string;
  bill_id: string;
  bill_customer_name: string;
  data: null;
};

export const otherServicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOtherServices: builder.query<
      ListResponse<IOtherService>,
      OtherServiceSearchQuery
    >({
      query: (searchQueries) => ({
        method: "POST",
        url: "/api/otherServices/query",
        body: { ...searchQueries },
      }),
      providesTags: (result, _error, _page) =>
        result
          ? [
              // Provides a tag for each Doc in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.docs.map(({ id }) => ({
                type: "OtherService" as const,
                id,
              })),
              { type: "OtherService", id: "PARTIAL-LIST" },
            ]
          : [{ type: "OtherService", id: "PARTIAL-LIST" }],
    }),
  }),
});

export const { useGetOtherServicesQuery, usePrefetch } = otherServicesApiSlice;
