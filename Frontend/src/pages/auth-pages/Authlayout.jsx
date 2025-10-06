import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useEffect } from "react";
const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);
  return (
    <div className="min-h-screen flex flex-col">
      <Outlet />
    </div>
  );
};
export default AuthLayout;
