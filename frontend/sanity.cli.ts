import { defineCliConfig } from "sanity/cli";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: process.env.SANITY_STUDIO_HOSTNAME,
  schemaExtraction: {
    enabled: true,
    enforceRequiredFields: true,
    path: "sanity/schema.json",
  },
  typegen: {
    enabled: true,
    schema: "sanity/schema.json",
    path: ["src/**/*.{ts,tsx}"],
    generates: "src/shared/types/sanity.generated.ts",
  },
});
