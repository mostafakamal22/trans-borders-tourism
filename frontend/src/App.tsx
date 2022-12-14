import { FC } from "react";
import UseDetectAdmin from "./state/features/hooks/DetectAdmin";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLogin from "./components/forms/AdminLogin";
import NotFoundPage from "./components/shared/NotFoundPage";
import AdminProfile from "./components/profile/AdminProfile";
import { Home } from "./components/home/Home";
import { InvoiceListControl } from "./components/invoice/Invoices";
import { CreateInvoice } from "./components/forms/CreateInvoice";
import { ShowInvoice } from "./components/invoice/ShowInvoice";
import { Footer } from "./components/shared/Footer";
import UpdateAdmin from "./components/forms/UpdateAdmin";
import { Passports } from "./components/passport/Passports";
import { CreatePassport } from "./components/forms/CreatePassport";
import { Visas } from "./components/visa/Visas";
import { CreateVisa } from "./components/forms/CreateVisa";
import { Payments } from "./components/payment/Payments";
import { CreatePayment } from "./components/forms/CreatePayment";
import { CreateTicket } from "./components/forms/CreateTicket";
import { Tickets } from "./components/ticket/Tickets";
import { Purchases } from "./components/purchase/Purchases";
import { CreatePurchase } from "./components/forms/CreatePurchase";
import SideBar from "./components/shared/SideBar";
import { PaymentVoucher } from "./components/purchase/PaymentVoucher";
import { CreateVoucher } from "./components/forms/CreateVoucher";
import { Banks } from "./components/bank/Banks";
import { CreateBank } from "./components/forms/CreateBank";

//App Paths
const paths = [
  "/profile/",
  "/profile/update",
  "/profile/update",
  "/invoices/create",
  "/invoices/",
  "/invoices/:id",
  "/passports/create",
  "/passports/",
  "/visas/",
  "/visas/create",
  "/payments",
  "/payments/create",
  "/tickets",
  "/tickets/create",
  "/purchases",
  "/purchases/create",
  "/purchases/:id",
  "/banks",
  "/banks/create",
  "/voucher/create",
];

const App: FC = () => {
  //Detect admin
  const admin = UseDetectAdmin();

  return (
    <Router>
      {/* Guest Routes */}
      {!admin && (
        <div className="min-h-screen flex">
          <Routes>
            <Route index element={<AdminLogin />} />
            <Route path="/admins/login" element={<AdminLogin />} />
            <Route path="/login" element={<AdminLogin />} />
            {paths.map((stringPath) => (
              <Route
                key={"Home"}
                path={stringPath}
                element={<Navigate to={"/"} />}
              />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      )}

      {/* Admin Routes */}
      {admin && (
        <>
          <SideBar />

          <Routes>
            <Route index element={<Home />} />
            <Route path="/register" element={<Navigate to={"/"} />} />
            <Route path="/login" element={<Navigate to={"/"} />} />
            <Route path="/admins/login" element={<Navigate to={"/"} />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="/profile/update" element={<UpdateAdmin />} />
            <Route path="/invoices" element={<InvoiceListControl />} />
            <Route path="/invoices/create" element={<CreateInvoice />} />
            <Route path="/invoices/:id" element={<ShowInvoice />} />
            <Route path="/passports" element={<Passports />} />
            <Route path="/passports/create" element={<CreatePassport />} />
            <Route path="/visas" element={<Visas />} />
            <Route path="/visas/create" element={<CreateVisa />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/payments/create" element={<CreatePayment />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/tickets/create" element={<CreateTicket />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/purchases/create" element={<CreatePurchase />} />
            <Route path="/purchases/:id" element={<PaymentVoucher />} />
            <Route path="/banks" element={<Banks />} />
            <Route path="/banks/create" element={<CreateBank />} />
            <Route path="/voucher/create" element={<CreateVoucher />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </>
      )}
    </Router>
  );
};

export default App;
