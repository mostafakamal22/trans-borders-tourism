import { PaginateOptions } from "mongoose";
import type { IReceiptVoucherDocument } from "../../../../../backend/models/receiptVoucherModel";
import { apiSlice } from "../../app/apiSlice";
import { ListResponse } from "../passport/passportsApiSlice";

export interface ReceiptVoucherSearchQuery {
  option?: PaginateOptions;
  query?: {
    year?: number;
    day?: number;
    month?: number;
    customerName?: string;
  };
}

export const receiptVouchersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReceiptVouchers: builder.query<
      ListResponse<IReceiptVoucherDocument>,
      ReceiptVoucherSearchQuery
    >({
      query: (searchQueries) => ({
        method: "POST",
        url: "/api/receiptVouchers/query",
        body: { ...searchQueries },
      }),
      providesTags: (result, _error, _page) =>
        result
          ? [
              // Provides a tag for each Doc in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.docs.map(({ id }) => ({
                type: "ReceiptVoucher" as const,
                id,
              })),
              { type: "ReceiptVoucher", id: "PARTIAL-LIST" },
            ]
          : [{ type: "ReceiptVoucher", id: "PARTIAL-LIST" }],
    }),
    getOneReceiptVoucher: builder.query<
      IReceiptVoucherDocument,
      { id: string }
    >({
      query: ({ id }) => ({
        method: "GET",
        url: `/api/receiptVouchers/${id}`,
      }),
    }),
    createReceiptVoucher: builder.mutation<
      IReceiptVoucherDocument,
      Partial<IReceiptVoucherDocument>
    >({
      query: (receiptVoucherData) => ({
        url: "/api/receiptVouchers",
        method: "POST",
        body: { ...receiptVoucherData },
      }),
      invalidatesTags: [{ type: "ReceiptVoucher", id: "PARTIAL-LIST" }],
    }),
    updateReceiptVoucher: builder.mutation<
      IReceiptVoucherDocument,
      Partial<IReceiptVoucherDocument>
    >({
      query: (receiptVoucherData) => ({
        url: `/api/receiptVouchers/${receiptVoucherData.id}`,
        method: "PUT",
        body: { ...receiptVoucherData },
      }),
      invalidatesTags: (_result, _error, IReceiptVoucherDocument) => [
        { type: "ReceiptVoucher", id: IReceiptVoucherDocument.id },
        { type: "ReceiptVoucher", id: "PARTIAL-LIST" },
      ],
    }),
    deleteReceiptVoucher: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/api/receiptVouchers/${id}`,
        method: "DELETE",
      }),
      // Invalidates the tag for this Doc `id`, as well as the `PARTIAL-LIST` tag,
      // causing the `getReceiptVouchers` query to re-fetch if a component is subscribed to the query.
      invalidatesTags: (_result, _error, id) => [
        { type: "ReceiptVoucher", id },
        { type: "ReceiptVoucher", id: "PARTIAL-LIST" },
      ],
    }),
    // getReceiptVouchersStatistics: builder.query<
    //   ReturnType<ReceiptVouchersChartsCalculations>,
    //   null
    // >({
    //   query: () => ({
    //     url: "/api/receiptVouchers/statistics",
    //   }),
    // }),
  }),
});

export const {
  useGetReceiptVouchersQuery,
  useGetOneReceiptVoucherQuery,
  useCreateReceiptVoucherMutation,
  useUpdateReceiptVoucherMutation,
  useDeleteReceiptVoucherMutation,
  // useGetReceiptVouchersStatisticsQuery,
  usePrefetch,
} = receiptVouchersApiSlice;
