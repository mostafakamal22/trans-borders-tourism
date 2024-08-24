import { PaginateOptions } from "mongoose";
import { IPassportDocument } from "../../../../../backend/models/passportModel";
import {
  PassportServiceQueries,
  PassportStateQueries,
  PassportsChartsCalculations,
} from "../../../components/passport/types";
import { apiSlice } from "../../app/apiSlice";

export interface ListResponse<T> {
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
  docs: T[];
}

export interface PassportSearchQuery {
  option?: PaginateOptions;
  query?: {
    year?: number;
    day?: number;
    month?: number;
    state?: PassportStateQueries[];
    service?: Partial<PassportServiceQueries>[];
    nationality?: string;
  };
}

export const passportsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPassports: builder.query<
      ListResponse<IPassportDocument & { bill_id: number | null }>,
      PassportSearchQuery
    >({
      query: (searchQueries) => ({
        method: "POST",
        url: "/api/passports/query",
        body: { ...searchQueries },
      }),
      providesTags: (result, _error, _page) =>
        result
          ? [
              // Provides a tag for each Doc in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.docs.map(({ id }) => ({
                type: "Passport" as const,
                id,
              })),
              { type: "Passport", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Passport", id: "PARTIAL-LIST" }],
    }),
    getOnePassport: builder.query<IPassportDocument, { id: string }>({
      query: ({ id }) => ({
        method: "GET",
        url: `/api/passports/${id}`,
      }),
    }),
    createPassport: builder.mutation<
      IPassportDocument,
      Partial<IPassportDocument>
    >({
      query: (passportData) => ({
        url: "/api/passports",
        method: "POST",
        body: { ...passportData },
      }),
      invalidatesTags: [{ type: "Passport", id: "PARTIAL-LIST" }],
    }),
    updatePassport: builder.mutation<
      IPassportDocument,
      Partial<IPassportDocument>
    >({
      query: (passportData) => ({
        url: `/api/passports/${passportData.id}`,
        method: "PUT",
        body: { ...passportData },
      }),
      invalidatesTags: (_result, _error, IPassportDocument) => [
        { type: "Passport", id: IPassportDocument.id },
        { type: "Passport", id: "PARTIAL-LIST" },
      ],
    }),
    deletePassport: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/api/passports/${id}`,
        method: "DELETE",
      }),
      // Invalidates the tag for this Doc `id`, as well as the `PARTIAL-LIST` tag,
      // causing the `getPassports` query to re-fetch if a component is subscribed to the query.
      invalidatesTags: (_result, _error, id) => [
        { type: "Passport", id },
        { type: "Passport", id: "PARTIAL-LIST" },
      ],
    }),
    getPassportsStatistics: builder.query<
      ReturnType<PassportsChartsCalculations>,
      null
    >({
      query: () => ({
        url: "/api/passports/statistics",
      }),
    }),
  }),
});

export const {
  useGetPassportsQuery,
  useGetOnePassportQuery,
  useCreatePassportMutation,
  useUpdatePassportMutation,
  useDeletePassportMutation,
  useGetPassportsStatisticsQuery,
  usePrefetch,
} = passportsApiSlice;
