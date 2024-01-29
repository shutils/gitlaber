import { unknownutil as u } from "../../deps.ts";

export const isFile = u.isObjectOf({
  file_name: u.isString,
  file_path: u.isString,
  size: u.isNumber,
  encoding: u.isString,
  content: u.isString,
  ref: u.isString,
  blob_id: u.isString,
  commit_id: u.isString,
  last_commit_id: u.isString,
  content_sha256: u.isString,
  execute_filemode: u.isBoolean,
  ...u.isUnknown,
});

export type File = u.PredicateType<typeof isFile>;
