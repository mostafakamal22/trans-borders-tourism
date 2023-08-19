import { PaginateOptions } from "mongoose";
import {
  IBillCustomer,
  IBillDocument,
  IBillProduct,
} from "../../../../../backend/models/billModel";
import { apiSlice } from "../../app/apiSlice";
import { ListResponse } from "../passport/passportsApiSlice";

export interface BillSearchQuery {
  option?: PaginateOptions;
  query?: {
    name?: string;
  };
}

export interface BillData {
  customer: IBillCustomer;
  details: (IBillProduct & { data?: any })[];
  total: number;
  date: Date | string;
  //   subtotal: number;
  //   taxDue: number;
  //   taxRate: number;
  //   taxable: number;
  //   paidAmount?: number;
  //   remainingAmount?: number;
  //   paymentMethod?: string;
  other?: string;
}

export const billsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBills: builder.query<ListResponse<IBillDocument>, BillSearchQuery>({
      query: (searchQueries) => ({
        method: "POST",
        url: "/api/bills/query",
        body: { ...searchQueries },
      }),
      providesTags: (result, _error, _page) =>
        result
          ? [
              // Provides a tag for each Doc in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.docs.map(({ id }) => ({
                type: "Bill" as const,
                id,
              })),
              { type: "Bill", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Bill", id: "PARTIAL-LIST" }],
    }),
    createBill: builder.mutation<IBillDocument, BillData>({
      query: (billData) => ({
        url: "/api/bills",
        method: "POST",
        body: { ...billData },
      }),
      invalidatesTags: [
        { type: "Bill", id: "PARTIAL-LIST" },
        "Passport",
        "Ticket",
      ],
    }),
    updateBill: builder.mutation<IBillDocument, Partial<IBillDocument>>({
      query: (billData) => ({
        url: `/api/bills/${billData.id}`,
        method: "PUT",
        body: { ...billData },
      }),
      invalidatesTags: (_result, _error, IBillDocument) => [
        { type: "Bill", id: IBillDocument.id },
        { type: "Bill", id: "PARTIAL-LIST" },
        "Passport",
        "Ticket",
      ],
    }),
    deleteBill: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/api/bills/${id}`,
        method: "DELETE",
      }),
      // Invalidates the tag for this Doc `id`, as well as the `PARTIAL-LIST` tag,
      // causing the `getBills` query to re-fetch if a component is subscribed to the query.
      invalidatesTags: (_result, _error, id) => [
        { type: "Bill", id },
        { type: "Bill", id: "PARTIAL-LIST" },
        "Passport",
        "Ticket",
      ],
    }),
  }),
});

export const {
  useGetBillsQuery,
  useCreateBillMutation,
  useUpdateBillMutation,
  useDeleteBillMutation,
  usePrefetch,
} = billsApiSlice;
