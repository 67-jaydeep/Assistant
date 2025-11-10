// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Not logged in → redirect to login
    return <Navigate to="/login" />;
  }

  // Logged in → show children (MainLayout + page)
  return children;
};

export default PrivateRoute;
