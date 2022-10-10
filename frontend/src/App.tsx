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

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}

      {/* Admin Routes */}
      {admin && (
        <Routes>
          <Route index element={<Home />} />
          <Route path="/register" element={<Navigate to={"/"} />} />
          <Route path="/login" element={<Navigate to={"/"} />} />
          <Route path="/admins/login" element={<Navigate to={"/"} />} />
          <Route path="/profile" element={<AdminProfile />} />
          {/* <Route
            
            path="/profile/update"
            element={<UpdateAdminProfile />}
          /> */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
