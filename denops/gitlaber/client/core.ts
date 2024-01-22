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
    case http.Status.Created:
    case http.Status.NoContent:
      break;
    default:
      throw new Error(`HTTP request failed. status: ${res.status}`);
  }
  return await res.json()
}
