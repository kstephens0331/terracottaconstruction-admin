import express from "express";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

// Get all quotes
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("quotes").get();
    const quotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ quotes });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch quotes", error: err.message });
  }
});

// Send/create quote
router.post("/send", async (req, res) => {
  const {
    customerName,
    customerEmail,
    quoteItems,
    margin,
    total,
    allowOverride
  } = req.body;

  if (!customerName || !customerEmail || !quoteItems || total == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const docRef = await db.collection("quotes").add({
      customer_name: customerName,
      customer_email: customerEmail,
      line_items: quoteItems,
      margin,
      total,
      allow_override: allowOverride || false,
      status: "Open",
      created_at: new Date().toISOString()
    });

    res.json({ id: docRef.id, message: "Quote saved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send quote", error: err.message });
  }
});

// Update status
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.collection("quotes").doc(id).update({
      status
    });
    res.json({ message: "Quote status updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update quote status", error: err.message });
  }
});

export default router;
