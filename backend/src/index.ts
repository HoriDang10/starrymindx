import express from "express";
import cors from "cors";

// Import routes
import aiRouter from "./routes/ai";
import quizRouter from "./routes/quiz";

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/routes/ai", aiRouter);
app.use("/routes/quiz", quizRouter);

// Default route for debugging
app.get("/", (_, res) => {
  res.send("✅ StarryMind backend is running!");
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
