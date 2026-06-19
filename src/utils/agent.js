import _ from "lodash";
import axios from "axios";

const operatorSuffixMap = {
  eq: ":eq", // 等于：field=value
  ne: ":ne", // 不等于：field_ne=value
  gt: ":gt", // 大于：field_gt=value
  gte: ":gte", // 大于等于：field_gte=value
  lt: ":lt", // 小于：field_lt=value
  lte: ":lte", // 小于等于：field_lte=value
  contains: ":contains", // 包含：field_contains=value
  in: ":in", // 在数组中：field_in=value1,value2,value3
  // between 特殊处理，不在此映射，直接拆成 _gte 和 _lte
};

export function buildFilterQuery(filters) {
  const params = new URLSearchParams();

  function appendCondition(field, suffix, value) {
    let key = field;
    if (suffix) key = `${field}${suffix}`;
    // 值如果是数组，转为逗号分隔字符串（用于 _in）
    const serialized = Array.isArray(value) ? value.join(",") : String(value);
    params.append(key, serialized);
  }

  function traverse(node) {
    if (!node) return;

    // 叶子条件
    if ("field" in node && "operator" in node && "value" in node) {
      const { field, operator, value } = node;

      if (operator === "between") {
        // between: value 必须是 [low, high]
        if (!Array.isArray(value) || value.length !== 2) {
          throw new Error(
            `between operator requires [low, high] array, got ${value}`,
          );
        }
        const [low, high] = value;
        appendCondition(field, ":gte", low);
        appendCondition(field, ":lte", high);
      } else {
        const suffix = operatorSuffixMap[operator];
        if (suffix === undefined) {
          throw new Error(`Unsupported operator: ${operator}`);
        }
        appendCondition(field, suffix, value);
      }
    }
    // 组合节点
    else if ("logic" in node && "conditions" in node) {
      const { logic, conditions } = node;
      if (logic === "or") {
        // json-server 默认不支持 OR，可提示 Agent 改用多次查询或使用特殊插件
        throw new Error(
          "OR logic is not supported by json-server backend. Please split into separate queries or use AND logic.",
        );
      }
      // AND 逻辑：递归添加所有子条件
      for (const cond of conditions) {
        traverse(cond);
      }
    } else {
      throw new Error("Invalid filter structure");
    }
  }

  if (Array.isArray(filters)) {
    for (const c of filters) {
      traverse(c);
    }
  }

  return params.toString();
}

export function buildSorterQuery(sorter) {
  const { sortBy, order } = sorter;
  const params = new URLSearchParams();
  const key = "_sort",
    value = order === "asc" ? sortBy : "-" + sortBy;
  params.append(key, value);
  return params.toString();
}

export function buildLimitQuery(limit) {
  const params = new URLSearchParams();
  params.append("_per_page", limit);
  return params.toString();
}

export function getStats(data, field) {
  const values = data.map((d) => d[field]);
  values.sort((a, b) => a - b);
  const min = values[0];
  const max = values[values.length - 1];
  return { min, max };
}

export function getDecimalPlaces(num) {
  const str = num + "";
  const dotIndex = str.indexOf(".");
  if (dotIndex === -1) return 0;
  return str.length - dotIndex - 1;
}

export async function binarySearchMol(params) {
  let { min, max, target, adjustedField, initFilters, filterApi } = params;
  const { field, direction, range } = adjustedField;
  const decimalPlaces = getDecimalPlaces(min);
  let low, high;
  if (direction === "increase") {
    low = range[1];
    high = max;
  } else {
    low = min;
    high = range[1];
  }
  const precisionStep = Math.pow(10, -decimalPlaces);
  let result,
    minGap = Infinity;
  while (low <= high) {
    const mid = _.round((low + high) / 2, decimalPlaces);
    const newFilters = initFilters.map((item) => {
      if (item.field === field) {
        return { ...item, value: mid };
      } else {
        return item;
      }
    });
    const query = buildFilterQuery(newFilters);
    const data = (await axios.get(`${filterApi}?${query}`)).data;
    const gap = Math.abs(data.length - target);
    if (gap < minGap) {
      minGap = gap;
      result = newFilters;
    }
    if (data.length === target) {
      return newFilters;
    } else if (data.length < target) {
      // 往分子数量增加的方向查找
      if (range[0] === null) {
        low = mid + precisionStep;
      } else {
        high = mid - precisionStep;
      }
    } else {
      // 往分子数量减少的方向查找
      if (range[1] === null) {
        low = mid + precisionStep;
      } else {
        high = mid - precisionStep;
      }
    }
  }
  return result;
}
