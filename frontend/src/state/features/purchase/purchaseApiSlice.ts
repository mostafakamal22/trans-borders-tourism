import { PaginateOptions } from "mongoose";
import { IPurchaseDocument } from "../../../../../backend/models/purchaseModel";
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

export interface PurchaseSearchQuery {
  option?: PaginateOptions;
  query?: {
    year?: number;
    day?: number;
    month?: number;
    type?: string;
    supplier?: string;
  };
}

export const purchasesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPurchases: builder.query<
      ListResponse<IPurchaseDocument>,
      PurchaseSearchQuery
    >({
      query: (searchQueries) => ({
        method: "POST",
        url: "/api/purchases/query",
        body: { ...searchQueries },
      }),
      providesTags: (result, _error, _page) =>
        result
          ? [
              // Provides a tag for each Doc in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.docs.map(({ id }) => ({
                type: "Purchase" as const,
                id,
              })),
              { type: "Purchase", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Purchase", id: "PARTIAL-LIST" }],
    }),
    getOnePurchase: builder.query<IPurchaseDocument, { id: string }>({
      query: ({ id }) => ({
        method: "GET",
        url: `/api/purchases/${id}`,
      }),
    }),
    createPurchase: builder.mutation<
      IPurchaseDocument,
      Partial<IPurchaseDocument>
    >({
      query: (purchaseData) => ({
        url: "/api/purchases",
        method: "POST",
        body: { ...purchaseData },
      }),
      invalidatesTags: [{ type: "Purchase", id: "PARTIAL-LIST" }],
    }),
    updatePurchase: builder.mutation<
      IPurchaseDocument,
      Partial<IPurchaseDocument>
    >({
      query: (purchaseData) => ({
        url: `/api/purchases/${purchaseData.id}`,
        method: "PUT",
        body: { ...purchaseData },
      }),
      invalidatesTags: (_result, _error, IPurchaseDocument) => [
        { type: "Purchase", id: IPurchaseDocument.id },
        { type: "Purchase", id: "PARTIAL-LIST" },
      ],
    }),
    deletePurchase: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/api/purchases/${id}`,
        method: "DELETE",
      }),
      // Invalidates the tag for this Doc `id`, as well as the `PARTIAL-LIST` tag,
      // causing the `getPurchases` query to re-fetch if a component is subscribed to the query.
      invalidatesTags: (_result, _error, id) => [
        { type: "Purchase", id },
        { type: "Purchase", id: "PARTIAL-LIST" },
      ],
    }),
  }),
});

export const {
  useGetPurchasesQuery,
  useGetOnePurchaseQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
  usePrefetch,
} = purchasesApiSlice;
