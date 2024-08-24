import { usePrefetch as usePassportsPrefetch } from "../../state/features/passport/passportsApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { usePrefetch as useTicketsPrefetch } from "../../state/features/ticket/ticketsApiSlice";
// import { usePrefetch as useInvoicesPrefetch } from "../../state/features/invoice/invoiceApiSlice";
// import { usePrefetch as usePurchasesPrefetch } from "../../state/features/purchase/purchaseApiSlice";
import { usePrefetch as useBillsPrefetch } from "../../state/features/bill/billApiSlice";

const Prefetch = () => {
  const prefetchPassports = usePassportsPrefetch("getPassports", {
    force: true,
  });
  // const prefetchInvoices = useInvoicesPrefetch("getInvoices", { force: true });
  const prefetchTickets = useTicketsPrefetch("getTickets", { force: true });
  // const prefetchPurchases = usePurchasesPrefetch("getPurchases", {
  //   force: true,
  // });

  const prefetchBills = useBillsPrefetch("getBills", {
    force: true,
  });

  useEffect(() => {
    prefetchPassports({});
    // prefetchInvoices({});
    prefetchTickets({});
    // prefetchPurchases({});
    prefetchBills({});
  }, []);

  return <Outlet />;
};
export default Prefetch;
