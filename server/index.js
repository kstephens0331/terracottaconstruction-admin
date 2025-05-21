// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import quoteRoutes from './routes/quotes.js';
import customerRoutes from "./routes/customers.js";
import workOrderRoutes from "./routes/workorders.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/quotes', quoteRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/workorders", workOrderRoutes);

app.get('/', (req, res) => {
  res.send('Terracotta Construction Admin API is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
