import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import Button from "../../components/UI/Button";
import { useAuth } from "../../context/useAuth";
import Loader from "../../components/Loader";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { forgotPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.message || "Failed to send reset email");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

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
          {isSubmitted ? "Check your email" : "Forgot Password?"}
        </h2>
        <p className="text-gray-600 text-center text-xl md:text-2xl md:mb-3 mb-8 leading-relaxed">
          {isSubmitted
            ? "We've sent a password reset link to your email"
            : "Enter your email address and we'll send you a link to reset your password"}
        </p>

        {/* Form or Success Message */}
        {isSubmitted ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-800 text-base">
                Please check your inbox and follow the instructions to reset
                your password.
              </p>
            </div>
            <Button
              onClick={handleBackToLogin}
              className="w-full bg-color-1 hover:bg-color-2 active:bg-color-3 text-white py-4 text-lg"
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-6 w-8 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-4 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-color-1 text-gray-900 placeholder-gray-500 text-base sm:text-lg"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-color-1 hover:bg-color-2 active:bg-color-3 text-white py-4 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            {/* Back to Login */}
            <div className="mt-4 text-center">
              <span className="text-gray-600 text-base">
                Remember your password?{" "}
              </span>
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-color-1 hover:text-color-2 font-medium text-base"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default ForgotPasswordPage;
