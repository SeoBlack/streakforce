import { BrowserRouter, Route, Routes } from "react-router-dom";

import AuthLayout from "./pages/auth-pages/Authlayout";
import MainLayout from "./pages/auth-pages/MainLayout";
import WelcomePage from "./pages/auth-pages/WellcomePage";
import LoginPage from "./pages/auth-pages/LoginPage";
import HomePage from "./pages/home/HomePage";
import NotFoundPage from "./pages/NotFound";
import CreateChallenge from "./pages/challenge/CreateChallenge";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route index element={<WelcomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="create-challenge" element={<CreateChallenge />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
