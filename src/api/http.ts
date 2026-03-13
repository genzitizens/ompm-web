const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081";

type RequestOptions = {
  method: "GET" | "POST";
  path: string;
  body?: unknown;
  token?: string;
};

export async function request<T>({ method, path, body, token }: RequestOptions): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Request failed");
  }

  return (await response.json()) as T;
}
