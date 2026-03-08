import OpenAI from "openai";
import { apiKey } from "../config.js";

const baseURL = "https://api.deepseek.com";

const openai = new OpenAI({
  baseURL,
  apiKey,
});

export async function getUserAction(input) {
  const systemPrompt = `
你是一个前端Agent，负责将用户指令转换为JSON动作。
可用的动作包括:
1. showProjectList：查看项目列表，参数 type，取值可以是"my"、"starred"、"all"；
2. showTaskList：查看任务列表，参数 type，取值可以是"recent"、"global";
3. createProject：创建项目。

示例：
输入：列出我收藏的项目
输出：
{
    "action":"showProjectList",
    "type":"starred"
}

如果无法匹配动作，返回:
{
  "action": "unknown"
}
`;
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: input },
  ];
  const completion = await openai.chat.completions.create({
    messages,
    model: "deepseek-chat",
    response_format: {
      type: "json_object",
    },
  });
  const res = completion.choices[0].message.content;
  return res;
}
