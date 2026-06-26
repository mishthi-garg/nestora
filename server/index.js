import "dotenv/config";
import express from "express";
import cors from "cors";

import chatbotRouter from "./routes/chatbot.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/chatbot", chatbotRouter);

app.get("/", (req, res) => {
  res.send("Nestora API is running");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});