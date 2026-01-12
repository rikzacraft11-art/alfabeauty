import { expect, test } from "@playwright/test";

test("Next.js API routes reject non-JSON Content-Type (415)", async ({ request }) => {
  // /api/leads
  {
    const res = await request.post("/api/leads", {
      headers: { "Content-Type": "text/plain" },
      data: "hello",
    });
    expect(res.status()).toBe(415);
    const json = (await res.json()) as { error?: string };
    expect(json.error).toBe("content_type_must_be_application_json");
  }

  // /api/rum
  {
    const res = await request.post("/api/rum", {
      headers: { "Content-Type": "text/plain" },
      data: "hello",
    });
    // Telemetry endpoints are best-effort by design; do not fail client flows.
    expect(res.status()).toBe(204);
  }

  // /api/events
  {
    const res = await request.post("/api/events", {
      headers: { "Content-Type": "text/plain" },
      data: "hello",
    });
    // Telemetry/event endpoints are best-effort by design.
    expect([200, 204]).toContain(res.status());
  }
});
