import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Submission from "./components/submission";
import AuthLayout from "./pages/auth-pages/Authlayout";
import MainLayout from "./pages/auth-pages/MainLayout";
import WelcomePage from "./pages/auth-pages/WellcomePage";
import LoginPage from "./pages/auth-pages/LoginPage";
import ForgotPasswordPage from "./pages/auth-pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth-pages/ResetPasswordPage";
import HomePage from "./pages/home/HomePage";
import NotFoundPage from "./pages/NotFound";
import CreateChallenge from "./pages/challenge/CreateChallenge";
import ProfilePage from "./pages/profile/Profile";
import TeamPage from "./pages/Habits/HabitPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import HabitProvider from "./context/HabitContext";
import { ToastContainer } from "react-toastify";
import HabitsPage from "./pages/Habits/HabitPage";
import AllHabitsPage from "./pages/Habits/AllHabitsPage";

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.error(
      "VITE_GOOGLE_CLIENT_ID is not set; Google Login will not work."
    );
  }
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <HabitProvider>
          <ToastContainer />
          <div className="App">
            <BrowserRouter>
              <Routes>
                <Route element={<AuthLayout />}>
                  <Route index element={<WelcomePage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route
                    path="forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                  <Route
                    path="reset-password"
                    element={<ResetPasswordPage />}
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
                <Route element={<MainLayout />}>
                  <Route path="home" element={<HomePage />} />
                  <Route path="submission" element={<Submission />} />
                  <Route
                    path="create-challenge"
                    element={<CreateChallenge />}
                  />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="habits" element={<AllHabitsPage />} />
                  <Route path="habits/:id" element={<HabitsPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </div>
        </HabitProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
