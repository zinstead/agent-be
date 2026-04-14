import { tool } from "langchain";
import { z } from "zod";

function buildQuery(filters) {
  const params = new URLSearchParams();

  for (const field in filters) {
    const ops = filters[field];
    for (const op in ops) {
      params.append(`${field}_${op}`, ops[op]);
    }
  }

  return params.toString();
}

export const count = tool(
  async ({ filters }) => {
    const query = buildQuery(filters);

    const res = await fetch(`http://localhost:3000/molecules?${query}`);
    const data = await res.json();

    return JSON.stringify({ count: data.length });
  },
  {
    name: "count",
    description: "输入 filters(JSON)，返回数量",
    schema: z.object({
      filters: z.record(
        z.string(), // 字段名
        z.record(z.string(), z.any()), // 操作符 → 值
      ),
    }),
  },
);

export const stats = tool(
  async ({ field }) => {
    const res = await fetch(`http://localhost:3000/molecules`);
    const data = await res.json();

    const values = data.map((d) => d[field]).sort((a, b) => a - b);

    const min = values[0];
    const max = values[values.length - 1];
    const median = values[Math.floor(values.length / 2)];

    return JSON.stringify({ min, median, max });
  },
  {
    name: "stats",
    description: "输入字段名，返回 min、max、median",
    schema: z.object({
      field: z.string(),
    }),
  },
);

export const compare = tool(
  async ({ f1, f2 }) => {
    const q1 = buildQuery(f1);
    const q2 = buildQuery(f2);

    const [r1, r2] = await Promise.all([
      fetch(`http://localhost:3000/molecules?${q1}`),
      fetch(`http://localhost:3000/molecules?${q2}`),
    ]);

    const d1 = await r1.json();
    const d2 = await r2.json();

    return JSON.stringify({
      delta: d2.length - d1.length,
      count1: d1.length,
      count2: d2.length,
    });
  },
  {
    name: "compare",
    description: "比较两个filters的count差异",
    schema: z.object({
      f1: z.record(
        z.string(), // 字段名
        z.record(z.string(), z.any()), // 操作符 → 值
      ),
      f2: z.record(
        z.string(), // 字段名
        z.record(z.string(), z.any()), // 操作符 → 值
      ),
    }),
  },
);
