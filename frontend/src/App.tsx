import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

// Normal Components
import AdminLogin from "./components/forms/AdminLogin";
import PersistLogin from "./components/shared/PersistLogin";
import NotFoundPage from "./components/shared/NotFoundPage";
import { RequireAuth } from "./components/shared/RequireAuth";
import { PublicLayout } from "./components/shared/PublicLayout";
import { MainLayout } from "./components/shared/MainLayout";

// Lazy loaded components
const Home = lazy(() => import("./components/home/Home"));
const AdminProfile = lazy(() => import("./components/profile/AdminProfile"));
const Invoices = lazy(() => import("./components/invoice/Invoices"));
const ShowInvoice = lazy(() => import("./components/invoice/ShowInvoice"));
const UpdateAdmin = lazy(() => import("./components/forms/UpdateAdmin"));
const Passports = lazy(() => import("./components/passport/Passports"));
const CreatePassport = lazy(() => import("./components/forms/CreatePassport"));
const CreateTicket = lazy(() => import("./components/forms/CreateTicket"));
const Tickets = lazy(() => import("./components/ticket/Tickets"));
const Purchases = lazy(() => import("./components/purchase/Purchases"));
const CreatePurchase = lazy(() => import("./components/forms/CreatePurchase"));
const Payments = lazy(() => import("./components/payment/Payments"));
const CreatePayment = lazy(() => import("./components/forms/CreatePayment"));
const Bills = lazy(() => import("./components/bill/Bills"));
const CreateBill = lazy(() => import("./components/forms/CreateBill"));
const ShowBill = lazy(() => import("./components/bill/ShowBill"));
const ReceiptVoucher = lazy(
  () => import("./components/receiptVoucher/ReceiptVoucher")
);
const CreateReceiptVoucher = lazy(
  () => import("./components/forms/CreateReceiptVoucher")
);
const ReceiptVouchers = lazy(
  () => import("./components/receiptVoucher/ReceiptVouchers")
);
const PaymentVouchers = lazy(
  () => import("./components/paymentVoucher/PaymentVouchers")
);
const CreatePaymentVoucher = lazy(
  () => import("./components/forms/CreatePaymentVoucher")
);
const PaymentVoucher = lazy(
  () => import("./components/paymentVoucher/PaymentVoucher")
);

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/">
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<Navigate to={"/login"} />} />
            <Route path="login" element={<AdminLogin />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              {/* <Route element={<Prefetch />}> */}
              <Route element={<MainLayout />}>
                <Route path="/home" element={<Home />} />
                {/* Admin Setting Routes */}
                <Route path="/profile">
                  <Route index element={<AdminProfile />} />
                  <Route path="update" element={<UpdateAdmin />} />
                </Route>
                {/* Passports Routes */}
                <Route path="/passports">
                  <Route index element={<Passports />} />
                  <Route path="create" element={<CreatePassport />} />
                </Route>
                {/* Invoices Routes */}
                <Route path="/invoices">
                  <Route index element={<Invoices />} />
                  {/* <Route path="create" element={<CreateInvoice />} /> */}
                  <Route path=":id" element={<ShowInvoice />} />
                </Route>
                {/* Bills Routes */}
                <Route path="/bills">
                  <Route index element={<Bills />} />
                  <Route path="create" element={<CreateBill />} />
                  <Route path=":id" element={<ShowBill />} />
                </Route>
                {/* Tickets Routes */}
                <Route path="/tickets">
                  <Route index element={<Tickets />} />
                  <Route path="create" element={<CreateTicket />} />
                </Route>
                {/* Purchases Routes */}
                <Route path="/purchases">
                  <Route index element={<Purchases />} />
                  <Route path="create" element={<CreatePurchase />} />
                  {/* <Route path="create/voucher" element={<CreateVoucher />} /> */}
                  {/* <Route path=":id" element={<PaymentVoucher />} /> */}
                </Route>
                {/* Payments Routes */}
                <Route path="/payments">
                  <Route index element={<Payments />} />
                  <Route path="create" element={<CreatePayment />} />
                </Route>
                {/* Receipt Vouchers Routes */}
                <Route path="/receiptVouchers">
                  <Route index element={<ReceiptVouchers />} />
                  <Route path="create" element={<CreateReceiptVoucher />} />
                  <Route path=":id" element={<ReceiptVoucher />} />
                </Route>
                {/* Payment Vouchers Routes */}
                <Route path="/paymentVouchers">
                  <Route index element={<PaymentVouchers />} />
                  <Route path="create" element={<CreatePaymentVoucher />} />
                  <Route path=":id" element={<PaymentVoucher />} />
                </Route>
              </Route>
              {/* </Route> */}
            </Route>
          </Route>

          {/* Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      <ToastContainer
        role="alert"
        rtl={true}
        autoClose={4000}
        theme="colored"
      />
    </>
  );
};

export default App;
