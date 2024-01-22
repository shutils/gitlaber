import { Denops, unknownutil as u } from "../deps.ts";
import * as client from "../client/index.ts";

import { Context, Node, NodeParam } from "../types.ts";
import { getContext, getCurrentNode } from "../helper.ts";
// import { getKv } from "../../kv.ts";

async function makeNode(
  denops: Denops,
  callback: (
    args: Context & { node?: Node },
  ) => Promise<Node[]>,
) {
  const ctx = await getContext(denops);

  let node: Node | undefined;
  try {
    node = await getCurrentNode(denops);
  } catch {
    node = undefined;
  }
  return callback({
    ...ctx,
    node: node,
  });
}

export const createMainPanelNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (args) => {
    const { instance } = args;
    const project = instance.project;
    const nodes: Array<Node> = [];
    nodes.push({
      display: "Hint: Type g? to display the keymap for each panel.",
    });
    nodes.push({
      display: "",
    });
    nodes.push({
      display: "Main Panel",
    });
    nodes.push({
      display: "",
    });
    nodes.push({
      display: `cwd: ${instance.cwd}`,
    });
    nodes.push({
      display: `id: ${project.id}`,
    });
    nodes.push({
      display: `name: ${project.name}`,
    });
    nodes.push({
      display: `description: ${project.description}`,
    });
    nodes.push({
      display: `created_at: ${project.created_at}`,
    });
    nodes.push({
      display: `updated_at: ${project.updated_at}`,
    });
    nodes.push({
      display: `open_issues_count: ${project.open_issues_count}`,
    });
    return await Promise.resolve(nodes);
  });
};

export const createProjectIssuePanelNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (_args) => {
    const nodes: Array<Node> = [];
    nodes.push({
      display: "Project issue Panel",
    });
    return await Promise.resolve(nodes);
  });
};

export const createProjectIssuesNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (args) => {
    const { instance, url, token } = args;
    const projectIssues = await client.getProjectIssues(
      url,
      token,
      {
        id: instance.project.id,
      },
    );
    return Promise.resolve(createNodes(
      projectIssues,
      ["iid", "title", "labels", "state", "assignees"],
    ));
  });
};

export const createProjectBranchPanelNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (_args) => {
    const nodes: Array<Node> = [];
    nodes.push({
      display: "Project branch Panel",
    });
    return await Promise.resolve(nodes);
  });
};

export const createProjectBranchesNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (args) => {
    const { instance, url, token } = args;
    const projectBranches = await client.getProjectBranches(url, token, {
      id: instance.project.id,
    });
    return await Promise.resolve(
      createNodes(projectBranches, ["name", "merged"]),
    );
  });
};

export const createProjectWikiNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (args) => {
    const { instance, url, token } = args;
    const projectWikis = await client.getProjectWikis(url, token, {
      id: instance.project.id,
    });
    return await Promise.resolve(
      createNodes(projectWikis, ["title", "format"]),
    );
  });
};

export const createDescriptionNodes = async (
  denops: Denops,
  seed?: Node,
) => {
  return await makeNode(denops, async (_args) => {
    if (
      !u.isObjectOf({
        description: u.isString,
        ...u.isUnknown,
      })(seed?.params)
    ) {
      throw new Error("This node has not description.");
    }
    const nodes: Array<Node> = [];
    if (seed.params.description === null) {
      return nodes;
    }
    const lines = seed.params.description.split("\n");
    lines.map((line) => {
      nodes.push({
        display: line,
      });
    });
    return await Promise.resolve(nodes);
  });
};

export const createDescriptionEditNodes = async (
  denops: Denops,
  seed?: Node,
) => {
  return await makeNode(denops, async (_args) => {
    let params: {
      description: string;
    };
    if (
      !u.isObjectOf({
        description: u.isString,
        ...u.isUnknown,
      })(seed?.params)
    ) {
      params = {
        description: "",
      };
    } else {
      params = {
        description: seed.params.description,
      };
    }
    const nodes: Array<Node> = [];
    if (params.description === null) {
      return nodes;
    }
    const lines = params.description.split("\n");
    lines.map((line) => {
      nodes.push({
        display: line,
      });
    });
    return await Promise.resolve(nodes);
  });
};

