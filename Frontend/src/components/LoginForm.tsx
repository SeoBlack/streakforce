import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "./Button";
import SocialLogin from "./SocialLogin";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  mode: "login" | "signup";
  onSubmit: (email: string, password: string, confirmPassword?: string) => void;
  onForgotPassword?: () => void;
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  onSwitchMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  onForgotPassword,
  onGoogleLogin,
  onAppleLogin,
  onSwitchMode,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      onSubmit(email, password, confirmPassword);
    } else {
      onSubmit(email, password);
    }
    navigate("/home");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      {/* Password Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-6 w-8 text-gray-400" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
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

      {/* Confirm Password (Signup Only) */}
      {mode === "signup" && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-6 w-8 text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
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
      )}

      {/* Forgot Password (Login Only) */}
      {mode === "login" && onForgotPassword && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-color-1 hover:text-color-2 text-sm sm:text-base font-medium"
          >
            Forgot Password?
          </button>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-color-1 hover:bg-color-2 active:bg-color-3 text-white py-4 text-lg"
      >
        {mode === "login" ? "Get Started" : "Sign Up"}
      </Button>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 text-gray-500">or continue with</span>
        </div>
      </div>

      {/* Social Login */}
      <SocialLogin onGoogleLogin={onGoogleLogin} onAppleLogin={onAppleLogin} />

      {/* Switch Mode */}
      <div className="mt-4 text-center">
        <span className="text-gray-600 text-base">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
        </span>
        <button
          type="button"
          onClick={onSwitchMode}
          className="text-color-1 hover:text-color-2 font-medium text-base"
        >
          {mode === "login" ? "Sign Up" : "Login"}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
