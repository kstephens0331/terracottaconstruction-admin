// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";

function Sidebar({ onLogout }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: t("nav.dashboard") },
    { path: "/quotes", label: t("nav.quotes") },
    { path: "/work-orders", label: t("nav.workOrders") },
    { path: "/customers", label: t("nav.customers") },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <aside className="w-64 min-h-screen bg-terracotta text-white flex flex-col px-4 py-6 shadow-md">
      <div className="mb-8 flex flex-col items-center">
        <img src={logo} alt="Logo" className="h-12 mb-2" />
        <h2 className="text-lg font-bold text-center">Terracotta Admin</h2>
      </div>

      <nav className="flex-1 space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-3 py-2 rounded hover:bg-white hover:text-terracotta transition ${
              location.pathname === item.path ? "bg-white text-terracotta font-semibold" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 space-y-3">
        <button
          onClick={toggleLanguage}
          className="w-full bg-white text-terracotta py-2 rounded hover:bg-gray-200 transition"
        >
          {t("nav.toggleLanguage")}
        </button>
        <button
          onClick={onLogout}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          {t("nav.logout")}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
