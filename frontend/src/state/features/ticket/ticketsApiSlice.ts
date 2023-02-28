import { PaginateOptions } from "mongoose";
import type { ITicketDocument } from "../../../../../backend/models/ticketModel";
import { apiSlice } from "../../app/apiSlice";
import { ListResponse } from "../passport/passportsApiSlice";
import { PaymentMethodsQueries } from "../../../components/ticket/types";

export interface TicketSearchQuery {
  option?: PaginateOptions;
  query?: {
    year?: number;
    day?: number;
    month?: number;
    customerName?: string;
    type?: string;
    employee?: string;
    supplier?: string;
    paymentMethod?: PaymentMethodsQueries[];
  };
}

export const ticketsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<ListResponse<ITicketDocument>, TicketSearchQuery>(
      {
        query: (searchQueries) => ({
          method: "POST",
          url: "/api/tickets/query",
          body: { ...searchQueries },
        }),
        providesTags: (result, _error, _page) =>
          result
            ? [
                // Provides a tag for each Doc in the current page,
                // as well as the 'PARTIAL-LIST' tag.
                ...result.docs.map(({ id }) => ({
                  type: "Ticket" as const,
                  id,
                })),
                { type: "Ticket", id: "PARTIAL-LIST" },
              ]
            : [{ type: "Ticket", id: "PARTIAL-LIST" }],
      }
    ),
    createTicket: builder.mutation<ITicketDocument, Partial<ITicketDocument>>({
      query: (ticketData) => ({
        url: "/api/tickets",
        method: "POST",
        body: { ...ticketData },
      }),
      invalidatesTags: [{ type: "Ticket", id: "PARTIAL-LIST" }],
    }),
    updateTicket: builder.mutation<ITicketDocument, Partial<ITicketDocument>>({
      query: (ticketData) => ({
        url: `/api/tickets/${ticketData.id}`,
        method: "PUT",
        body: { ...ticketData },
      }),
      invalidatesTags: (_result, _error, ITicketDocument) => [
        { type: "Ticket", id: ITicketDocument.id },
        { type: "Ticket", id: "PARTIAL-LIST" },
      ],
    }),
    deleteTicket: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/api/tickets/${id}`,
        method: "DELETE",
      }),
      // Invalidates the tag for this Doc `id`, as well as the `PARTIAL-LIST` tag,
      // causing the `getTickets` query to re-fetch if a component is subscribed to the query.
      invalidatesTags: (_result, _error, id) => [
        { type: "Ticket", id },
        { type: "Ticket", id: "PARTIAL-LIST" },
      ],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  usePrefetch,
} = ticketsApiSlice;
