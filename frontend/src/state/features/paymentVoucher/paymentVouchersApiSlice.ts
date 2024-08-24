import { PaginateOptions } from "mongoose";
import type { IPaymentVoucherDocument } from "../../../../../backend/models/paymentVoucherModel";
import { apiSlice } from "../../app/apiSlice";
import { ListResponse } from "../passport/passportsApiSlice";

export interface PaymentVoucherSearchQuery {
  option?: PaginateOptions;
  query?: {
    year?: number;
    day?: number;
    month?: number;
    customerName?: string;
  };
}

export const paymentVouchersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentVouchers: builder.query<
      ListResponse<IPaymentVoucherDocument>,
      PaymentVoucherSearchQuery
    >({
      query: (searchQueries) => ({
        method: "POST",
        url: "/api/paymentVouchers/query",
        body: { ...searchQueries },
      }),
      providesTags: (result, _error, _page) =>
        result
          ? [
              // Provides a tag for each Doc in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.docs.map(({ id }) => ({
                type: "PaymentVoucher" as const,
                id,
              })),
              { type: "PaymentVoucher", id: "PARTIAL-LIST" },
            ]
          : [{ type: "PaymentVoucher", id: "PARTIAL-LIST" }],
    }),
    getOnePaymentVoucher: builder.query<
      IPaymentVoucherDocument,
      { id: string }
    >({
      query: ({ id }) => ({
        method: "GET",
        url: `/api/paymentVouchers/${id}`,
      }),
    }),
    createPaymentVoucher: builder.mutation<
      IPaymentVoucherDocument,
      Partial<IPaymentVoucherDocument>
    >({
      query: (paymentVoucherData) => ({
        url: "/api/paymentVouchers",
        method: "POST",
        body: { ...paymentVoucherData },
      }),
      invalidatesTags: [{ type: "PaymentVoucher", id: "PARTIAL-LIST" }],
    }),
    updatePaymentVoucher: builder.mutation<
      IPaymentVoucherDocument,
      Partial<IPaymentVoucherDocument>
    >({
      query: (paymentVoucherData) => ({
        url: `/api/paymentVouchers/${paymentVoucherData.id}`,
        method: "PUT",
        body: { ...paymentVoucherData },
      }),
      invalidatesTags: (_result, _error, IPaymentVoucherDocument) => [
        { type: "PaymentVoucher", id: IPaymentVoucherDocument.id },
        { type: "PaymentVoucher", id: "PARTIAL-LIST" },
      ],
    }),
    deletePaymentVoucher: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/api/paymentVouchers/${id}`,
        method: "DELETE",
      }),
      // Invalidates the tag for this Doc `id`, as well as the `PARTIAL-LIST` tag,
      // causing the `getPaymentVouchers` query to re-fetch if a component is subscribed to the query.
      invalidatesTags: (_result, _error, id) => [
        { type: "PaymentVoucher", id },
        { type: "PaymentVoucher", id: "PARTIAL-LIST" },
      ],
    }),
    // getPaymentVouchersStatistics: builder.query<
    //   ReturnType<PaymentVouchersChartsCalculations>,
    //   null
    // >({
    //   query: () => ({
    //     url: "/api/paymentVouchers/statistics",
    //   }),
    // }),
  }),
});

export const {
  useGetPaymentVouchersQuery,
  useGetOnePaymentVoucherQuery,
  useCreatePaymentVoucherMutation,
  useUpdatePaymentVoucherMutation,
  useDeletePaymentVoucherMutation,
  // useGetPaymentVouchersStatisticsQuery,
  usePrefetch,
} = paymentVouchersApiSlice;
