import React, { useEffect, useState } from "react";

function Dashboard() {
  const [quotes, setQuotes] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [search, setSearch] = useState("");

  const fetchQuotes = async () => {
    const res = await fetch("http://localhost:5000/api/quotes");
    const data = await res.json();
    setQuotes(data.quotes || []);
  };

  const fetchWorkOrders = async () => {
    const res = await fetch("http://localhost:5000/api/workorders");
    const data = await res.json();
    setWorkOrders(data.work_orders || []);
  };

  useEffect(() => {
    fetchQuotes();
    fetchWorkOrders();
  }, []);

  const handleQuoteStatusChange = async (id, status) => {
    await fetch(`http://localhost:5000/api/quotes/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchQuotes();
  };

  const handleWorkOrderStatusChange = async (id, status) => {
    await fetch(`http://localhost:5000/api/workorders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchWorkOrders();
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
