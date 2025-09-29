import React, { createContext, useReducer, useEffect } from "react";
import { AUTH_ACTIONS, initialState, authReducer } from "./authConstants";
import { API_BASE_URL, API_ENDPOINTS } from "../utils/api";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const { access_token } = codeResponse;
      const response = await apiCall(API_ENDPOINTS.GOOGLE_AUTH, {
        method: "POST",
        body: JSON.stringify({ access_token }),
      });
      if (response.success === false) {
        return response;
      }
      const { token, user } = response;
      localStorage.setItem("token", token);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user, token } });
      return { success: true, user };
    },
  });

  // Helper function to make authenticated API calls
  const apiCall = async (url, options = {}) => {
    const token = state.token;

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };
    console.log(API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}${url}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    return await response.json();
  };
  const googleLogin = () => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    loginWithGoogle();
  };

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    const response = await apiCall(API_ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }).catch((error) => {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message,
      });

      return { success: false, error: error.message };
    });

    if (response.success === false) {
      return response;
    }

    const { token, user } = response;

    // Store token in localStorage
    localStorage.setItem("token", token);

    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { user, token },
    });

    return { success: true, user };
  };

  // Register function
  const register = async (email, password, firstName, lastName) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    const response = await apiCall(API_ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify({ email, password, firstName, lastName }),
    }).catch((error) => {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: error.message,
      });

      return { success: false, error: error.message };
    });

    if (response.success === false) {
      return response;
    }

    const { token, user } = response;

    // Store token in localStorage
    localStorage.setItem("token", token);

    dispatch({
      type: AUTH_ACTIONS.REGISTER_SUCCESS,
      payload: { user, token },
    });

    return { success: true, user };
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Verify token and get user data
  const verifyToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return;
    }

    //verify token
    const response = await apiCall(API_ENDPOINTS.VERIFY, {
      method: "GET",
    });

    if (response.success === false) {
      return response;
    }

    const { user } = response;

    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { user, token },
    });
  };

  // Update user profile
  const updateProfile = async (userData) => {
    const response = await apiCall("/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }).catch((error) => {
      return { success: false, error: error.message };
    });

    if (response.success === false) {
      return response;
    }

    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { user: response.user, token: state.token },
    });

    return { success: true, user: response.user };
  };

  // Effect to verify token on app load
  useEffect(() => {
    verifyToken();
  }, []);

  // Context value
  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    login,
    register,
    logout,
    clearError,
    updateProfile,
    apiCall,
    googleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export AuthContext for advanced usage
export default AuthContext;
