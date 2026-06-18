import { API_BASE_URL } from "../constants/constant";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  params?: Record<string, string | number | boolean>;
  body?: unknown;
};

export const fetcher = async ({
  method = "GET",
  path,
  params,
  body,
}: FetchOptions) => {
  const accessToken = localStorage.getItem("accessToken");

  const queryString = params
    ? `?${new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString()}`
    : "";

  const response = await fetch(`${API_BASE_URL}/${path}${queryString}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "APIリクエストに失敗しました。");
  }

  return data;
};
