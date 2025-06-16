import React, { useRef } from "react";
import { HashRouter as Router, Route, Routes, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Hero2 from "./components/Hero2";
import Login from "./components/Login";
import LoginAdmin from "./components/LoginAdmin";
import LoginStudent from "./components/LoginStudent";
import SignupAdmin from "./components/SignupAdmin";
import SearchResult from "./components/SearchResult";
import BookDetail from "./components/BookDetail";
import AboutUs from "./components/AboutUs";
import DashboardAdmin from "./components/DashboardAdmin";
import SignupStudent from "./components/SignupStudent";
import AdminDashboard from "./components/DashboardAdmin";
import AdminBookManager from "./components/AdminBookManager";
import AdminApproval from "./components/AdminApproval";
import ProfilePage from "./components/ProfilePage";
import OverdueBooks from "./components/OverdueBooks";
import ScrollToTop from "./components/ScrollToTop";
import ProfilePublic from "./components/ProfilePublic";
import AdminUserManagement from "./components/AdminUserManagement";
import MostReviewedBook from "./components/MostReviewedBook";

// Auth Context Provider
import { AuthContextProvider } from "./context/AuthContext";

function ScrollablePages() {
  const hero2Ref = useRef(null);
  const loginRef = useRef(null);
  const location = useLocation();

  const scrollToHero2 = () => {
    if (location.pathname === "/") {
      hero2Ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToLogin = () => {
    if (location.pathname === "/") {
      loginRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar onGalleryClick={scrollToHero2} onLoginClick={scrollToLogin} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <MostReviewedBook />
              <Hero2 refProp={hero2Ref} />
              <Login refProp={loginRef} />
            </>
          }
        />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/login-student" element={<LoginStudent />} />
        <Route path="/signup-admin" element={<SignupAdmin />} />
        <Route path="/signup-student" element={<SignupStudent />} />
        <Route path="/search-results" element={<SearchResult />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/books" element={<AdminBookManager />} />
        <Route path="/admin/approval" element={<AdminApproval />} />
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/admin/overdue" element={<OverdueBooks />} />
        <Route path="/profile/:id" element={<ProfilePublic />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
      </Routes>

      <AboutUs />
    </>
  );
}

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <ScrollToTop />
        <div className="cursor-default">
          <ScrollablePages />
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
