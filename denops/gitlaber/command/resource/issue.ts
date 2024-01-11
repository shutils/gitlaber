import { Denops, fn, helper, unknownutil, vars } from "../../deps.ts";
import * as client from "../../client/index.ts";
import * as util from "../../util.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async createNewProjectIssue(): Promise<void> {
      const { url, token, project } = await util.getCurrentGitlaberInstance(
        denops,
      );
      const title = await helper.input(denops, {
        prompt: "New issue title: ",
      });
      if (!title) {
        return;
      }
      try {
        await client.requestCreateNewProjectIssue(url, token, project.id, {
          id: project.id,
          title: title,
        });
        helper.echo(denops, "Successfully created a new issue.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async deleteProjectIssue(): Promise<void> {
      const { url, token, project } = await util.getCurrentGitlaberInstance(
        denops,
      );
      const currentNode = await util.getCurrentNode(denops);
      if (!("issue" in currentNode)) {
        return;
      }
      const issue_iid = currentNode.issue.iid;
      const confirm = await helper.input(denops, {
        prompt:
          `Are you sure you want to delete the issue(${issue_iid})? y/N: `,
      });
      if (confirm !== "y") {
        return;
      }
      try {
        await client.requestDeleteIssue(url, token, project.id, issue_iid);
        helper.echo(denops, "Successfully delete a issue.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async editProjectIssue(): Promise<void> {
      const { url, token, project } = await util.getCurrentGitlaberInstance(
        denops,
      );
      const description = await util.flattenBuffer(
        denops,
        await fn.bufname(denops),
      );
      const issue_iid = await vars.b.get(denops, "gitlaber_issue_iid");
      if (!unknownutil.isNumber(issue_iid)) {
        return;
      }
      try {
        await client.requestEditIssue(url, token, {
          id: project.id,
          issue_iid: issue_iid,
          description: description,
        });
        helper.echo(denops, "Successfully edit a issue.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async toggleProjectIssueState(): Promise<void> {
      const { url, token, project } = await util.getCurrentGitlaberInstance(
        denops,
      );
      const currentNode = await util.getCurrentNode(denops);
      if (!("issue" in currentNode)) {
        return;
      }
      const { iid, state } = currentNode.issue;
      let stateEvent: "close" | "reopen" = "close";
      if (state === "closed") {
        stateEvent = "reopen";
      }
      try {
        await client.requestEditIssue(url, token, {
          id: project.id,
          issue_iid: iid,
          state_event: stateEvent,
        });
        helper.echo(denops, "Successfully toggle a issue state.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async assignIssueAssignee(): Promise<void> {
      const { url, token, project } = await util.getCurrentGitlaberInstance(
        denops,
      );
      const currentNode = await util.getCurrentNode(denops);
      if (!("issue" in currentNode)) {
        return;
      }
      const members = await client.requestGetProjectMembers(url, token, {
        id: project.id,
      });
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
      const { iid } = currentNode.issue;
      try {
        await client.requestEditIssue(url, token, {
          id: project.id,
          issue_iid: iid,
          assignee_ids: [members[labelIndex - 1].id],
        });
        helper.echo(denops, "Successfully assine a member.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async addProjectIssueLabel(): Promise<void> {
      const { url, token, project } = await util.getCurrentGitlaberInstance(
        denops,
      );
      const currentNode = await util.getCurrentNode(denops);
      if (!("issue" in currentNode)) {
        return;
      }
      const labels = await client.requestGetProjectLabels(url, token, {
        id: project.id,
      });
      if (labels.length === 0) {
        helper.echo(denops, "Project has not labels.");
        return;
      }
      const description = "Select the label number you want to add.";
      const textlist: string[] = [description];
      for (let i = 0; i < labels.length; i++) {
        textlist.unshift(`${i + 1}. ${labels[i].name}`);
      }
      const { iid } = currentNode.issue;
      const labelIndex = await fn.inputlist(denops, textlist.reverse());
      if (!labelIndex) {
        return;
      }
      try {
        await client.requestEditIssue(url, token, {
          id: project.id,
          issue_iid: iid,
          add_labels: labels[labelIndex - 1]?.name ?? undefined,
        });
        helper.echo(denops, "Successfully add a issue label.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async removeProjectIssueLabel(): Promise<void> {
      const { url, token, project } = await util.getCurrentGitlaberInstance(
        denops,
      );
      const currentNode = await util.getCurrentNode(denops);
      if (!("issue" in currentNode)) {
        return;
      }
      const labels = currentNode.issue.labels;
      if (labels.length === 0) {
        helper.echo(denops, "This issue has not labels.");
        return;
      }
      const description = "Select the label number you want to remove.";
      const textlist: string[] = [description];
      for (let i = 0; i < labels.length; i++) {
        textlist.unshift(`${i + 1}. ${labels[i]}`);
      }
      const { iid } = currentNode.issue;
      const labelIndex = await fn.inputlist(denops, textlist.reverse());
      if (!labelIndex) {
        return;
      }
      try {
        await client.requestEditIssue(url, token, {
          id: project.id,
          issue_iid: iid,
          remove_labels: labels[labelIndex - 1] ?? undefined,
        });
        helper.echo(denops, "Successfully remove a issue label.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async createIssueBranch(): Promise<void> {
      const { url, token, project } = await util.getCurrentGitlaberInstance(
        denops,
      );
      const currentNode = await util.getCurrentNode(denops);
      if (!("issue" in currentNode)) {
        helper.echoerr(denops, "This node is not issue.");
        return;
      }
      const defaultBranch = project.default_branch;
      const title = currentNode.issue.title;
      const issue_iid = currentNode.issue.iid;
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
      try {
        await client.requestCreateIssueBranch(url, token, {
          id: project.id,
          branch: branch,
          ref: ref,
        });
        helper.echo(denops, "Successfully create a new branch.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },
  };
}
