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
import { Navbar } from "./components/shared/Navbar";
import UpdateAdmin from "./components/forms/UpdateAdmin";

//User And Admin Paths
const paths = [
  "/profile/",
  "/profile/update",
  "/profile/update",
  "/invoices/create",
  "/invoices/",
  "/invoices/:id",
];

const App: FC = () => {
  //Detect admin
  const admin = UseDetectAdmin();

  return (
    <Router>
      {/* Guest Routes */}
      {!admin && (
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
      )}

      {/* Admin Routes */}
      {admin && (
        <>
          <Navbar />
          <Routes>
            <Route index element={<Home />} />
            <Route path="/register" element={<Navigate to={"/"} />} />
            <Route path="/login" element={<Navigate to={"/"} />} />
            <Route path="/admins/login" element={<Navigate to={"/"} />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="/invoices" element={<InvoiceListControl />} />
            <Route path="/invoices/create" element={<CreateInvoice />} />
            <Route path="/invoices/:id" element={<ShowInvoice />} />
            <Route path="/profile/update" element={<UpdateAdmin />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </>
      )}
    </Router>
  );
};

export default App;
