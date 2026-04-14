import axios from "axios";
import { createAgent, tool } from "langchain";
import { z } from "zod";

const API = "http://localhost:3000/ligands";

/**
 * countLigands
 */
export const count = tool(
  async ({ filters }) => {
    const params: any = {};

    for (const key in filters) {
      const cond = filters[key];
      if (cond.lt !== undefined) params[`${key}_lte`] = cond.lt;
      if (cond.gt !== undefined) params[`${key}_gte`] = cond.gt;
    }

    const res = await axios.get(API, { params });

    return JSON.stringify({
      count: res.data.length,
    });
  },
  {
    name: "count",
    description:
      "Count ligands that satisfy filters. filters example: {ΔG:{lt:-9},MW:{lt:500}}",
    schema: z.object({
      filters: z.record(z.any(), z.any()),
    }),
  },
);

/**
 * suggestThreshold
 */
export const suggestThreshold = tool(
  async ({ metric, targetCount }) => {
    const res = await axios.get(API);

    const values = res.data.map((l) => l[metric]).sort((a, b) => a - b);

    const threshold = values[targetCount - 1];

    return JSON.stringify({
      suggestedThreshold: threshold,
    });
  },
  {
    name: "suggestThreshold",
    description:
      "Suggest a threshold for a metric to obtain target number of ligands",
    schema: z.object({
      metric: z.string(),
      targetCount: z.number(),
    }),
  },
);
