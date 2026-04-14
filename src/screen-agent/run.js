import { agent } from "./screen.js";

const result = await agent.invoke({
  messages: [
    {
      role: "user",
      // content: "帮我筛选10个分子，ΔG < -8, MW < 500, error < 1，如果不够放宽ΔG",
      content: "筛选2个分子，要求c<0.4，d>1，如果数量不够可以放宽d",
    },
  ],
});

const lastMessage = result.messages[result.messages.length - 1];
console.log(result.messages);
// console.log(lastMessage.content);
