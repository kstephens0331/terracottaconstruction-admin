import express from "express";
import nodemailer from "nodemailer";
import supabase from "../db/connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json({ quotes: data });
  } catch (err) {
    console.error("Quote fetch error:", err);
    res.status(500).json({ message: "Failed to load quotes." });
  }
});

router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status required." });

  try {
    const { error } = await supabase
      .from("quotes")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "Quote status updated." });
  } catch (err) {
    console.error("Quote status update error:", err);
    res.status(500).json({ message: "Failed to update quote." });
  }
});

router.post("/send", async (req, res) => {
  const {
    customerEmail,
    customerName,
    quoteItems,
    margin,
    total,
    phone,
    address,
    allowOverride
  } = req.body;

  if (margin < 30 && !allowOverride) {
    return res.status(400).json({ message: "Quote margin too low. Override required." });
  }

  try {
    console.log("INCOMING DATA:", req.body);

    const { data: existingCustomer, error: lookupError } = await supabase
      .from("customers")
      .select("*")
      .eq("email", customerEmail)
      .maybeSingle();

    if (lookupError) throw lookupError;

    if (!existingCustomer) {
      const accountNumber = "ACCT-" + crypto.randomUUID().slice(0, 8);
      const { error: insertCustomerError } = await supabase
        .from("customers")
        .insert([{ name: customerName, email: customerEmail, phone, address, account_number: accountNumber }]);
      if (insertCustomerError) throw insertCustomerError;
    }

    const { error: quoteError } = await supabase.from("quotes").insert([
      {
        customer_email: customerEmail,
        customer_name: customerName,
        phone,
        address,
        line_items: quoteItems,
        margin,
        total,
        status: "Open"
      }
    ]);

    if (quoteError) throw quoteError;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const htmlBody = `
  <h2>Quote from Terracotta Construction</h2>
  <p>Hello ${customerName},</p>
  <p>Here is your quote:</p>
  <ul>
    ${quoteItems.map(item => `<li>${item.quantity} × ${item.description} — $${item.price}</li>`).join("")}
  </ul>
  <p><strong>Total: $${total}</strong></p>
  <p>Thank you,<br/>Terracotta Construction</p>
  `;

    await transporter.sendMail({
      from: `"Terracotta Construction" <${process.env.GMAIL_USER}>`,
      to: customerEmail,
      subject: "Your Quote from Terracotta Construction",
      html: htmlBody
    });

    res.status(200).json({ message: "Quote saved and emailed successfully." });
  } catch (err) {
    console.error("Quote send error:", err);
    res.status(500).json({ message: "Error sending quote or saving." });
  }
});

export default router;
