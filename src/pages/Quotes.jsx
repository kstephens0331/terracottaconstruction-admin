// src/pages/Quotes.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function Quotes() {
  const { t } = useTranslation();
  const [customer, setCustomer] = useState("");
  const [lineItems, setLineItems] = useState([
    { description: "", quantity: 1, price: 0 }
  ]);

  const handleItemChange = (index, field, value) => {
    const updated = [...lineItems];
    updated[index][field] = field === "description" ? value : parseFloat(value);
    setLineItems(updated);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, price: 0 }]);
  };

  const removeLineItem = (index) => {
    const updated = lineItems.filter((_, i) => i !== index);
    setLineItems(updated);
  };

  const getTotal = () => {
    return lineItems.reduce((total, item) => {
      return total + (item.quantity * item.price || 0);
    }, 0).toFixed(2);
  };

  const handleSave = () => {
    // Placeholder for save logic
    alert("Quote saved (placeholder)");
  };

  const handleSend = () => {
    // Placeholder for send logic
    alert("Quote sent to email (placeholder)");
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-terracotta">
        {t("quotes.title")}
      </h1>

      <label className="block mb-4">
        <span className="block font-semibold mb-1">{t("quotes.customer")}</span>
        <input
          type="text"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </label>

      <div className="space-y-4">
        {lineItems.map((item, index) => (
          <div key={index} className="flex gap-2 items-end">
            <input
              type="text"
              placeholder={t("quotes.description")}
              value={item.description}
              onChange={(e) => handleItemChange(index, "description", e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
              className="w-24 border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              value={item.price}
              onChange={(e) => handleItemChange(index, "price", e.target.value)}
              className="w-24 border border-gray-300 rounded px-3 py-2"
            />
            <button
              onClick={() => removeLineItem(index)}
              className="text-red-600 hover:underline"
            >
              {t("quotes.remove")}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addLineItem}
        className="mt-4 bg-terracotta text-white px-4 py-2 rounded hover:bg-terracotta-dark"
      >
        {t("quotes.addItem")}
      </button>

      <div className="mt-6 text-xl font-semibold">
        {t("quotes.total")}: ${getTotal()}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSave}
          className="bg-gray-200 text-charcoal px-4 py-2 rounded hover:bg-gray-300"
        >
          {t("quotes.save")}
        </button>
        <button
          onClick={handleSend}
          className="bg-primaryYellow text-charcoal px-4 py-2 rounded hover:bg-yellow-400"
        >
          {t("quotes.send")}
        </button>
      </div>
    </div>
  );
}

export default Quotes;