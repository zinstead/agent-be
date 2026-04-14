import { agent } from "./agent.js";

const result = await agent.invoke({
  messages: [
    {
      role: "user",
      content: "帮我筛选10个分子，ΔG < -8, MW < 500, error < 1，如果不够放宽ΔG",
    },
  ],
});

const lastMessage = result.messages[result.messages.length - 1];
console.log(lastMessage.content);
