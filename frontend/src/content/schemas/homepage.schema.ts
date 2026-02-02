import { z } from "zod";

export const homepageSchema = z.object({
    categoryLabels: z.object({
        en: z.record(z.string(), z.string()),
        id: z.record(z.string(), z.string()),
    }),
});

export type HomepageData = z.infer<typeof homepageSchema>;
