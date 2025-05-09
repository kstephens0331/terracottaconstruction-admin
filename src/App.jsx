import React, { useState } from "react";
import { auth, provider, signInWithPopup, signOut } from "./firebase";
import { useTranslation } from "react-i18next";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Quotes from "./pages/Quotes";
import WorkOrders from "./pages/WorkOrders";
import Customers from "./pages/Customers";
import NotFound from "./pages/NotFound"; // Optional
import Sidebar from "./components/Sidebar"; // Assuming you’ll add this
import logo from "./assets/logo.png";

function App() {
  const [user, setUser] = useState(null);
  const { t, i18n } = useTranslation();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (email === "admin@terracottaconstruction.com") {
        setUser(result.user);
      } else {
        alert("Access denied.");
        await signOut(auth);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-charcoal font-body px-4">
        <header className="flex flex-col items-center justify-center py-6 border-b border-gray-200">
          <img src={logo} alt="Terracotta Logo" className="h-14 w-auto mb-2" />
          <h1 className="text-2xl font-heading text-terracotta">Terracotta Construction</h1>
        </header>

        <main className="flex flex-col justify-center items-center mt-20 text-center">
          <h2 className="text-3xl font-heading mb-4">{t("login.title")}</h2>
          <p className="text-lg mb-6">{t("login.prompt")}</p>

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="flex items-center gap-3 bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded shadow hover:bg-gray-50 transition-all"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>{t("login.button")}</span>
            </button>

            <button
              onClick={toggleLanguage}
              className="bg-primaryYellow text-charcoal px-6 py-3 rounded hover:bg-yellow-400"
            >
              {t("login.toggle")}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/work-orders" element={<WorkOrders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
