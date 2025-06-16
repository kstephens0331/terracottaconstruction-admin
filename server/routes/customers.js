import express from "express";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("customers").get();
    const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ customers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customers" });
  }
});

router.post("/", async (req, res) => {
  const { name, email } = req.body;
  try {
    const docRef = await db.collection("customers").add({
      name,
      email,
      created_at: new Date().toISOString(),
    });
    res.json({ id: docRef.id, message: "Customer added" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add customer" });
  }
});

export default router;
