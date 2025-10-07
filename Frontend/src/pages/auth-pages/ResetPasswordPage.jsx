import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../assets/logo.svg";
import Button from "../../components/UI/Button";
import { API_BASE_URL, API_ENDPOINTS } from "../../utils/api";
import Loader from "../../components/Loader";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.RESET_PASSWORD}/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col md:shadow-2xl md:max-w-lg md:mx-auto px-4 sm:px-6">
        <div className="flex-1 flex flex-col justify-center py-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-color-1 rounded-2xl flex items-center justify-center shadow-lg">
              <img src={logo} alt="StreakForce Logo" className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-1">StreakForce</h1>
          <h2 className="text-4xl md:text-3xl font-bold text-center mb-4 mt-4 leading-snug">
            Invalid Reset Link
          </h2>
          <p className="text-gray-600 text-center text-xl md:text-2xl md:mb-3 mb-8 leading-relaxed">
            This password reset link is invalid or has expired.
          </p>
          <Button
            onClick={handleBackToLogin}
            className="w-full bg-color-1 hover:bg-color-2 active:bg-color-3 text-white py-4 text-lg"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

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
          {isSubmitted ? "Password Reset!" : "Reset Password"}
        </h2>
        <p className="text-gray-600 text-center text-xl md:text-2xl md:mb-3 mb-8 leading-relaxed">
          {isSubmitted
            ? "Your password has been successfully reset"
            : "Enter your new password below"}
        </p>

        {/* Form or Success Message */}
        {isSubmitted ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-800 text-base">
                You can now log in with your new password.
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

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-6 w-8 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                className="w-full pl-12 pr-12 py-4 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-color-1 text-gray-900 placeholder-gray-500 text-base sm:text-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-6 w-8 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-6 w-8 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-6 w-8 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full pl-12 pr-12 py-4 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-color-1 text-gray-900 placeholder-gray-500 text-base sm:text-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-6 w-8 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-6 w-8 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-color-1 hover:bg-color-2 active:bg-color-3 text-white py-4 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPasswordPage;
