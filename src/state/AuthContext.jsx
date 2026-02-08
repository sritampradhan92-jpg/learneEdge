import React, { createContext, useContext, useMemo, useState } from "react";
import { signupAPI, loginAPI } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Signup with backend
  const signup = async (email, password, fullName, mobile) => {
    setLoading(true);
    setError(null);
    try {
      const response = await signupAPI(email, password, fullName, mobile);
      console.log("Signup successful:", response);
      return response;
    } catch (err) {
      const errorMsg = err.message || "Signup failed";
      setError(errorMsg);
      console.error("Signup error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login with backend
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginAPI(email, password);
      console.log("Login successful:", response);

      // Save tokens to localStorage
      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("idToken", response.idToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("userId", email);
      }

      // Set user data
      const userData = {
        userId: email,
        fullName: response.user.fullName,
        email: response.user.email,
        mobile: response.user.mobile,
        avatar: response.user.avatar || null,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Save avatar URL separately for Dashboard
      if (response.user.avatar) {
        localStorage.setItem("userAvatarUrl", response.user.avatar);
      }
      
      return response;
    } catch (err) {
      const errorMsg = "Invalid email or password";
      setError(errorMsg);
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userAvatarUrl");
    setError(null);
  };

  // Initialize from localStorage on mount
  const initializeAuth = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Error parsing saved user:", err);
        logout();
      }
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
      initializeAuth,
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
