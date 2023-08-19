import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/forms/AdminLogin";
import NotFoundPage from "./components/shared/NotFoundPage";
import AdminProfile from "./components/profile/AdminProfile";
import { Home } from "./components/home/Home";
import { Invoices } from "./components/invoice/Invoices";
import { CreateInvoice } from "./components/forms/CreateInvoice";
import { ShowInvoice } from "./components/invoice/ShowInvoice";
import UpdateAdmin from "./components/forms/UpdateAdmin";
import { Passports } from "./components/passport/Passports";
import { CreatePassport } from "./components/forms/CreatePassport";
import { CreateTicket } from "./components/forms/CreateTicket";
import { Tickets } from "./components/ticket/Tickets";
import { RequireAuth } from "./components/shared/RequireAuth";
import PersistLogin from "./components/shared/PersistLogin";
import Prefetch from "./components/shared/Prefetch";
import { PublicLayout } from "./components/shared/PublicLayout";
import { MainLayout } from "./components/shared/MainLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Purchases } from "./components/purchase/Purchases";
import { CreatePurchase } from "./components/forms/CreatePurchase";
import { PaymentVoucher } from "./components/purchase/PaymentVoucher";
import { CreateVoucher } from "./components/forms/CreateVoucher";
import { Payments } from "./components/payment/Payments";
import { CreatePayment } from "./components/forms/CreatePayment";
import { Bills } from "./components/bill/Bills";
import { CreateBill } from "./components/forms/CreateBill";
import { ShowBill } from "./components/bill/ShowBill";

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
              <Route element={<Prefetch />}>
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
                    <Route path="create" element={<CreateInvoice />} />
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
                    <Route path="create/voucher" element={<CreateVoucher />} />
                    <Route path=":id" element={<PaymentVoucher />} />
                  </Route>
                  {/* Payments Routes */}
                  <Route path="/payments">
                    <Route index element={<Payments />} />
                    <Route path="create" element={<CreatePayment />} />
                  </Route>
                </Route>
              </Route>
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
