import express from "express";
import { getUserAction } from "./intent-agent/intent.js";
import { filterMolecules } from "./filter-agent/filter.js";
import cors from "cors";
import morgan from "morgan";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/agent/intent", async (req, res) => {
  const { messages } = req.body;
  const result = await getUserAction(messages);
  console.log("intent result:", JSON.stringify(result));
  res.send(result);
});

app.post("/api/agent/filter", async (req, res) => {
  const { filterApi, userGoal, filters } = req.body;
  const message = {
    currentFilters: filters,
    userGoal,
  };
  const result = await filterMolecules({ message, filterApi });
  console.log("filter result:", JSON.stringify(result));
  res.send(result);
});

app.listen(5000, () => {
  console.log("服务已启动...");
});