export const createProjectWikiPanelNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (_args) => {
    const nodes: Array<Node> = [];
    nodes.push({
      display: "Project wiki Panel",
    });
    return await Promise.resolve(nodes);
  });
};

export const createContentNodes = async (
  denops: Denops,
  seed?: Node,
) => {
  return await makeNode(denops, async (_args) => {
    if (
      !u.isObjectOf({
        content: u.isString,
        ...u.isUnknown,
      })(seed?.params)
    ) {
      throw new Error("This node has not content.");
    }
    const nodes: Node[] = [];
    if (seed.params.content === null) {
      return nodes;
    }
    const lines = seed.params.content.split("\n");
    lines.map((line) => {
      nodes.push({
        display: line,
      });
    });
    return await Promise.resolve(nodes);
  });
};

export const createProjectMergeRequestPanelNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (_args) => {
    const nodes: Array<Node> = [];
    nodes.push({
      display: "Project merge request Panel",
    });
    return await Promise.resolve(nodes);
  });
};

export const createProjectMergeRequestsNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (args) => {
    const { instance, url, token } = args;
    const projectMergeRequests = await client.getProjectMergeRequestsGraphQL(
      url,
      token,
      instance.project.path_with_namespace,
      instance.project.id,
    );
    return await Promise.resolve(createNodes(
      projectMergeRequests,
      ["iid", "title", "state", "assignees", "reviewers", "approved"],
    ));
  });
};

export const createEmptyNodes = async (
  _denops: Denops,
) => {
  return await Promise.resolve([]);
};

export const createNodes = (
  resources: NodeParam[],
  columns: string[],
): Node[] => {
  const nodes: Array<Node> = [];

  const maxColumnWidths: Record<string, number> = {};
  columns.forEach((column) => {
    maxColumnWidths[column] = Math.max(column.length, 1);
    resources.forEach((resource) => {
      if (!resource) {
        return;
      }
      const prop = resource[column as keyof typeof resource];
      if (u.isObjectOf({ ...u.isUnknown })(prop)) {
        throw new Error(
          `A column has been specified that cannot be displayed: ${column}`,
        );
      }
      const value = (prop as string | Array<string> | Array<number>)
        .toString();
      const width = calculateStringWidth(value);
      if (maxColumnWidths[column] < width) {
        maxColumnWidths[column] = width;
      }
    });
  });

  let header = "";
  let separator = "";
  columns.forEach((column, index) => {
    const width = maxColumnWidths[column];
    const paddedValue = column.padEnd(width);
    const separatorLine = "-".repeat(width);
    header += index === 0 ? paddedValue : ` | ${paddedValue}`;
    separator += index === 0 ? separatorLine : ` | ${separatorLine}`;
  });
  nodes.push({
    display: `${header}`,
  });
  nodes.push({
    display: `${separator}`,
  });

  resources.forEach((resource: NodeParam) => {
    let display = "";
    columns.forEach((column, index) => {
      if (!resource) {
        return;
      }
      let value: string;
      const prop = resource[column as keyof typeof resource];
      if (
        u.isArrayOf(u.isObjectOf({
          name: u.isString,
        }))(prop)
      ) {
        value = (prop as { name: string }[]).flatMap((member) => {
          return member.name;
        }).join(", ");
      } else {
        value = (prop as string | Array<string> | Array<number>).toString();
      }
      const width = calculateStringWidth(value);
      const paddedValue = value.padEnd(
        maxColumnWidths[column] - (width - value.length),
      );
      display += index === 0 ? paddedValue : ` | ${paddedValue}`;
    });

    nodes.push({
      display,
      params: resource,
    });
  });

  return nodes;
};

const calculateStringWidth = (str: string): number => {
  let width = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (
      charCode >= 0x1100 &&
      (charCode <= 0x11FF || (charCode >= 0x2E80 && charCode <= 0xD7A3))
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
};
