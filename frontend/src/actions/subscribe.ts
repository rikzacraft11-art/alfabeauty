"use server";

import { z } from "zod";
import { logger } from "@/lib/logger";

const subscribeSchema = z.object({
    email: z.string().email("Invalid email or format (id: Format email tidak valid/en: Invalid email format)"),
});

export type SubscribeState = {
    success?: boolean;
    error?: string;
    fieldErrors?: {
        email?: string[];
    };
};

export async function subscribe(
    prevState: SubscribeState | null,
    formData: FormData
): Promise<SubscribeState> {
    const email = formData.get("email");

    // validate
    const result = subscribeSchema.safeParse({ email });

    if (!result.success) {
        return {
            success: false,
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }

    // Mock Subscription (Phase 8 Debt Clean-up)
    // For V1, we log this as an operational event. 
    // In V2, replace this with Resend/Mailchimp integration.
    logger.info("Newsletter Subscription (Mock)", { email: result.data.email });

    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        success: true,
    };
}
