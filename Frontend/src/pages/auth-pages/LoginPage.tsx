import React from "react";
import logo from "../../assets/logo.svg";
import LoginForm from "../../components/LoginForm";

const LoginPage: React.FC = () => {
  const handleLogin = (email: string, password: string) => {
    console.log("Login:", email, password);
  };
  const handleForgotPassword = () => console.log("Forgot Password");
  const handleGoogleLogin = () => console.log("Google Login");
  const handleAppleLogin = () => console.log("Apple Login");
  const handleSignUp = () => console.log("Sign Up");

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
          Welcome back!
        </h2>
        <p className="text-gray-600 text-center text-xl md:text-2xl md:mb-3 mb-8 leading-relaxed">
          Sign in to continue your streak
        </p>

        {/* Login Form */}
        <LoginForm
          onLogin={handleLogin}
          onForgotPassword={handleForgotPassword}
          onGoogleLogin={handleGoogleLogin}
          onAppleLogin={handleAppleLogin}
          onSignUp={handleSignUp}
        />
      </div>
    </div>
  );
};

export default LoginPage;
