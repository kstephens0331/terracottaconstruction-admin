// src/pages/NotFound.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full mt-20 text-center">
      <h1 className="text-4xl font-bold text-terracotta mb-4">404</h1>
      <p className="text-lg mb-4 text-gray-700">{t("notFound.message")}</p>
      <Link
        to="/dashboard"
        className="text-white bg-terracotta px-5 py-2 rounded hover:bg-terracotta-dark transition"
      >
        {t("notFound.back")}
      </Link>
    </div>
  );
}

export default NotFound;