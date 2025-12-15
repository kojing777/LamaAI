import Sidebar from "./components/Sidebar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import { useState } from "react";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import Loading from "./pages/Loading";
import { useAppContext } from "./context/AppContext";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, loadingUser } = useAppContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/loading" || loadingUser) return <Loading />;
  return (
    <>
      <Toaster
        position="center-top"
        toastOptions={{
          // Default style for all toasts
          style: {
            background: "var(--bg-modal, #0a0f1c)",
            color: "var(--text-primary, #f8fafc)",
            borderRadius: "12px",
            padding: "12px 16px",
            fontFamily: "Outfit, sans-serif",
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
          // Success toast style
          success: {
            iconTheme: {
              primary: "#60a5fa",
              secondary: "#ffffff",
            },
            style: {
              background: "var(--bg-card, #1e293b)",
              color: "var(--text-primary, #f8fafc)",
              borderRadius: "12px",
              padding: "12px 16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              border: "1px solid rgba(96, 165, 250, 0.3)",
            },
          },
          // Error toast style
          error: {
            iconTheme: {
              primary: "#f87171",
              secondary: "#ffffff",
            },
            style: {
              background: "var(--bg-card, #1e293b)",
              color: "var(--text-primary, #f8fafc)",
              borderRadius: "12px",
              padding: "12px 16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              border: "1px solid rgba(248, 113, 113, 0.3)",
            },
          },
        }}
      />

      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden dark:invert z-50"
          onClick={() => setIsMenuOpen(true)}
        />
      )}
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <div className="bg-light-primary dark:bg-gradient-to-b dark:from-dark-primary dark:to-dark-modal h-screen flex items-center justify-center w-screen transition-colors duration-300">
                <Login />
              </div>
            )
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <div className="bg-light-primary dark:bg-dark-primary text-light-text-primary dark:text-dark-text-primary font-outfit transition-colors duration-300">
                <div className="flex h-screen w-screen">
                  <Sidebar
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                  />
                  <ChatBox />
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/credits"
          element={
            user ? (
              <div className="dark:bg-gradient-to-b from-[rgb(36,33,36)] to-[#000000] dark:text-white font-outfit">
                <div className="flex h-screen w-screen">
                  <Sidebar
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                  />
                  <Credits />
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/community"
          element={
            user ? (
              <div className="dark:bg-gradient-to-b from-[rgb(36,33,36)] to-[#000000] dark:text-white font-outfit">
                <div className="flex h-screen w-screen">
                  <Sidebar
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                  />
                  <Community />
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Catch-all route */}
        <Route
          path="*"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;
