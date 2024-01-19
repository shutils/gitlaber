export function validateNodeParams<T>(
  params: unknown,
  validator: (params: unknown) => boolean,
): params is T {
  if (!validator(params)) {
    throw new Error("Invalid node params.");
  }
  return true;
}
