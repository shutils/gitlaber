import { Denops, helper } from "../../deps.ts";
import * as client from "../../client/index.ts";
import * as util from "../../util.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async assignMergeRequestAssignee(): Promise<void> {
      await assignMergeRequestMember(denops, "assignee");
    },

    async assignMergeRequestReviewer(): Promise<void> {
      await assignMergeRequestMember(denops, "reviewer");
    },
  };
}

async function assignMergeRequestMember(
  denops: Denops,
  role: "assignee" | "reviewer",
) {
  const { url, token, project } = await util.getCurrentGitlaberInstance(
    denops,
  );
  const currentNode = await util.getCurrentNode(denops);
  if (!("mr" in currentNode)) {
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
  const { iid } = currentNode.mr;
  let extraAttrs: object;
  if (role === "assignee") {
    extraAttrs = {
      assignee_id: members[labelIndex - 1].id,
    };
  } else {
    extraAttrs = {
      reviewer_ids: [members[labelIndex - 1].id],
    };
  }
  try {
    await client.requestEditMergeRequest(url, token, {
      id: project.id,
      merge_request_iid: iid,
      ...extraAttrs,
    });
    helper.echo(denops, "Successfully assine a member.");
  } catch (e) {
    helper.echoerr(denops, e.message);
  }
}
