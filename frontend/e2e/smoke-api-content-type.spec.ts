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
});
