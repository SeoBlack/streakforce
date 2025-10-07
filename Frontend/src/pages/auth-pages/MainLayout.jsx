// layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "../../components/Header";
const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Content takes available space */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer always at bottom */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
