import express from "express";
import supabase from "../db/connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("work_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json({ work_orders: data });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Could not fetch work orders." });
  }
});

router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status required." });

  try {
    const updates = {
      status,
      ...(status === "Complete" && { completed_at: new Date().toISOString() })
    };

    const { error } = await supabase
      .from("work_orders")
      .update(updates)
      .eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "Work order status updated." });
  } catch (err) {
    console.error("Work order status update error:", err);
    res.status(500).json({ message: "Failed to update status." });
  }
});

router.post("/", async (req, res) => {
  const { customer_name, customer_email, phone, address, reference, description, status } = req.body;

  if (!customer_name || !customer_email || !description) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const { error } = await supabase.from("work_orders").insert([
      {
        customer_name,
        customer_email,
        phone,
        address,
        reference,
        description,
        status
      }
    ]);

    if (error) throw error;

    res.status(200).json({ message: "Work order created." });
  } catch (err) {
    console.error("Work order create error:", err);
    res.status(500).json({ message: "Failed to create work order." });
  }
});

export default router;
