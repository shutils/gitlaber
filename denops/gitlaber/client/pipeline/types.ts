import { unknownutil as u } from "../../deps.ts";
import { isProjectId } from "../../types.ts";

export const isPipeline = u.isObjectOf({
  id: u.isNumber,
  iid: u.isNumber,
  project_id: isProjectId,
  status: u.isString,
  source: u.isString,
  ref: u.isString,
  sha: u.isString,
  name: u.isOptionalOf(u.isString),
  web_url: u.isString,
  created_at: u.isString,
  updated_at: u.isString,
  ...u.isUnknown,
});

export type Pipeline = u.PredicateType<typeof isPipeline>;
