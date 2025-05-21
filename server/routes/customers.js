import express from "express";
import supabase from "../db/connection.js";

const router = express.Router();

// GET: Return all customers
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("id, name, email, phone, address, account_number")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({ customers: data });
  } catch (err) {
    console.error("Customer fetch error:", err);
    res.status(500).json({ message: "Failed to load customers." });
  }
});

// POST: Create a new customer
router.post("/", async (req, res) => {
  const { name, email, phone, address } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  try {
    const { data: existing, error: lookupError } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (lookupError) throw lookupError;

    if (existing) {
      return res.status(400).json({ message: "Customer already exists." });
    }

    const accountNumber = "ACCT-" + crypto.randomUUID().slice(0, 8);

    const { error: insertError } = await supabase.from("customers").insert([
      { name, email, phone, address, account_number: accountNumber }
    ]);

    if (insertError) throw insertError;

    res.status(200).json({ message: "Customer created." });
  } catch (err) {
    console.error("Customer create error:", err);
    res.status(500).json({ message: "Error creating customer." });
  }
});

export default router;
