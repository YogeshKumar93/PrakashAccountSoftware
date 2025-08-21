import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import SideNavAndHeader from "../components/Layout/SideNavAndHeader";
import AuthContext from "../contexts/AuthContext";
import { useContext } from "react";
import AdminTransactions from "../components/UI/AdminTransactions";

// PrivateRoute wrapper
const PrivateRoute = ({ children }) => {
  const authCtx = useContext(AuthContext);
  const user=authCtx?.user


  return user ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  const { user } = useContext(AuthContext);
  console.log("user data", user);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes with layout */}
        <Route
          element={
            <PrivateRoute>
              <SideNavAndHeader
                userRole={user?.role}
                userName={user?.name || "Guest"}
                userAvatar="/path/to/avatar.jpg"
              />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<AdminTransactions />} />
          <Route path="/account-ledger" element={<Dashboard />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
