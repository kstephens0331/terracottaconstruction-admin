import express from "express";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

// Get all work orders
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("workorders").get();
    const work_orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ work_orders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch work orders", error: err.message });
  }
});

// Create a new work order
router.post("/", async (req, res) => {
  const {
    customer_name,
    customer_email,
    description,
    reference,
    status
  } = req.body;

  if (!customer_name || !customer_email || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const docRef = await db.collection("workorders").add({
      customer_name,
      customer_email,
      description,
      reference: reference || "",
      status: status || "New",
      created_at: new Date().toISOString()
    });

    res.json({ id: docRef.id, message: "Work order created" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create work order", error: err.message });
  }
});

// Update status
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.collection("workorders").doc(id).update({
      status
    });

    res.json({ message: "Work order status updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update work order status", error: err.message });
  }
});

export default router;
