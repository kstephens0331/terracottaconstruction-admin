// src/pages/WorkOrders.jsx
import React from "react";
import { useTranslation } from "react-i18next";

function WorkOrders() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-terracotta">
        {t("workOrders.title")}
      </h1>
      <p className="text-gray-700">{t("workOrders.placeholder")}</p>
    </div>
  );
}

export default WorkOrders;