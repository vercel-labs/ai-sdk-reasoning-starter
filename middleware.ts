import { NextResponse, type NextRequest, NextFetchEvent } from "next/server";
import { kasadaHandler } from "./lib/kasada/kasada-server";
import { kv } from "@vercel/kv";
import { ipAddress } from "@vercel/functions";

const corsOptions: {
  allowedMethods: string[];
  allowedOrigins: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge?: number;
  credentials: boolean;
} = {
  allowedMethods: (process.env?.ALLOWED_METHODS || "").split(","),
  allowedOrigins: (process.env?.ALLOWED_ORIGIN || "").split(","),
  allowedHeaders: (process.env?.ALLOWED_HEADERS || "").split(","),
  exposedHeaders: (process.env?.EXPOSED_HEADERS || "").split(","),
  maxAge:
    (process.env?.PREFLIGHT_MAX_AGE &&
      parseInt(process.env?.PREFLIGHT_MAX_AGE)) ||
    undefined,
  credentials: process.env?.CREDENTIALS == "true",
};

const MAX_REQUESTS = 80;

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Start with the CORS logic
  const response = NextResponse.next();

  // Allowed origins check
  const origin = req.headers.get("origin") ?? "";
  if (
    corsOptions.allowedOrigins.includes("*") ||
    corsOptions.allowedOrigins.includes(origin)
  ) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  // Set default CORS headers
  response.headers.set(
    "Access-Control-Allow-Credentials",
    corsOptions.credentials.toString(),
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    corsOptions.allowedMethods.join(","),
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    corsOptions.allowedHeaders.join(","),
  );
  response.headers.set(
    "Access-Control-Expose-Headers",
    corsOptions.exposedHeaders.join(","),
  );
  response.headers.set(
    "Access-Control-Max-Age",
    corsOptions.maxAge?.toString() ?? "",
  );

  // Rate limiting and Kasada logic for POST requests
  if (req.method === "POST") {
    if (process.env.NODE_ENV === "development") {
      return undefined;
    }

    const realIp = ipAddress(req) ?? "no-ip";
    const pipeline = kv.pipeline();
    pipeline.incr(`rate-limit:${realIp}`);
    pipeline.expire(`rate-limit:${realIp}`, 60 * 60 * 24, "NX");
    const [requests] = (await pipeline.exec()) as [number];

    if (requests > MAX_REQUESTS) {
      return new Response("Too many requests (rate limit)", { status: 429 });
    }

    // Apply Kasada handler
    return kasadaHandler(req, ev);
  }

  return response;
}

export const config = {
  matcher: ["/", "/api/chat"],
};
