import express from "express";
import { getUserAction } from "./intent-agent/intent.js";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/agent", async (req, res) => {
  const { messages } = req.body;
  const action = await getUserAction(messages);
  res.send(action);
});

app.listen(5000, () => {
  console.log("服务已启动...");
});
