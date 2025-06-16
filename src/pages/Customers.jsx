// src/pages/Customers.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

function Customers() {
  const { t } = useTranslation();

  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 Load all customers from Firestore
  const fetchCustomers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "customers"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ➕ Add new customer
  const handleCreate = async () => {
    setLoading(true);
    try {
      // Random 6-digit account number
      const accountNumber = Math.floor(100000 + Math.random() * 900000).toString();

      await addDoc(collection(db, "customers"), {
        name,
        email,
        account_number: accountNumber,
        created_at: serverTimestamp(),
      });

      alert("✅ Customer added!");
      setName("");
      setEmail("");
      fetchCustomers(); // Refresh list
    } catch (err) {
      console.error("Add error", err);
      alert("Something went wrong while adding the customer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-terracotta">
        {t("customers.title")}
      </h1>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-lg font-semibold mb-2">Add New Customer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
          onClick={handleCreate}
          disabled={!name || !email || loading}
          className={`mt-4 px-4 py-2 rounded text-white ${
            !name || !email || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-terracotta hover:bg-terracotta-dark"
          }`}
        >
          {loading ? "Adding..." : "Create Customer"}
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Customer List</h2>
        {customers.length === 0 ? (
          <p className="text-gray-500">No customers found.</p>
        ) : (
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Account #</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-2">{c.account_number || "—"}</td>
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Customers;
