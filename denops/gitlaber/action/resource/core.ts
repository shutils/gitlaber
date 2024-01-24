import { autocmd, Denops, helper } from "../../deps.ts";

export async function executeRequest<T>(
  denops: Denops,
  callback: (url: string, token: string, attrs: T) => Promise<void>,
  url: string,
  token: string,
  attrs: T,
  success_msg: string,
) {
  try {
    await callback(url, token, attrs);
    helper.echo(denops, success_msg);
    autocmd.emit(denops, "User", "GitlaberRecourceUpdate");
  } catch (e) {
    helper.echoerr(denops, e.message);
  }
}

