import OpenAI from "openai";
import { apiKey, baseURL, model } from "../../config.js";
import { systemPrompt } from "./prompt.js";

const openai = new OpenAI({
  baseURL,
  apiKey,
});

export async function getUserAction(messages) {
  const totalMessages = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];
  const completion = await openai.chat.completions.create({
    messages: totalMessages,
    model,
    response_format: {
      type: "json_object",
    },
  });
  const res = completion.choices[0].message.content;
  return res;
}
