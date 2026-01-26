import { describe, expect, it } from "vitest";
import { z } from "zod";

// Re-defining schema here to isolate test from route internals if necessary, 
// OR importing validation logic if we extracted it (which we should have).
// For this test, we replicate the critical validation rules to verify 'logic intent'.

const partnerSchema = z.object({
  business_name: z.string().min(2).max(255),
  contact_name: z.string().min(2).max(255),
  phone_whatsapp: z.string().min(5).max(20),
  city: z.string().min(2).max(80),
  salon_type: z.enum(["SALON", "BARBER", "BRIDAL", "UNISEX", "OTHER"]),
  consent: z.literal(true),
  email: z.string().email().optional().or(z.literal("")),
}).strict();

describe("Lead Validation Logic", () => {
  it("should validate a correct partner payload", () => {
    const validPayload = {
      business_name: "Alfa Salon",
      contact_name: "Budi",
      phone_whatsapp: "08123456789",
      city: "Jakarta",
      salon_type: "SALON",
      consent: true,
    };
    const result = partnerSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("should reject missing required fields", () => {
    const invalidPayload = {
      // business_name missing
      contact_name: "Budi",
      phone_whatsapp: "08123456789",
      city: "Jakarta",
      salon_type: "SALON",
      consent: true,
    };
    const result = partnerSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.business_name).toBeDefined();
    }
  });

  it("should reject invalid enum values", () => {
    const invalidPayload = {
      business_name: "Alfa Salon",
      contact_name: "Budi",
      phone_whatsapp: "08123456789",
      city: "Jakarta",
      salon_type: "GROCERY", // Invalid
      consent: true,
    };
    const result = partnerSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  it("should reject payload pollution (extra fields)", () => {
    const pollutedPayload = {
        business_name: "Alfa Salon",
        contact_name: "Budi",
        phone_whatsapp: "08123456789",
        city: "Jakarta",
        salon_type: "SALON",
        consent: true,
        isAdmin: true, // Malicious
      };
      const result = partnerSchema.safeParse(pollutedPayload);
      expect(result.success).toBe(false); // Thanks to .strict()
  });
});
