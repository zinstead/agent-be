import { number, z } from "zod";

// 叶子条件
export const ConditionSchema = z.object({
  field: z.string(),
  operator: z.enum([
    "eq",
    "ne",
    "gt",
    "gte",
    "lt",
    "lte",
    "contains",
    "in",
    "between",
  ]), // 根据实际支持扩展
  value: z.any(),
});

// 递归组
const FilterGroupSchema = z.lazy(() =>
  z.object({
    logic: z.enum(["and", "or"]).default("and"),
    conditions: z.array(z.union([ConditionSchema, FilterGroupSchema])),
  }),
);

// 最终 filters 参数可以是单个条件组，或者为了向后兼容允许 null/空对象
export const FilterSchema = z.array(ConditionSchema).optional();

export const SorterSchema = z
  .object({
    sortBy: z.string(),
    order: z.enum(["asc", "desc"]),
  })
  .optional();

export const LimitSchema = z.number().int().min(1).optional();

export const AdjustedFieldSchema = z.object({
  field: z.string(),
  range: z.tuple([z.number().nullable(), z.number().nullable()]),
  direction: z.enum(["increase", "decrease"]),
});

export const OutputSchema = z.object({
  filters: FilterSchema,
  // sorter: SorterSchema,
  limit: LimitSchema,
  reason: z.string(),
});
