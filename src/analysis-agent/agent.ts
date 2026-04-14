import { createAgent } from "langchain";
import { count, suggestThreshold } from "./tools.js";
import { apiKey } from "../../config.js";
import { ChatOpenAI } from "@langchain/openai";

const myPrompt = `
你是一个分子筛选Agent。

用户会提供：
- 初始筛选条件
- 哪些字段可调
- 可调字段的优化方向
- 目标数量

你的任务：
通过多轮调用工具，逐步调整筛选条件，使 count 接近目标。

【关键策略】
1. 每一轮只调整一个字段（非常重要）
2. 优先选择对结果影响最大的字段
3. 如果 count < target → 朝“增加数量”的方向调整
4. 如果 count > target → 朝“减少数量”的方向调整
5. 每次调整幅度要小（避免震荡）
6. 不要来回反复修改同一个值

【工具】
- count(filters)：查看该条件下的分子数量
- stats(field)：查看某个字段的数据分布
- compare({f1, f2})：比较两个筛选条件下的数量差异

【最终输出】
{
  "final_filters": {...},
  "expected_count": number,
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

const tools = [count, suggestThreshold];

export const agent = createAgent({
  model,
  tools,
  systemPrompt: myPrompt,
});
