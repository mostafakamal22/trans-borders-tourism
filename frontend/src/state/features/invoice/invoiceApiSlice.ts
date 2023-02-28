import { PaginateOptions } from "mongoose";
import {
  ICustomer,
  IInvoiceDocument,
  IProduct,
} from "../../../../../backend/models/invoiceModel";
import { apiSlice } from "../../app/apiSlice";
import { ListResponse } from "../passport/passportsApiSlice";

export interface InvoiceSearchQuery {
  option?: PaginateOptions;
  query?: {
    name?: string;
  };
}

export interface InvoiceData {
  ID?: string;
  customer: ICustomer;
  details: IProduct[];
  total: number;
  subtotal: number;
  date: Date | string;
  taxDue: number;
  taxRate: number;
  taxable: number;
  other?: string;
  paidAmount?: number;
  remainingAmount?: number;
  paymentMethod?: string;
}

export const invoicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<
      ListResponse<IInvoiceDocument>,
      InvoiceSearchQuery
    >({
      query: (searchQueries) => ({
        method: "POST",
        url: "/api/invoices/query",
        body: { ...searchQueries },
      }),
      providesTags: (result, _error, _page) =>
        result
          ? [
              // Provides a tag for each Doc in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.docs.map(({ id }) => ({
                type: "Invoice" as const,
                id,
              })),
              { type: "Invoice", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Invoice", id: "PARTIAL-LIST" }],
    }),
    createInvoice: builder.mutation<IInvoiceDocument, InvoiceData>({
      query: (invoiceData) => ({
        url: "/api/invoices",
        method: "POST",
        body: { ...invoiceData },
      }),
      invalidatesTags: [{ type: "Invoice", id: "PARTIAL-LIST" }],
    }),
    deleteInvoice: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/api/invoices/${id}`,
        method: "DELETE",
      }),
      // Invalidates the tag for this Doc `id`, as well as the `PARTIAL-LIST` tag,
      // causing the `getInvoices` query to re-fetch if a component is subscribed to the query.
      invalidatesTags: (_result, _error, id) => [
        { type: "Invoice", id },
        { type: "Invoice", id: "PARTIAL-LIST" },
      ],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
  usePrefetch,
} = invoicesApiSlice;
