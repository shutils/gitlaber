import { Denops, fn, helper, unknownutil, vars } from "../../deps.ts";
import * as client from "../../client/index.ts";
import * as util from "../../util.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,

    async createNewProjectIssue(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const title = await helper.input(denops, {
        prompt: "New issue title: ",
      });
      if (!title) {
        return;
      }
      try {
        await client.requestCreateNewProjectIssue(url, token, projectId, {
          id: projectId,
          title: title,
        });
        helper.echo(denops, "Successfully created a new issue.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async deleteProjectIssue(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
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
        await client.requestDeleteIssue(url, token, projectId, issue_iid);
        helper.echo(denops, "Successfully delete a issue.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async editProjectIssue(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
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
          id: projectId,
          issue_iid: issue_iid,
          description: description,
        });
        helper.echo(denops, "Successfully edit a issue.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async createNewBranchMr(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const currentNode = await util.getCurrentNode(denops);
      if (!("branch" in currentNode)) {
        helper.echoerr(denops, "This node is not branch.");
        return;
      }
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const currentBranch = currentNode.branch.name;
      const commitId = currentNode.branch.commit.short_id;
      const commit = await client.requestGetCommit(url, token, {
        id: projectId,
        sha: commitId,
      });
      const defaultTitle = commit.title;
      const defaultBranch = currentGitlaberInstance.project.default_branch;
      const terget = await helper.input(denops, {
        prompt: "Terget branch: ",
        text: defaultBranch,
      });
      if (!terget) {
        return;
      }
      const title = await helper.input(denops, {
        prompt: "Merge request title: ",
        text: defaultTitle,
      });
      if (!title) {
        return;
      }
      const confirm = await helper.input(denops, {
        prompt:
          `Are you sure you want to create a merge request? (${currentBranch} into ${terget}) y/N: `,
      });
      if (confirm !== "y") {
        return;
      }
      try {
        await client.requestCreateMergeRequest(url, token, {
          id: projectId,
          title: title,
          source_branch: currentBranch,
          target_branch: terget,
        });
        helper.echo(denops, "Successfully created a new merge request.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async createProjectNewWiki(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const content = await util.flattenBuffer(
        denops,
        await fn.bufname(denops),
      );
      const title = await vars.b.get(denops, "gitlaber_new_wiki_title");
      if (!unknownutil.isString(title)) {
        return;
      }
      try {
        await client.requestCreateNewProjectWiki(url, token, {
          id: projectId,
          title: title,
          content: content,
        });
        helper.echo(denops, "Successfully create a new wiki.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async editProjectWiki(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const content = await util.flattenBuffer(
        denops,
        await fn.bufname(denops),
      );
      const title = await vars.b.get(denops, "gitlaber_wiki_title");
      if (!unknownutil.isString(title)) {
        return;
      }
      const slug = await vars.b.get(denops, "gitlaber_wiki_slug");
      if (!unknownutil.isString(slug)) {
        return;
      }
      let commitMessage = await helper.input(denops, {
        prompt: `Please enter your commit message: `,
        text: `Update ${title}`,
      });
      if (!unknownutil.isString(commitMessage)) {
        commitMessage = "";
      }
      try {
        await client.requestEditWiki(url, token, {
          id: projectId,
          title: title,
          content: content,
          slug: slug,
          message: commitMessage,
        });
        helper.echo(denops, "Successfully edit a wiki.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async deleteProjectWiki(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const currentWiki = await util.getCurrentNode(denops);
      if (!("wiki" in currentWiki)) {
        return;
      }
      const slug = currentWiki.wiki.slug;
      const title = currentWiki.wiki.title;
      const confirm = await helper.input(denops, {
        prompt: `Are you sure you want to delete the wiki(${title})? y/N: `,
      });
      if (confirm !== "y") {
        return;
      }
      try {
        await client.requestDeleteWiki(url, token, {
          id: projectId,
          slug: slug,
        });
        helper.echo(denops, "Successfully delete a wiki.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async createIssueBranch(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const currentNode = await util.getCurrentNode(denops);
      if (!("issue" in currentNode)) {
        helper.echoerr(denops, "This node is not issue.");
        return;
      }
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const defaultBranch = currentGitlaberInstance.project.default_branch;
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
          id: projectId,
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
