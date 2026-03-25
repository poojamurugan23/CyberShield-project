import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import OTPPage from "./pages/OTPPage";
import SignupPage from "./pages/SignupPage";
import UserDashboard from "./pages/UserDashboard";
import AttackReportPage from "./pages/AttackReport";
import AIProcessingPage from "./pages/AIProcessingPage";
import InvestigatorDashboard from "./pages/InvestigatorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./styles/globals.css";
import "./styles/animations.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const noLayoutRoutes = ["/", "/login", "/signup", "/otp", "/ai"];
  if (noLayoutRoutes.includes(location.pathname)) return children;

  return (
    <>
      <Navbar />
      <div className="layout-container">
        <Sidebar />
        <div className="main-content">
          {children}
        </div>
      </div>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/report" element={<AttackReportPage />} />
          <Route path="/ai" element={<AIProcessingPage />} />
          <Route path="/investigator" element={<InvestigatorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}