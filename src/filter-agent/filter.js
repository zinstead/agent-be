import { createAgent } from "langchain";
import { topk_to_filter, adjust_filters } from "./tools.js";
import { apiKey, baseURL, model } from "../../config.js";
import { ChatOpenAI } from "@langchain/openai";
import { systemPrompt } from "./prompt.js";
import { OutputSchema } from "./schema.js";

const modelConfig = new ChatOpenAI({
  model,
  apiKey: apiKey,
  configuration: {
    baseURL: baseURL,
  },
});

const tools = [topk_to_filter, adjust_filters];

const agent = createAgent({
  model: modelConfig,
  tools,
  systemPrompt,
  responseFormat: OutputSchema,
});

export async function filterMolecules(params) {
  const msg = JSON.stringify(params.message);
  const result = await agent.invoke(
    {
      messages: [
        {
          role: "user",
          content: msg,
        },
      ],
    },
    {
      configurable: {
        apiBaseUrl: params.filterApi,
      },
    },
  );
  // fs.writeFileSync("./result.json", JSON.stringify(result.messages));
  return result.structuredResponse;
}
