import Sidebar from "./components/Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
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
            background: "linear-gradient(to right, #242124, #000000)",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px 16px",
            fontFamily: "Outfit, sans-serif",
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
          },
          // Success toast style (sidebar gradient)
          success: {
            iconTheme: {
              primary: "#8b46ff", // matches gradient start
              secondary: "#ffffff",
            },
            style: {
              background: "linear-gradient(to right, #8b46ff, #4d7fff)",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            },
          },
          // Error toast style (red gradient)
          error: {
            iconTheme: {
              primary: "#ef4444", // red
              secondary: "#ffffff",
            },
            style: {
              background: "linear-gradient(to right, #ef4444, #dc2626)",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            },
          },
        }}
      />

      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
        />
      )}
      {user ? (
        <div className="dark:bg-gradient-to-b from-[rgb(36,33,36)] to-[#000000] dark:text-white font-outfit">
          <div className="flex h-screen w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-[#242124] to-[#000000] h-screen flex items-center justify-center w-screen">
          <Login />
        </div>
      )}
    </>
  );
};

export default App;
