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
  return await fetch(url, {
    method: method,
    headers: createHeaders(token),
    body: body,
  });
}
