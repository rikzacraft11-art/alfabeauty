import { describe, it, expect } from "vitest";
import { subscribe } from "./subscribe";

describe("Server Action: subscribe", () => {
    it("should return validation error for invalid email", async () => {
        const formData = new FormData();
        formData.append("email", "not-an-email");

        const result = await subscribe(null, formData);

        expect(result.success).toBe(false);
        expect(result.fieldErrors?.email).toBeDefined();
        expect(result.fieldErrors?.email?.[0]).toContain("Invalid email");
    });

    it("should return success for valid email", async () => {
        const formData = new FormData();
        formData.append("email", "test@example.com");

        const result = await subscribe(null, formData);

        expect(result.success).toBe(true);
        expect(result.fieldErrors).toBeUndefined();
    });
});
