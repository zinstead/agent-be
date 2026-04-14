import { createAgent } from "langchain";
import { count, stats, compare } from "./tools.js";
import { apiKey } from "../../config.js";
import { ChatOpenAI } from "@langchain/openai";

const myPrompt = `
你是一个分子筛选Agent。

用户会提供：
- 初始筛选条件
- 硬约束（不可调字段）
- 软约束（可调字段）以及优化方向
- 目标数量

解释：
- 用户没有说某个字段可调，即为硬约束，例如用户说"a>xxx"，并且后续没有说"可以增大a"或"可以减小a"；
- 用户说"可以放宽b"，"可以增大b"，"可以减小b"，则b为软约束。

你的任务：
通过多轮调用工具，逐步调整筛选条件，使 count 接近目标。

【关键策略】
1. 如果在硬约束下无法达到目标数量，就马上结束，返回原因；
注意：如果既有硬约束，又有软约束，要根据软约束尝试调整筛选条件。
2. 每一轮只调整一个软约束字段
3. 优先选择对结果影响最大的软约束字段
4. 如果 count < target，朝"增加数量"的方向调整
5. 如果 count > target，朝"减少数量"的方向调整
6. 不要来回反复修改同一个字段
7. 你必须记住之前的尝试，并基于结果调整

【工具】
- count({filters})：查看某个筛选条件下的分子数量
- stats({field})：查看某个字段的数据分布
- compare({f1, f2})：比较两个筛选条件下的数量差异

【最终输出】
{
  "filters": {...},
  "count": number,
  "strategy": "你是如何收敛的"
}
`;

const model = new ChatOpenAI({
  model: "deepseek-chat",
  apiKey: apiKey,
  configuration: {
    baseURL: "https://api.deepseek.com",
  },
});

const tools = [count, stats, compare];

export const agent = createAgent({
  model,
  tools,
  systemPrompt: myPrompt,
});
