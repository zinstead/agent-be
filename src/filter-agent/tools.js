import { tool, DynamicStructuredTool } from "langchain";
import {
  FilterSchema,
  SorterSchema,
  LimitSchema,
  AdjustedFieldSchema,
  ConditionSchema,
} from "./schema.js";
import { z } from "zod";
import axios from "axios";
import {
  getStats,
  buildFilterQuery,
  buildSorterQuery,
  buildLimitQuery,
  binarySearchMol,
  getDecimalPlaces,
} from "../utils/agent.js";

const filterApi = "http://localhost:3000/molecules";

export const topKToFilter = new DynamicStructuredTool({
  func: async ({ filters, sorter, limit }, _, config) => {
    // const apiBaseUrl = config.configurable.apiBaseUrl;
    // if (!apiBaseUrl) {
    //   throw new Error("未配置分子数据源(apiBaseUrl)");
    // }

    const filterQuery = buildFilterQuery(filters);
    const sorterQuery = buildSorterQuery(sorter);
    // const limitQuery = buildLimitQuery(limit);
    const api = `${filterApi}?${filterQuery}&${sorterQuery}`;
    const res = await axios.get(api);
    const data = res.data;
    const count = Math.min(data.length, limit);
    const sortedValues = data
      .slice(0, count)
      .map((item) => item[sorter.sortBy]);

    let condition, minValue, maxValue;
    if (sorter.order === "asc") {
      minValue = sortedValues[0];
      maxValue = sortedValues[sortedValues.length - 1];
      condition = {
        field: sorter.sortBy,
        operator: "between",
        value: [minValue, maxValue],
      };
    } else {
      minValue = sortedValues[sortedValues.length - 1];
      maxValue = sortedValues[0];
      condition = {
        field: sorter.sortBy,
        operator: "between",
        value: [minValue, maxValue],
      };
    }
    const newFilters = [...filters, condition];

    return JSON.stringify({ filters: newFilters, limit });
  },
  name: "topKToFilter",
  description: `将topK条件（获取按指定字段排序后的前 K 个分子）转化为纯粹的筛选条件。当你需要筛选出按某字段排序后的前 K 个分子时，调用本工具。
`,
  schema: z.object({
    filters: FilterSchema,
    sorter: SorterSchema,
    limit: z.number().int().positive(),
  }),
});

export const adjustFilters = new DynamicStructuredTool({
  func: async ({ initFilters, target, adjustedField }, _, config) => {
    // const apiBaseUrl = config.configurable.apiBaseUrl;
    // if (!apiBaseUrl) {
    //   throw new Error("未配置分子数据源(apiBaseUrl)");
    // }

    console.log(JSON.stringify({ initFilters, target, adjustedField }));

    // const promptTemp=`
    // adjustedField是一个js对象，它记录了软约束字段（允许调整的字段）的初始信息，包括它的字段名(field)、操作符(operator)和值(value)。
    // `;

    const { field, direction, range } = adjustedField;
    const data = (await axios.get(filterApi)).data;
    const { min, max } = getStats(data, field);
    const newFilters = await binarySearchMol({
      min,
      max,
      target,
      adjustedField,
      initFilters,
      filterApi,
    });

    return JSON.stringify({ filters: newFilters });
  },
  name: "adjustFilters",
  description: `调整分子的筛选条件。当用户要求筛选分子，且筛选条件包含分子数量和软约束（即允许调整某个字段，例如：放宽|收紧|增大|缩小xxx条件）时，使用本工具（仅使用一次）。
    下面对本工具要求输入的字段进行详细说明：
    1. initFilters: 调整前的筛选条件，要结合当前筛选条件和用户的筛选目标得到。
    2. target：要筛选的分子数量。
    3. adjustedField：
    - field是软约束字段（允许调整的字段）；
    - range是一个长度为2的数组，代表软约束字段的初始范围，示例如下：
      示例1：如果要求软约束字段大于或大于等于a，则将a作为数组第1个元素，第2个元素为null，即range应为[a,null]；
      示例2：如果要求软约束字段小于或小于等于b，则将b作为数组第2个元素，第1个元素为null，即range应为[null,b]；
    - direction是软约束字段的调整方向，要结合该字段的初始条件来理解，示例如下：
      示例1：如果要求软约束字段>a，说明随着该字段增大，分子数量会减少。此时如果要求放宽条件，意味着要减小a，所以direction是"decrease"；如果要求收紧条件，意味着要增大a，所以direction是"increase"；如果用户直接表达了要增大或减小a的意图，那就无需思考，直接决定了direction字段。
      示例2：如果要求软约束字段<=b，说明随着该字段减小，分子数量会减少。此时如果要求放宽条件，意味着要增大a，所以direction是"increase"；如果要求收紧条件，意味着要减小a，所以direction是"decrease"；如果用户直接表达了要增大或减小a的意图，那就无需思考，直接决定了direction字段。
    `,
  schema: z.object({
    initFilters: FilterSchema,
    target: LimitSchema,
    adjustedField: AdjustedFieldSchema,
  }),
});

export const count = new DynamicStructuredTool({
  func: async ({ filters }, _, config) => {
    // const apiBaseUrl = config.configurable.apiBaseUrl;
    // if (!apiBaseUrl) {
    //   throw new Error("未配置分子数据源(apiBaseUrl)");
    // }
    console.log("count执行");

    const query = buildFilterQuery(filters);
    const res = await fetch(`${filterApi}?${query}`);
    const data = await res.json();
    return JSON.stringify({ count: data.length });
  },
  name: "count",
  description: "获取某个筛选条件下的分子数量",
  schema: z.object({
    filters: FilterSchema,
  }),
});

export const stats = new DynamicStructuredTool({
  func: async ({ field }, _, config) => {
    // const apiBaseUrl = config.configurable.apiBaseUrl;
    // if (!apiBaseUrl) {
    //   throw new Error("未配置分子数据源(apiBaseUrl)");
    // }

    const res = await fetch(filterApi);
    const data = await res.json();

    const values = data.map((d) => d[field]).sort((a, b) => a - b);
    const min = values[0];
    const max = values[values.length - 1];
    const median = values[Math.floor(values.length / 2)];

    return JSON.stringify({ min, median, max });
  },
  name: "stats",
  description: "获取数据分布：输入字段名，返回该字段的 min、max、median 值",
  schema: z.object({
    field: z.string(),
  }),
});

export const percentile = new DynamicStructuredTool({
  func: async ({ field, p }, _, config) => {
    const res = await fetch(filterApi);
    const data = await res.json();
    if (data.length === 0) {
      throw new Error("分子数量为0");
    }
    if (typeof data[0][field] !== "number") {
      throw new Error("获取百分数的字段不是数字");
    }

    data.sort((a, b) => a - b);
    const n = data.length;

    // 5. 计算百分位数（使用线性插值法，常见于 Excel 的 PERCENTILE.INC）
    //    位置 index = (p / 100) * (N - 1)
    const index = (p / 100) * (n - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    let result;

    if (lower === upper) {
      result = data[lower];
    } else {
      // 线性插值
      const weight = index - lower;
      result = data[lower] * (1 - weight) + data[upper] * weight;
    }
    return JSON.stringify({ percentile: result });
  },
  name: "percentile",
  description: "返回某字段的第 p 百分位数。p是0~100的整数，p=0即获取最小值。",
  schema: z.object({
    field: z.string(),
    p: z.number().int().min(0).max(100),
  }),
});
