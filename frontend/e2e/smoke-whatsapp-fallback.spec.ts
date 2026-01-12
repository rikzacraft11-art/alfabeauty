import { expect, test } from "@playwright/test";

import { buildWhatsAppHref } from "../src/lib/whatsapp";

test("buildWhatsAppHref falls back to mailto when WA number is missing", async () => {
  const href = buildWhatsAppHref({
    number: "",
    message: "Hello",
    fallbackEmail: "hello@example.com",
  });

  expect(href).toBe("mailto:hello@example.com");
});

test("buildWhatsAppHref falls back to # when WA number and email are missing", async () => {
  const href = buildWhatsAppHref({
    number: "",
    message: "Hello",
  });

  expect(href).toBe("#");
});
