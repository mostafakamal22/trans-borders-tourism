import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/forms/AdminLogin";
import NotFoundPage from "./components/shared/NotFoundPage";
import AdminProfile from "./components/profile/AdminProfile";
import { Home } from "./components/home/Home";
import { Invoices } from "./components/invoice/Invoices";
import { ShowInvoice } from "./components/invoice/ShowInvoice";
import UpdateAdmin from "./components/forms/UpdateAdmin";
import { Passports } from "./components/passport/Passports";
import { CreatePassport } from "./components/forms/CreatePassport";
import { CreateTicket } from "./components/forms/CreateTicket";
import { Tickets } from "./components/ticket/Tickets";
import { RequireAuth } from "./components/shared/RequireAuth";
import PersistLogin from "./components/shared/PersistLogin";
// import Prefetch from "./components/shared/Prefetch";
import { PublicLayout } from "./components/shared/PublicLayout";
import { MainLayout } from "./components/shared/MainLayout";
import { ToastContainer } from "react-toastify";
import { Purchases } from "./components/purchase/Purchases";
import { CreatePurchase } from "./components/forms/CreatePurchase";
// import { PaymentVoucher } from "./components/purchase/PaymentVoucher";
// import { CreateVoucher } from "./components/forms/CreateVoucher";
import { Payments } from "./components/payment/Payments";
import { CreatePayment } from "./components/forms/CreatePayment";
import { Bills } from "./components/bill/Bills";
import { CreateBill } from "./components/forms/CreateBill";
import { ShowBill } from "./components/bill/ShowBill";
import { ReceiptVoucher } from "./components/receiptVoucher/ReceiptVoucher";
import { CreateReceiptVoucher } from "./components/forms/CreateReceiptVoucher";
import { ReceiptVouchers } from "./components/receiptVoucher/ReceiptVouchers";
import { PaymentVouchers } from "./components/paymentVoucher/PaymentVouchers";
import { CreatePaymentVoucher } from "./components/forms/CreatePaymentVoucher";
import "react-toastify/dist/ReactToastify.min.css";
import { PaymentVoucher } from "./components/paymentVoucher/PaymentVoucher";

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

// import { Routes, Route, Navigate } from "react-router-dom";
// import { Suspense, lazy } from "react";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.min.css";

// // Lazy loaded components
// const AdminLogin = lazy(() => import("./components/forms/AdminLogin"));
// const NotFoundPage = lazy(() => import("./components/shared/NotFoundPage"));
// const AdminProfile = lazy(() => import("./components/profile/AdminProfile"));
// const Home = lazy(() => import("./components/home/Home"));
// const Invoices = lazy(() => import("./components/invoice/Invoices"));
// const ShowInvoice = lazy(() => import("./components/invoice/ShowInvoice"));
// const UpdateAdmin = lazy(() => import("./components/forms/UpdateAdmin"));
// const Passports = lazy(() => import("./components/passport/Passports"));
// const CreatePassport = lazy(() => import("./components/forms/CreatePassport"));
// const CreateTicket = lazy(() => import("./components/forms/CreateTicket"));
// const Tickets = lazy(() => import("./components/ticket/Tickets"));
// const Purchases = lazy(() => import("./components/purchase/Purchases"));
// const CreatePurchase = lazy(() => import("./components/forms/CreatePurchase"));
// const Payments = lazy(() => import("./components/payment/Payments"));
// const CreatePayment = lazy(() => import("./components/forms/CreatePayment"));
// const Bills = lazy(() => import("./components/bill/Bills"));
// const CreateBill = lazy(() => import("./components/forms/CreateBill"));
// const ShowBill = lazy(() => import("./components/bill/ShowBill"));
// const ReceiptVoucher = lazy(() => import("./components/receiptVoucher/ReceiptVoucher"));
// const CreateReceiptVoucher = lazy(() => import("./components/forms/CreateReceiptVoucher"));
// const ReceiptVouchers = lazy(() => import("./components/receiptVoucher/ReceiptVouchers"));
// const PaymentVouchers = lazy(() => import("./components/paymentVoucher/PaymentVouchers"));
// const CreatePaymentVoucher = lazy(() => import("./components/forms/CreatePaymentVoucher"));
// const PaymentVoucher = lazy(() => import("./components/paymentVoucher/PaymentVoucher"));
// const PublicLayout = lazy(() => import("./components/shared/PublicLayout"));
// const MainLayout = lazy(() => import("./components/shared/MainLayout"));
// const PersistLogin = lazy(() => import("./components/shared/PersistLogin"));
// const RequireAuth = lazy(() => import("./components/shared/RequireAuth"));

// const App = () => {
//   return (
//     <>
//       <Suspense fallback={<div>Loading...</div>}>
//         <Routes>
//           <Route path="/">
//             {/* Public Routes */}
//             <Route element={<PublicLayout />}>
//               <Route index element={<Navigate to={"/login"} />} />
//               <Route path="login" element={<AdminLogin />} />
//             </Route>

//             {/* Protected Routes */}
//             <Route element={<PersistLogin />}>
//               <Route element={<RequireAuth />}>
//                 <Route element={<MainLayout />}>
//                   <Route path="/home" element={<Home />} />
//                   {/* Admin Setting Routes */}
//                   <Route path="/profile">
//                     <Route index element={<AdminProfile />} />
//                     <Route path="update" element={<UpdateAdmin />} />
//                   </Route>
//                   {/* Passports Routes */}
//                   <Route path="/passports">
//                     <Route index element={<Passports />} />
//                     <Route path="create" element={<CreatePassport />} />
//                   </Route>
//                   {/* Invoices Routes */}
//                   <Route path="/invoices">
//                     <Route index element={<Invoices />} />
//                     {/* <Route path="create" element={<CreateInvoice />} /> */}
//                     <Route path=":id" element={<ShowInvoice />} />
//                   </Route>
//                   {/* Bills Routes */}
//                   <Route path="/bills">
//                     <Route index element={<Bills />} />
//                     <Route path="create" element={<CreateBill />} />
//                     <Route path=":id" element={<ShowBill />} />
//                   </Route>
//                   {/* Tickets Routes */}
//                   <Route path="/tickets">
//                     <Route index element={<Tickets />} />
//                     <Route path="create" element={<CreateTicket />} />
//                   </Route>
//                   {/* Purchases Routes */}
//                   <Route path="/purchases">
//                     <Route index element={<Purchases />} />
//                     <Route path="create" element={<CreatePurchase />} />
//                   </Route>
//                   {/* Payments Routes */}
//                   <Route path="/payments">
//                     <Route index element={<Payments />} />
//                     <Route path="create" element={<CreatePayment />} />
//                   </Route>
//                   {/* Receipt Vouchers Routes */}
//                   <Route path="/receiptVouchers">
//                     <Route index element={<ReceiptVouchers />} />
//                     <Route path="create" element={<CreateReceiptVoucher />} />
//                     <Route path=":id" element={<ReceiptVoucher />} />
//                   </Route>
//                   {/* Payment Vouchers Routes */}
//                   <Route path="/paymentVouchers">
//                     <Route index element={<PaymentVouchers />} />
//                     <Route path="create" element={<CreatePaymentVoucher />} />
//                     <Route path=":id" element={<PaymentVoucher />} />
//                   </Route>
//                 </Route>
//               </Route>
//             </Route>

//             {/* Not Found Route */}
//             <Route path="*" element={<NotFoundPage />} />
//           </Route>
//         </Routes>
//       </Suspense>

//       <ToastContainer role="alert" rtl={true} autoClose={4000} theme="colored" />
//     </>
//   );
// };

// export default App;
