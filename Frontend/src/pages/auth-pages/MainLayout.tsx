// layouts/MainLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
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
