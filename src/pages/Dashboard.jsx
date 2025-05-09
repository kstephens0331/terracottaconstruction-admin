import React from "react";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";

function Dashboard({ user, onLogout }) {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="flex h-screen">

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <span className="font-heading text-terracotta text-lg">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">{t("welcome", { name: user.displayName })}</span>
            <button
              onClick={toggleLanguage}
              className="bg-primaryYellow text-charcoal px-3 py-1 rounded hover:bg-yellow-400"
            >
              {t("login.toggle")}
            </button>
            <button
              onClick={onLogout}
              className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
            >
              {t("logout")}
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <h1 className="text-2xl font-heading mb-4">{t("Welcome to the Admin Dashboard")}</h1>
          <p>{t("This is where you can manage quotes, work orders, and customers.")}</p>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
