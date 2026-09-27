export const actions = {
  // 项目管理
  show_project_list: {
    description: "查看/打开/列出项目列表",
    parameters: {},
    examples: [
      {
        input: "查看项目列表",
        output: {
          type: "show_project_list",
          parameters: {},
        },
      },
      {
        input: "打开项目列表",
        output: {
          type: "show_project_list",
          parameters: {},
        },
      },
    ],
  },
  create_project: {
    description: "创建项目",
    parameters: {},
    examples: [
      {
        input: "创建项目",
        output: {
          type: "create_project",
          parameters: {},
        },
      },
    ],
  },
  edit_project: {
    description: "编辑项目",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
    },
    examples: [
      {
        input: "编辑项目，ID是123",
        output: {
          type: "edit_project",
          parameters: {
            project_id: 123,
          },
        },
      },
    ],
  },
  view_project: {
    description: "查看项目",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
    },
    examples: [
      {
        input: "查看项目，ID是123",
        output: {
          type: "view_project",
          parameters: {
            project_id: 123,
          },
        },
      },
    ],
  },
  search_project: {
    description: "搜索项目",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID（可选）",
      },
      project_name: {
        type: "string",
        description: "项目名称（可选）",
      },
    },
    examples: [
      {
        input: "搜索项目，ID是123",
        output: {
          type: "search_project",
          parameters: {
            project_id: 123,
          },
        },
      },
    ],
  },
  star_project: {
    description: "收藏项目",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
    },
    examples: [
      {
        input: "收藏项目，ID是123",
        output: {
          type: "star_project",
          parameters: {
            project_id: 123,
          },
        },
      },
    ],
  },
  freeze_project: {
    description: "冻结项目",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
    },
    examples: [
      {
        input: "冻结项目，ID是123",
        output: {
          type: "freeze_project",
          parameters: {
            project_id: 123,
          },
        },
      },
    ],
  },

  // 数据管理
  show_entry_list: {
    description: "查看/打开/列出某个项目下的Entry List",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
    },
    examples: [
      {
        input: "查看项目123的Entry List",
        output: {
          type: "show_entry_list",
          parameters: {
            project_id: 123,
          },
        },
      },
    ],
  },
  upload_molecule: {
    description: "上传分子/数据",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
      molecule_type: {
        type: "string",
        description:
          "分子类型，包括蛋白质（protein）、配体（ligand）和微扰图（perturbation_map）这三种",
      },
    },
    examples: [
      {
        input: "上传蛋白质，项目ID是123",
        output: {
          type: "upload_molecule",
          parameters: {
            project_id: 123,
            molecule_type: "protein",
          },
        },
      },
    ],
  },
  search_entry: {
    description: "查找某个Entry（某个数据项，例如蛋白质、配体组、微扰图等）",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
      entry_id: {
        type: "number",
        description: "entry的ID（可选）",
      },
      entry_name: {
        type: "string",
        description: "entry名称（可选）",
      },
    },
    examples: [
      {
        input: "查找项目123的Entry，ID是400",
        output: {
          type: "search_entry",
          parameters: {
            project_id: 123,
            entry_id: 400,
          },
        },
      },
    ],
  },
  view_entry: {
    description: "查看entry（蛋白质、配体组或微扰图）",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
      entry_id: {
        type: "number",
        description: "Entry ID",
      },
    },
    examples: [
      {
        input: "查看蛋白质，项目ID是123，Entry ID是400",
        output: {
          type: "view_entry",
          parameters: {
            project_id: 123,
            entry_id: 400,
          },
        },
      },
    ],
  },
  delete_entry: {
    description: "删除entry（蛋白质、配体组或微扰图）",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
      entry_id: {
        type: "number",
        description: "Entry ID",
      },
    },
    examples: [
      {
        input: "删除蛋白质，项目ID是123，Entry ID是400",
        output: {
          type: "delete_entry",
          parameters: {
            project_id: 123,
            entry_id: 400,
          },
        },
      },
    ],
  },

  // 任务管理
  show_task_list: {
    description: "查看/打开/列出任务列表",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
    },
    examples: [
      {
        input: "查看项目123的任务列表",
        output: {
          type: "show_task_list",
          parameters: {
            project_id: 123,
          },
        },
      },
    ],
  },
  create_task: {
    description: "创建任务/提交任务/发起任务",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
      task_type: {
        type: "string",
        description: "任务类型，包括MD、ABFEP、RBFEP这三种",
      },
      task_step: {
        type: "string",
        description:
          "任务步骤，MD任务有3个步骤：蛋白质准备（protein_preparation）、配体准备（ligand_preparation）、提交MD任务（submit）；ABFEP任务有4个步骤：蛋白质准备（protein_preparation）、配体准备（ligand_preparation）、提交ABFEP任务（submit）、校正（correct）；RBFEP任务有6个步骤：蛋白质准备（protein_preparation）、配体对齐（ligand_alignment）、配体准备（ligand_preparation）、生成微扰图（perturbation_map）、提交RBFEP任务（submit）、校正（correct）",
      },
    },
    examples: [
      {
        input: "MD任务的蛋白质准备，项目ID是123",
        output: {
          type: "create_task",
          parameters: {
            project_id: 123,
            task_type: "MD",
            task_step: "protein_preparation",
          },
        },
      },
      {
        input: "提交RBFEP任务，项目ID是123",
        output: {
          type: "create_task",
          parameters: {
            project_id: 123,
            task_type: "RBFEP",
            task_step: "submit",
          },
        },
      },
    ],
  },
  show_task_result: {
    description: "查看任务结果",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
      task_id: {
        type: "number",
        description: "任务ID",
      },
    },
    examples: [
      {
        input: "查看任务ID为600的结果，项目ID是123",
        output: {
          type: "show_task_result",
          parameters: {
            project_id: 123,
            task_id: 600,
          },
        },
      },
    ],
  },
  search_task: {
    description: "搜索/查找任务",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
      task_id: {
        type: "number",
        description: "任务ID（可选）",
      },
      task_name: {
        type: "string",
        description: "任务名称（可选）",
      },
    },
    examples: [
      {
        input: "搜索项目123的任务，ID是600",
        output: {
          type: "search_task",
          parameters: {
            project_id: 123,
            task_id: 600,
          },
        },
      },
    ],
  },
  stop_task: {
    description: "停止任务",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
      task_id: {
        type: "number",
        description: "任务ID",
      },
    },
    examples: [
      {
        input: "停止ID为600的任务，项目是123",
        output: {
          type: "stop_task",
          parameters: {
            project_id: 123,
            task_id: 600,
          },
        },
      },
    ],
  },
  restart_task: {
    description: "重启任务",
    parameters: {
      project_id: {
        type: "number",
        description: "项目ID",
      },
      task_id: {
        type: "number",
        description: "任务ID",
      },
    },
    examples: [
      {
        input: "重启ID为600的任务，项目是123",
        output: {
          type: "restart_task",
          parameters: {
            project_id: 123,
            task_id: 600,
          },
        },
      },
    ],
  },

  // 工作区管理
  show_workspace_list: {
    description: "查看/打开/列出工作区列表",
    parameters: {},
    examples: [
      {
        input: "查看工作区列表",
        output: {
          type: "show_workspace_list",
          parameters: {},
        },
      },
    ],
  },
  save_workspace: {
    description: "保存/分享工作区",
    parameters: {},
    examples: [
      {
        input: "保存工作区",
        output: {
          type: "save_workspace",
          parameters: {},
        },
      },
    ],
  },
  open_workspace: {
    description: "打开/查看工作区",
    parameters: {
      workspace_id: {
        type: "string",
        description: "工作区ID",
      },
    },
    examples: [
      {
        input: "打开工作区，ID是abc",
        output: {
          type: "open_workspace",
          parameters: {
            workspace_id: "abc",
          },
        },
      },
    ],
  },
  search_workspace: {
    description: "搜索工作区",
    parameters: {
      workspace_id: {
        type: "string",
        description: "工作区ID",
      },
    },
    examples: [
      {
        input: "搜索工作区，ID是abc",
        output: {
          type: "search_workspace",
          parameters: {
            workspace_id: "abc",
          },
        },
      },
    ],
  },
  delete_workspace: {
    description: "删除工作区",
    parameters: {
      workspace_id: {
        type: "string",
        description: "工作区ID",
      },
    },
    examples: [
      {
        input: "删除工作区，ID是abc",
        output: {
          type: "delete_workspace",
          parameters: {
            workspace_id: "abc",
          },
        },
      },
    ],
  },

  // 分子筛选
  filter_molecules: {
    description: "筛选分子",
    parameters: {
      user_goal: {
        type: "string",
        description: "用户的筛选目标",
      },
    },
    examples: [
      {
        input: "筛选100个分子，要求分子量小于500，logP在1~3",
        output: {
          type: "filter_molecules",
          parameters: {
            user_goal: "筛选100个分子，要求分子量小于500，logP在1~3",
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
