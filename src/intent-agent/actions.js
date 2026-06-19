export const actions = {
  showProjectList: {
    description: "查看/打开/列出项目列表",
    parameters: {},
    examples: [
      {
        input: "查看项目列表",
        output: {
          type: "showProjectList",
          parameters: {},
        },
      },
      {
        input: "打开项目列表",
        output: {
          type: "showProjectList",
          parameters: {},
        },
      },
    ],
  },
  createProject: {
    description: "创建项目",
    parameters: {},
    examples: [
      {
        input: "创建项目",
        output: {
          type: "createProject",
          parameters: {},
        },
      },
    ],
  },
  showEntryList: {
    description: "查看/打开/列出某个项目下的Entry List",
    parameters: {
      projectId: {
        type: "number",
        description: "项目ID",
      },
    },
    examples: [
      {
        input: "查看项目123的Entry List",
        output: {
          type: "showEntryList",
          parameters: {
            projectId: 123,
          },
        },
      },
    ],
  },
  uploadMolecule: {
    description: "上传分子/数据",
    parameters: {
      projectId: {
        type: "number",
        description: "项目ID",
      },
      moleculeType: {
        type: "string",
        description:
          "分子类型，包括蛋白质（protein）、共晶分子（cocrystal）和配体（ligand）这三种",
      },
    },
    examples: [
      {
        input: "上传蛋白质，项目ID是123",
        output: {
          type: "uploadMolecule",
          parameters: {
            projectId: 123,
            moleculeType: "protein",
          },
        },
      },
    ],
  },
  viewEntry: {
    description: "查看entry（蛋白质、配体组或微扰图）",
    parameters: {
      projectId: {
        type: "number",
        description: "项目ID",
      },
      entryId: {
        type: "number",
        description: "Entry ID",
      },
      moleculeType: {
        type: "string",
        description:
          "分子类型，包括蛋白质（protein）、配体组（ligand）和微扰图（perturbationMap）这三种",
      },
    },
    examples: [
      {
        input: "查看蛋白质，项目ID是123，Entry ID是401",
        output: {
          type: "viewEntry",
          parameters: {
            projectId: 123,
            entryId: 401,
            moleculeType: "protein",
          },
        },
      },
    ],
  },
  submitTask: {
    description: "提交任务，发起任务",
    parameters: {
      projectId: {
        type: "number",
        description: "项目ID",
      },
      taskType: {
        type: "string",
        description: "任务类型，包括MD、ABFEP、RBFEP这三种",
      },
      taskStep: {
        type: "string",
        description:
          "任务步骤，MD任务有3个步骤：蛋白质准备（proteinPreparation）、配体准备（ligandPreparation）、提交MD任务（submit）；ABFEP任务有4个步骤：蛋白质准备（proteinPreparation）、配体准备（ligandPreparation）、提交ABFEP任务（submit）、校正（correct）；ABFEP任务有6个步骤：蛋白质准备（proteinPreparation）、配体对齐（ligandAlignment）、配体准备（ligandPreparation）、生成微扰图（perturbationMap）、提交RBFEP任务（submit）、校正（correct）",
      },
    },
    examples: [
      {
        input: "提交RBFEP任务，任务ID是123",
        output: {
          type: "submitTask",
          parameters: {
            projectId: 123,
            taskType: "RBFEP",
            taskStep: "submit",
          },
        },
      },
      {
        input: "MD任务，蛋白质准备，任务ID是123",
        output: {
          type: "submitTask",
          parameters: {
            projectId: 123,
            taskType: "MD",
            taskStep: "proteinPreparation",
          },
        },
      },
    ],
  },
  showTaskList: {
    description: "查看/打开/列出任务列表",
    parameters: {
      projectId: {
        type: "number",
        description: "项目ID",
      },
    },
    examples: [
      {
        input: "查看项目123的任务列表",
        output: {
          type: "showTaskList",
          parameters: {
            projectId: 123,
          },
        },
      },
    ],
  },
  showTaskResult: {
    description: "查看任务结果",
    parameters: {
      projectId: {
        type: "number",
        description: "项目ID",
      },
      taskId: {
        type: "number",
        description: "任务ID",
      },
    },
    examples: [
      {
        input: "查看任务ID为1001的结果，项目ID是123",
        output: {
          type: "showTaskResult",
          parameters: {
            projectId: 123,
            taskId: 1001,
          },
        },
      },
    ],
  },
  postProcessing: {
    description: "任务的后处理分析",
    parameters: {
      projectId: {
        type: "number",
        description: "项目ID",
      },
      taskId: {
        type: "number",
        description: "任务ID",
      },
    },
    examples: [
      {
        input: "后处理，任务是1001，项目是123",
        output: {
          type: "postProcessing",
          parameters: {
            projectId: 123,
            taskId: 1001,
          },
        },
      },
    ],
  },
  filterMolecules: {
    description: "筛选分子",
    parameters: {
      userGoal: {
        type: "string",
        description: "用户的筛选目标",
      },
    },
    examples: [
      {
        input: "筛选100个分子，要求分子量小于500，logP在1~3",
        output: {
          type: "filterMolecules",
          parameters: {
            userGoal: "筛选100个分子，要求分子量小于500，logP在1~3",
          },
        },
      },
    ],
  },
};

export function buildActionsPrompt() {
  let prompt = "";
  for (const [type, def] of Object.entries(actions)) {
    prompt += `- **${type}**: ${def.description}\n`;
    prompt += `  参数: ${JSON.stringify(def.parameters, null, 2)}\n`;
    prompt += `  示例: ${JSON.stringify(def.examples, null, 2)}\n\n`;
  }
  return prompt;
}
