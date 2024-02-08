import { unknownutil as u } from "../../deps.ts";

export const isJob = u.isObjectOf({
  id: u.isNumber,
  name: u.isString,
  web_url: u.isString,
  status: u.isString,
  stage: u.isString,
  ref: u.isString,
  created_at: u.isString,
});

export type Job = u.PredicateType<typeof isJob>;
