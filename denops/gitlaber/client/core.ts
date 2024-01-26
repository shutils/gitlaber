import { http } from "../deps.ts";

type Method = "GET" | "POST" | "PUT" | "DELETE";

function createHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    "PRIVATE-TOKEN": token,
  };
}

export async function request(
  url: string,
  token: string,
  method?: Method,
  body?: string,
) {
  const res = await fetch(url, {
    method: method,
    headers: createHeaders(token),
    body: body,
  });
  switch (res.status) {
    case http.Status.OK:
      return await res.json();
    case http.Status.Created:
      return;
    case http.Status.NoContent:
      return;
    default:
      throw new Error(
        `HTTP request failed. status: ${res.status} ${
          Deno.inspect(await res.json(), { depth: Infinity })
        }`,
      );
  }
}
