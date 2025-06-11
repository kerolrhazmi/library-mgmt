import React, { useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
import AboutUs from "./components/AboutUs"
import DashboardAdmin from "./components/DashboardAdmin"
import SignupStudent from "./components/SignupStudent";
import AdminDashboard from './components/DashboardAdmin';
import AdminBookManager from './components/AdminBookManager';
import AdminApproval from './components/AdminApproval'
import ProfilePage from './components/ProfilePage'

// Auth Context Provider
import { AuthContextProvider } from "./context/AuthContext";

function App() {
  const hero2Ref = useRef(null);
  const loginRef = useRef(null);

  const scrollToHero2 = () => {
    hero2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AuthContextProvider>
      <Router>
        <div className="cursor-default">
          <Navbar onGalleryClick={scrollToHero2} onLoginClick={scrollToLogin} />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Hero2 refProp={hero2Ref} />
                  <Login refProp={loginRef} />
                  <AboutUs />
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
            <Route path="/admin/approval" element={<AdminApproval/>} />
            <Route path="/profile-page" element={<ProfilePage/>} />
            
          </Routes>
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
