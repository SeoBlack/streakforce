
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Submission from "./components/submission"
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
            <Route path="submission" element={<Submission />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
