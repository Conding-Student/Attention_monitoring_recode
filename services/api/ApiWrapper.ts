// services/api/ApiWrapper.ts

import { cookies } from "next/headers";
import crypto from "crypto";
import type { EndpointKey } from "./ApiEndpoint";
import { ENDPOINTS } from "./ApiEndpoint";
import {
  ApiRequestResult,
  createAuthError,
  createRequestError,
  type ApiResponse,
} from "./ApiHelper";
import { decryptData } from "../helper/encryption";

async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const encryptedToken = cookieStore.get("auth_token")?.value;

  if (!encryptedToken) {
    throw createAuthError("Unauthorized");
  }

  try {
    const decryptedToken = decryptData(encryptedToken);
    if (!decryptedToken) {
      throw createAuthError("Invalid session");
    }

    return decryptedToken;
  } catch (error) {
    throw createAuthError("Invalid session");
  }
}

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable is missing.`);
  }
  return value;
}

function generateHmac(body: unknown): string {
  const secret = getEnvVar("HMAC_KEY");
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

interface RequestOptions<TReq> {
  body?: TReq;
  params?: Record<string, string>;
  query?: Record<string, string>;
  headers?: Record<string, string>;
}

export async function apiRequest<TReq = unknown, TRes = unknown>(
  key: EndpointKey,
  options: RequestOptions<TReq> = {},
): Promise<ApiRequestResult<TRes>> {
  // Get Endpoint from ApiEndpoints
  const config = ENDPOINTS[key];
  // Get Domain Name on ENV
  const domain = getEnvVar("API_BASE_URL");
  // Get API Endpoint Path {public or private}
  const endpointPath = config.isPublic
    ? getEnvVar("API_BASE_URL_PUBLIC")
    : getEnvVar("API_BASE_URL_PRIVATE");
  // Full API Endpoint
  const baseUrl = `${domain}${endpointPath}`;

  // Build path with params
  let path = config.path;
  if (options.params) {
    for (const [paramKey, value] of Object.entries(options.params)) {
      path = path.replace(`:${paramKey}`, encodeURIComponent(value));
    }
  }

  // Build URL with query
  const url = new URL(`${baseUrl}${path}`);
  if (options.query) {
    for (const [queryKey, value] of Object.entries(options.query)) {
      url.searchParams.set(queryKey, value);
    }
  }

  // console.log(`API Request: ${config.method} ${url.toString()}`);

  // Setup headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Get Token from Cookies if:
  // 1. Config requires auth
  // 2. No custom Authorization header already provided
  if (config.requireAuth && !headers.Authorization) {
    const token = await getAuthToken();
    headers.Authorization = `Bearer ${token}`;
  }

  // Get Token from Cookies if Config on ApiEndpoint useHmac is true
  if (config.useHmac && options.body) {
    headers["x-signature"] = generateHmac(options.body);
  }

  // Fetch
  let response: Response;
  let result: ApiResponse<TRes>;

  try {
    response = await fetch(url.toString(), {
      method: config.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });
    result = (await response.json()) as ApiResponse<TRes>;
  } catch (err) {
    // Covers: server down, DNS failure, network timeout, invalid JSON response
    throw err;
  }

  // console.log("API Response:", result.retCode);

  if (result.retCode === "104") {
    throw createAuthError(result.message);
  }

  if (!response.ok) {
    // console.log("API Request Error:", response.status);
    throw createRequestError(
      result.message || `HTTP ${response.status}`,
      response.status,
      result.retCode,
    );
  }

  // ✅ Only reached on success
  return { data: result, status: response.status };
}

export interface RawRequestResult {
  body: string;
  headers: Headers;
  status: number;
}

export async function apiRequestRaw<TReq = unknown>(
  key: EndpointKey,
  options: RequestOptions<TReq> = {},
): Promise<RawRequestResult> {
  const config = ENDPOINTS[key];
  const domain = getEnvVar("API_BASE_URL");
  const endpointPath = config.isPublic
    ? getEnvVar("API_BASE_URL_PUBLIC")
    : getEnvVar("API_BASE_URL_PRIVATE");
  const baseUrl = `${domain}${endpointPath}`;

  let path = config.path;
  if (options.params) {
    for (const [k, v] of Object.entries(options.params)) {
      path = path.replace(`:${k}`, encodeURIComponent(v));
    }
  }

  const url = new URL(`${baseUrl}${path}`);
  if (options.query) {
    for (const [k, v] of Object.entries(options.query)) {
      url.searchParams.set(k, v);
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (config.requireAuth && !headers.Authorization) {
    const token = await getAuthToken();
    headers.Authorization = `Bearer ${token}`;
  }

  if (config.useHmac && options.body) {
    headers["x-signature"] = generateHmac(options.body);
  }

  const response = await fetch(url.toString(), {
    method: config.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    // Try to read an error message if the backend sends JSON on failure
    let message = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      message = err.message ?? message;
    } catch {}
    throw createRequestError(message, response.status);
  }

  const body = await response.text();
  console.log("API Response Body:", body);
  return { body, headers: response.headers, status: response.status };
}
