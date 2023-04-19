import { PaginateOptions } from "mongoose";
import { IPaymentDocument } from "../../../../../backend/models/paymentModel";
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

export interface PaymentSearchQuery {
  option?: PaginateOptions;
  query?: {
    year?: number;
    day?: number;
    month?: number;
    type?: string;
    method?: string;
  };
}

export const paymentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<
      ListResponse<IPaymentDocument>,
      PaymentSearchQuery
    >({
      query: (searchQueries) => ({
        method: "POST",
        url: "/api/payments/query",
        body: { ...searchQueries },
      }),
      providesTags: (result, _error, _page) =>
        result
          ? [
              // Provides a tag for each Doc in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.docs.map(({ id }) => ({
                type: "Payment" as const,
                id,
              })),
              { type: "Payment", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Payment", id: "PARTIAL-LIST" }],
    }),
    createPayment: builder.mutation<
      IPaymentDocument,
      Partial<IPaymentDocument>
    >({
      query: (paymentData) => ({
        url: "/api/payments",
        method: "POST",
        body: { ...paymentData },
      }),
      invalidatesTags: [{ type: "Payment", id: "PARTIAL-LIST" }],
    }),
    updatePayment: builder.mutation<
      IPaymentDocument,
      Partial<IPaymentDocument>
    >({
      query: (paymentData) => ({
        url: `/api/payments/${paymentData.id}`,
        method: "PUT",
        body: { ...paymentData },
      }),
      invalidatesTags: (_result, _error, IPaymentDocument) => [
        { type: "Payment", id: IPaymentDocument.id },
        { type: "Payment", id: "PARTIAL-LIST" },
      ],
    }),
    deletePayment: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/api/payments/${id}`,
        method: "DELETE",
      }),
      // Invalidates the tag for this Doc `id`, as well as the `PARTIAL-LIST` tag,
      // causing the `getPayments` query to re-fetch if a component is subscribed to the query.
      invalidatesTags: (_result, _error, id) => [
        { type: "Payment", id },
        { type: "Payment", id: "PARTIAL-LIST" },
      ],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  usePrefetch,
} = paymentsApiSlice;
