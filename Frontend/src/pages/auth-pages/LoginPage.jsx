import React, { useState } from "react";
import logo from "../../assets/logo.svg";
import AuthForm from "../../components/LoginForm";
import { useAuth } from "../../context/useAuth";

const LoginPage = () => {
  const [mode, setMode] = useState("login");
  const { login, register } = useAuth();

  const handleSubmit = (email, password, confirmPassword) => {
    if (mode === "login") {
      if (!email || !password || !confirmPassword) {
        return;
      }
      login(email, password);
    } else {
      if (!email || !password || !confirmPassword) {
        return;
      }
      register(email, password, confirmPassword);
    }
  };

  const handleForgotPassword = () => console.log("Forgot Password");
  const handleGoogleLogin = () => console.log("Google Login");

  const toggleMode = () => setMode(mode === "login" ? "signup" : "login");

  return (
    <div className="min-h-screen flex flex-col md:shadow-2xl md:max-w-lg md:mx-auto px-4 sm:px-6">
      <div className="flex-1 flex flex-col justify-center py-12">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-color-1 rounded-2xl flex items-center justify-center shadow-lg">
            <img src={logo} alt="StreakForce Logo" className="w-12 h-12" />
          </div>
        </div>

        {/* Headings */}
        <h1 className="text-4xl font-bold text-center mb-1">StreakForce</h1>
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-4 mt-4 leading-snug">
          {mode === "login" ? "Welcome back!" : "Create your account"}
        </h2>
        <p className="text-gray-600 text-center text-xl md:text-2xl md:mb-3 mb-8 leading-relaxed">
          {mode === "login"
            ? "Sign in to continue your streak"
            : "Sign up to start your streak"}
        </p>

        {/* Auth Form */}
        <AuthForm
          mode={mode}
          onSubmit={handleSubmit}
          onForgotPassword={mode === "login" ? handleForgotPassword : undefined}
          onGoogleLogin={handleGoogleLogin}
          onSwitchMode={toggleMode}
        />
      </div>
    </div>
  );
};

export default LoginPage;
