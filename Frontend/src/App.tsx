import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AuthLayout from "./pages/auth-pages/Authlayout";
import WelcomePage from "./pages/auth-pages/WellcomePage";
import LoginPage from "./pages/auth-pages/LoginPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route index element={<WelcomePage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
