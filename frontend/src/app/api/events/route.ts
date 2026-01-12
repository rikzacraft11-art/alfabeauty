import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const baseUrl = process.env.LEAD_API_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { error: "lead_api_not_configured" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  const ct = req.headers.get("content-type") ?? "";
  if (!ct.toLowerCase().startsWith("application/json")) {
    return NextResponse.json(
      { error: "content_type_must_be_application_json" },
      { status: 415, headers: { "Cache-Control": "no-store" } },
    );
  }

  const body = await req.text();
  if (!body) {
    return NextResponse.json(
      { error: "empty_body" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const url = `${baseUrl.replace(/\/$/, "")}/api/v1/events`;

  // Forward selected client context headers so the Lead API can apply IP/user-agent
  // signals correctly when TRUSTED_PROXIES is configured.
  const ua = req.headers.get("user-agent");
  const xff = req.headers.get("x-forwarded-for");
  const xri = req.headers.get("x-real-ip");

  const upstream = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(ua ? { "User-Agent": ua } : {}),
      ...(xff ? { "X-Forwarded-For": xff } : {}),
      ...(xri ? { "X-Real-IP": xri } : {}),
    },
    body,
    // Telemetry should be best-effort and fast.
    signal: AbortSignal.timeout(2000),
  }).catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : "upstream_error";
    return new Response(JSON.stringify({ error: "lead_api_unreachable", detail: msg }), {
      status: 502,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  });

  if (upstream.status === 204) {
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  }

  const text = await upstream.text();
  const contentType = upstream.headers.get("Content-Type") ?? "application/json; charset=utf-8";
  return new Response(text, {
    status: upstream.status,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
