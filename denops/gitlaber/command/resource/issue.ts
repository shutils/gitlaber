import { Denops, fn, helper, unknownutil, vars } from "../../deps.ts";
import * as client from "../../client/index.ts";
import * as util from "../../util.ts";
import { getCtx } from "../../core.ts";
import { executeRequest } from "./main.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async createNewProjectIssue(): Promise<void> {
      const ctx = await getCtx(denops);
      const { project, url, token } = ctx.instance;
      const title = await helper.input(denops, {
        prompt: "New issue title: ",
      });
      if (!title) {
        return;
      }
      await executeRequest(
        denops,
        client.requestCreateNewProjectIssue,
        url,
        token,
        {
          id: project.id,
          title: title,
        },
        "Successfully created a new issue.",
        "issue",
      );
    },

    async deleteProjectIssue(): Promise<void> {
      const ctx = await getCtx(denops);
      const { current_node, instance } = ctx;
      if (!(client.isIssue(current_node.resource))) {
        helper.echo(denops, "This node is not an issue.");
        return;
      }
      const issue_iid = current_node.resource.iid;
      const confirm = await helper.input(denops, {
        prompt:
          `Are you sure you want to delete the issue(${issue_iid})? y/N: `,
      });
      if (confirm !== "y") {
        return;
      }
      await executeRequest(
        denops,
        client.requestDeleteIssue,
        instance.url,
        instance.token,
        {
          id: instance.project.id,
          issue_iid: issue_iid,
        },
        "Successfully delete a issue.",
        "issue",
      );
    },

    async editProjectIssue(): Promise<void> {
      const ctx = await getCtx(denops);
      const { project, url, token } = ctx.instance;
      const description = await util.flattenBuffer(
        denops,
        await fn.bufname(denops),
      );
      const issue_iid = await vars.b.get(denops, "gitlaber_issue_iid");
      if (!unknownutil.isNumber(issue_iid)) {
        return;
      }
      await executeRequest(
        denops,
        client.requestEditIssue,
        url,
        token,
        {
          id: project.id,
          issue_iid: issue_iid,
          description: description,
        },
        "Successfully edit a issue.",
        "issue",
      );
    },

    async toggleProjectIssueState(): Promise<void> {
      const ctx = await getCtx(denops);
      const { current_node, instance } = ctx;
      if (!(client.isIssue(current_node.resource))) {
        helper.echo(denops, "This node is not an issue.");
        return;
      }
      const { iid, state } = current_node.resource;
      let stateEvent: "close" | "reopen" = "close";
      if (state === "closed") {
        stateEvent = "reopen";
      }
      await executeRequest(
        denops,
        client.requestEditIssue,
        instance.url,
        instance.token,
        {
          id: instance.project.id,
          issue_iid: iid,
          state_event: stateEvent,
        },
        "Successfully toggle a issue state.",
        "issue",
      );
    },

    async assignIssueAssignee(): Promise<void> {
      const ctx = await getCtx(denops);
      const { current_node, instance } = ctx;
      if (!(client.isIssue(current_node.resource))) {
        helper.echo(denops, "This node is not an issue.");
        return;
      }
      const members = await client.requestGetProjectMembers(
        instance.url,
        instance.token,
        {
          id: instance.project.id,
        },
      );
      if (members.length === 0) {
        helper.echo(denops, "Project has not members.");
        return;
      }
      const description = "Select the member number you want to assign.";
      const contents: string[] = [];
      for (let i = 0; i < members.length; i++) {
        contents.unshift(`${i + 1}. ${members[i].name}`);
      }
      const labelIndex = await util.select(denops, contents, description);
      if (!labelIndex) {
        return;
      }
      const { iid } = current_node.resource;
      await executeRequest(
        denops,
        client.requestEditIssue,
        instance.url,
        instance.token,
        {
          id: instance.project.id,
          issue_iid: iid,
          assignee_ids: [members[labelIndex - 1].id],
        },
        "Successfully toggle a issue state.",
        "issue",
      );
    },

    async addProjectIssueLabel(): Promise<void> {
      const ctx = await getCtx(denops);
      const { current_node, instance } = ctx;
      if (!(client.isIssue(current_node.resource))) {
        helper.echo(denops, "This node is not an issue.");
        return;
      }
      const labels = await client.requestGetProjectLabels(
        instance.url,
        instance.token,
        {
          id: instance.project.id,
        },
      );
      if (labels.length === 0) {
        helper.echo(denops, "Project has not labels.");
        return;
      }
      const description = "Select the label number you want to add.";
      const textlist: string[] = [description];
      for (let i = 0; i < labels.length; i++) {
        textlist.unshift(`${i + 1}. ${labels[i].name}`);
      }
      const { iid } = current_node.resource;
      const labelIndex = await fn.inputlist(denops, textlist.reverse());
      if (!labelIndex) {
        return;
      }
      await executeRequest(
        denops,
        client.requestEditIssue,
        instance.url,
        instance.token,
        {
          id: instance.project.id,
          issue_iid: iid,
          add_labels: labels[labelIndex - 1].name,
        },
        "Successfully toggle a issue state.",
        "issue",
      );
    },

    async removeProjectIssueLabel(): Promise<void> {
      const ctx = await getCtx(denops);
      const { current_node, instance } = ctx;
      if (!(client.isIssue(current_node.resource))) {
        helper.echo(denops, "This node is not an issue.");
        return;
      }
      const labels = current_node.resource.labels;
      if (labels.length === 0) {
        helper.echo(denops, "This issue has not labels.");
        return;
      }
      const description = "Select the label number you want to remove.";
      const textlist: string[] = [description];
      for (let i = 0; i < labels.length; i++) {
        textlist.unshift(`${i + 1}. ${labels[i]}`);
      }
      const { iid } = current_node.resource;
      const labelIndex = await fn.inputlist(denops, textlist.reverse());
      if (!labelIndex) {
        return;
      }
      await executeRequest(
        denops,
        client.requestEditIssue,
        instance.url,
        instance.token,
        {
          id: instance.project.id,
          issue_iid: iid,
          remove_labels: labels[labelIndex - 1],
        },
        "Successfully remove a issue label.",
        "issue",
      );
    },

    async createIssueBranch(): Promise<void> {
      const ctx = await getCtx(denops);
      const { current_node, instance } = ctx;
      if (!(client.isIssue(current_node.resource))) {
        helper.echo(denops, "This node is not an issue.");
        return;
      }
      const defaultBranch = instance.project.default_branch;
      const title = current_node.resource.title;
      const issue_iid = current_node.resource.iid;
      const branch = await helper.input(denops, {
        prompt: "New branch name: ",
        text: `${issue_iid}-${title}`,
      });
      if (!branch) {
        return;
      }
      const ref = await helper.input(denops, {
        prompt: "Ref branch name: ",
        text: defaultBranch,
      });
      if (!ref) {
        return;
      }
      await executeRequest(
        denops,
        client.requestCreateIssueBranch,
        instance.url,
        instance.token,
        {
          id: instance.project.id,
          branch: branch,
          ref: ref,
        },
        "Successfully create a new branch.",
        "branch",
      );
    },
  };
}
