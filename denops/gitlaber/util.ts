import { Denops, fn, helper, path } from "./deps.ts";

export const flattenBuffer = async (denops: Denops, bufname: string) => {
  const lines = await fn.getbufline(
    denops,
    bufname,
    1,
    "$",
  );
  return lines.join("\n");
};

export function select(
  denops: Denops,
  contents: string[],
  description: string,
) {
  const texts = [description, ...contents.reverse()];
  return fn.inputlist(denops, texts);
}

export function escapeSlash(str: string) {
  return str.replaceAll("/", "%2F");
}

export async function getBufferWindowId(denops: Denops, bufnr: number) {
  const bufInfos = await fn.getbufinfo(denops, bufnr);
  if (!await bufferHasWindow(denops, bufnr)) {
    helper.echoerr(denops, "That buffer is not visible in the window.");
  }
  return bufInfos[0].windows[0];
}

export async function focusBuffer(denops: Denops, bufnr: number) {
  const winnr = await getBufferWindowId(denops, bufnr);
  await fn.win_gotoid(denops, winnr);
}

export async function bufferHasWindow(denops: Denops, bufnr: number) {
  const bufInfos = await fn.getbufinfo(denops, bufnr);
  return !(bufInfos[0].windows.length === 0);
}

export function predicateFileType(filename: string) {
  const ext = path.extname(filename);
  const filetypeMap = [
    { ext: ".md", filetype: "markdown" },
    { ext: ".yaml", filetype: "yaml" },
    { ext: ".yml", filetype: "yaml" },
    { ext: ".json", filetype: "json" },
    { ext: ".toml", filetype: "toml" },
    { ext: ".html", filetype: "html" },
    { ext: ".css", filetype: "css" },
    { ext: ".scss", filetype: "scss" },
    { ext: ".js", filetype: "javascript" },
    { ext: ".ts", filetype: "typescript" },
    { ext: ".tsx", filetype: "typescriptreact" },
    { ext: ".jsx", filetype: "javascriptreact" },
    { ext: ".py", filetype: "python" },
    { ext: ".go", filetype: "go" },
    { ext: ".java", filetype: "java" },
    { ext: ".c", filetype: "c" },
    { ext: ".cpp", filetype: "cpp" },
    { ext: ".h", filetype: "cpp" },
    { ext: ".hpp", filetype: "cpp" },
    { ext: ".rs", filetype: "rust" },
    { ext: ".sh", filetype: "sh" },
    { ext: ".vim", filetype: "vim" },
    { ext: ".lua", filetype: "lua" },
    { ext: ".sql", filetype: "sql" },
    { ext: ".php", filetype: "php" },
    { ext: ".rb", filetype: "ruby" },
    { ext: ".ex", filetype: "elixir" },
    { ext: ".exs", filetype: "elixir" },
    { ext: ".vue", filetype: "vue" },
  ];
  return filetypeMap.find((map) => map.ext === ext)?.filetype;
}
