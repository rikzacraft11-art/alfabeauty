import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

function requireStudioEnv(name: string, fallbackName?: string): string {
  const value = process.env[name] ?? (fallbackName ? process.env[fallbackName] : undefined);
  if (!value) {
    throw new Error(`Missing required Studio environment variable: ${name}`);
  }
  return value;
}

const projectId = requireStudioEnv(
  "SANITY_STUDIO_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);
const dataset = requireStudioEnv(
  "SANITY_STUDIO_DATASET",
  "NEXT_PUBLIC_SANITY_DATASET",
);
const previewOrigin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN ?? "http://localhost:3000";

export default defineConfig({
  name: "default",
  title: "Alfa Beauty Content",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        initial: previewOrigin,
        previewMode: {
          enable: "/api/draft-mode/enable",
          shareAccess: false,
        },
      },
      allowOrigins: [previewOrigin],
      resolve: {
        mainDocuments: [
          {
            route: "/shop/:slug",
            resolve: ({ params }) => ({
              filter: `_type == "productContent" && slug.current == $slug`,
              params: { slug: params.slug },
            }),
          },
          { route: "/shop", type: "siteSettings" },
        ],
      },
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    actions: (previousActions, { schemaType }) =>
      schemaType === "siteSettings"
        ? previousActions.filter(
            ({ action }) => action !== "delete" && action !== "duplicate",
          )
        : previousActions,
  },
});
