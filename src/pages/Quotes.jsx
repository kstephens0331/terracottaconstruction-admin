import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import {
  calculateMargin,
  isBelowMinimumMargin
} from "../modules/marginUtils";

function Quotes() {
  const { t } = useTranslation();

  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [overrideAllowed, setOverrideAllowed] = useState(false);
  const [lineItems, setLineItems] = useState([
    { description: "", quantity: 1, cost: 0, price: 0 }
  ]);

  const { margin, totalCost, totalPrice } = calculateMargin(lineItems);
  const belowMargin = isBelowMinimumMargin(margin);

  // Fetch all customers from Firestore
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "customers"));
        const customerList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customerList);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      }
    };

    fetchCustomers();
  }, []);

  // Autofill when a customer is selected
  useEffect(() => {
    const selected = customers.find((c) => c.id === selectedCustomerId);
    if (selected) {
      setCustomerName(selected.name);
      setCustomerEmail(selected.email);
    }
  }, [selectedCustomerId, customers]);

  const handleItemChange = (index, field, value) => {
    const updated = [...lineItems];
    updated[index][field] =
      field === "description" ? value : parseFloat(value || 0);
    setLineItems(updated);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { description: "", quantity: 1, cost: 0, price: 0 }
    ]);
  };

  const removeLineItem = (index) => {
    const updated = lineItems.filter((_, i) => i !== index);
    setLineItems(updated);
  };

  // Send quote to Firestore
  const handleSend = async () => {
    if (belowMargin && !overrideAllowed) {
      alert("❌ Margin is below 30% and override is not allowed.");
      return;
    }

    try {
      const payload = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_id: selectedCustomerId || null,
        quote_items: lineItems,
        margin: parseFloat(margin),
        total: parseFloat(totalPrice),
        allow_override: overrideAllowed,
        status: "Open",
        created_at: serverTimestamp(),
      };

      await addDoc(collection(db, "quotes"), payload);
      alert("✅ Quote sent and saved successfully.");
    } catch (err) {
      console.error("Send error:", err);
      alert("❌ Something went wrong while sending the quote.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-terracotta">
        {t("quotes.title")}
      </h1>

      <label className="block mb-4">
        <span className="block font-semibold mb-1">Select Existing Customer</span>
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">-- New Customer --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-1">Customer Name</span>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-1">Customer Email</span>
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </label>

      <div className="space-y-4">
        {lineItems.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 items-end">
            <input
              type="text"
              placeholder={t("quotes.description")}
              value={item.description}
              onChange={(e) =>
                handleItemChange(index, "description", e.target.value)
              }
              className="col-span-2 border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Cost"
              value={item.cost}
              onChange={(e) => handleItemChange(index, "cost", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleItemChange(index, "price", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <button
              onClick={() => removeLineItem(index)}
              className="text-red-600 hover:underline col-span-1"
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

      <div className="mt-6 space-y-2 text-lg font-semibold">
        <div>Total Cost: ${totalCost}</div>
        <div>Total Price: ${totalPrice}</div>
        <div className={belowMargin ? "text-red-600" : "text-green-600"}>
          Margin: {margin}% {belowMargin && "(Below 30%)"}
        </div>
      </div>

      {belowMargin && (
        <div className="mt-4 text-sm text-red-600">
          ⚠️ This quote is below the required 30% margin.
          <label className="ml-2">
            <input
              type="checkbox"
              checked={overrideAllowed}
              onChange={() => setOverrideAllowed(!overrideAllowed)}
            />{" "}
            Allow override
          </label>
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSend}
          disabled={belowMargin && !overrideAllowed}
          className={`${
            belowMargin && !overrideAllowed
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primaryYellow hover:bg-yellow-400"
          } text-charcoal px-4 py-2 rounded`}
        >
          {t("quotes.send")}
        </button>
      </div>
    </div>
  );
}

export default Quotes;
