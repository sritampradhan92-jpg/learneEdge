import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./state/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Courses from "./pages/Courses.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import OrderSummary from "./pages/OrderSummary.jsx";
import Payment from "./pages/Payment.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";

export default function App() {
  const { initializeAuth } = useAuth();

  // Initialize auth on app load (load user from localStorage if logged in)
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-summary"
          element={
            <ProtectedRoute>
              <OrderSummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
