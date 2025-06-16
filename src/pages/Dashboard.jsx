import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebase";

function Dashboard() {
  const [quotes, setQuotes] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [search, setSearch] = useState("");

  const fetchQuotes = async () => {
    try {
      const snapshot = await getDocs(collection(db, "quotes"));
      const quoteList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuotes(quoteList);
    } catch (err) {
      console.error("Error fetching quotes:", err);
    }
  };

  const fetchWorkOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "work_orders"));
      const woList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkOrders(woList);
    } catch (err) {
      console.error("Error fetching work orders:", err);
    }
  };

  useEffect(() => {
    fetchQuotes();
    fetchWorkOrders();
  }, []);

  const handleQuoteStatusChange = async (id, status) => {
    try {
      const quoteRef = doc(db, "quotes", id);
      await updateDoc(quoteRef, { status });
      fetchQuotes();
    } catch (err) {
      console.error("Failed to update quote status:", err);
    }
  };

  const handleWorkOrderStatusChange = async (id, status) => {
    try {
      const woRef = doc(db, "work_orders", id);
      await updateDoc(woRef, { status });
      fetchWorkOrders();
    } catch (err) {
      console.error("Failed to update work order status:", err);
    }
  };

  const filterData = (records) =>
    records.filter((rec) =>
      [rec.customer_name, rec.customer_email, rec.phone, rec.address]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="max-w-7xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-terracotta mb-4">Admin Dashboard</h1>

      <input
        type="text"
        placeholder="Search by name, email, phone, address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 border border-gray-300 rounded px-3 py-2"
      />

      <h2 className="text-xl font-semibold mb-2">Open or Approved Quotes</h2>
      {filterData(quotes.filter((q) => q.status === "Open" || q.status === "Approved")).length === 0 ? (
        <p className="text-gray-500 mb-6">No open or approved quotes.</p>
      ) : (
        <table className="w-full table-auto mb-6 border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filterData(quotes.filter((q) => q.status === "Open" || q.status === "Approved")).map((q) => (
              <tr key={q.id} className="border-t">
                <td className="p-2">{q.customer_name}</td>
                <td className="p-2">{q.customer_email}</td>
                <td className="p-2">{q.phone}</td>
                <td className="p-2">{q.address}</td>
                <td className="p-2">${q.total}</td>
                <td className="p-2">
                  <select
                    value={q.status}
                    onChange={(e) => handleQuoteStatusChange(q.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="Open">Open</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Invoiced">Invoiced</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="text-xl font-semibold mb-2">Active Work Orders</h2>
      {filterData(workOrders.filter((wo) => wo.status !== "Complete")).length === 0 ? (
        <p className="text-gray-500">No active work orders.</p>
      ) : (
        <table className="w-full table-auto border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filterData(workOrders.filter((wo) => wo.status !== "Complete")).map((wo) => (
              <tr key={wo.id} className="border-t">
                <td className="p-2">{wo.customer_name}</td>
                <td className="p-2">{wo.customer_email}</td>
                <td className="p-2">{wo.phone}</td>
                <td className="p-2">{wo.address}</td>
                <td className="p-2">{wo.description}</td>
                <td className="p-2">
                  <select
                    value={wo.status}
                    onChange={(e) => handleWorkOrderStatusChange(wo.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
