import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

function WorkOrders() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState("New");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "work_orders"));
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
    } catch (err) {
      console.error("Failed to fetch work orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSubmit = async () => {
    if (!name || !email || !description) {
      alert("Name, email, and description are required.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "work_orders"), {
        customer_name: name,
        customer_email: email,
        description,
        reference,
        status,
        created_at: serverTimestamp()
      });

      alert("✅ Work order submitted!");
      setName("");
      setEmail("");
      setDescription("");
      setReference("");
      setStatus("New");
      fetchOrders();
    } catch (err) {
      console.error("Submission error", err);
      alert("Failed to submit work order.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const orderRef = doc(db, "work_orders", id);
      await updateDoc(orderRef, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-terracotta mb-4">Work Orders</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="email"
          placeholder="Customer Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Reference (optional)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 col-span-2"
        />
        <textarea
          placeholder="Work Order Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 col-span-2 min-h-[100px]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Complete">Complete</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-terracotta text-white px-4 py-2 rounded hover:bg-terracotta-dark"
      >
        {loading ? "Submitting..." : "Submit Work Order"}
      </button>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-4">All Work Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No work orders submitted yet.</p>
      ) : (
        <table className="w-full table-auto border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Customer</th>
              <th className="p-2">Email</th>
              <th className="p-2">Description</th>
              <th className="p-2">Reference</th>
              <th className="p-2">Status</th>
              <th className="p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-2">{order.customer_name}</td>
                <td className="p-2">{order.customer_email}</td>
                <td className="p-2">{order.description}</td>
                <td className="p-2">{order.reference}</td>
                <td className="p-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                  </select>
                </td>
                <td className="p-2">
                  {order.created_at?.toDate
                    ? order.created_at.toDate().toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WorkOrders;
