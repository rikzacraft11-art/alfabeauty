import { defineArrayMember, defineField, defineType } from "sanity";

function hasLocalizedValue(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const localized = value as { id?: unknown; en?: unknown };
  return [localized.id, localized.en].some(
    (candidate) => typeof candidate === "string" && candidate.trim().length > 0,
  );
}

const localizedString = defineType({
  name: "localizedString",
  title: "Localized string",
  type: "object",
  fields: [
    defineField({ name: "id", title: "Indonesian", type: "string" }),
    defineField({ name: "en", title: "English", type: "string" }),
  ],
  validation: (Rule) =>
    Rule.custom((value) =>
      hasLocalizedValue(value) ? true : "Provide at least one language.",
    ),
});

const localizedText = defineType({
  name: "localizedText",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({ name: "id", title: "Indonesian", type: "text", rows: 5 }),
    defineField({ name: "en", title: "English", type: "text", rows: 5 }),
  ],
  validation: (Rule) =>
    Rule.custom((value) =>
      hasLocalizedValue(value) ? true : "Provide at least one language.",
    ),
});

const accessibleImage = defineType({
  name: "accessibleImage",
  title: "Accessible image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "localizedString",
      description: "Describe the visible product, not its marketing message.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  validation: (Rule) => Rule.required().assetRequired(),
});

const sourceMetadata = defineType({
  name: "sourceMetadata",
  title: "Content provenance",
  type: "object",
  fields: [
    defineField({
      name: "owner",
      title: "Content owner",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({ name: "sourceUrl", title: "Source URL", type: "url" }),
    defineField({
      name: "lastReviewedAt",
      title: "Last reviewed at",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "notes",
      title: "Internal notes",
      type: "text",
      rows: 3,
    }),
  ],
});

const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Search title",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Search description",
      type: "localizedText",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "image", title: "Social image", type: "accessibleImage" }),
    defineField({
      name: "noIndex",
      title: "Exclude from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    defineField({
      name: "commerceBrandId",
      title: "Commerce brand ID",
      type: "string",
      readOnly: ({ document }) => Boolean(document?._createdAt),
      validation: (Rule) =>
        Rule.required().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$/),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "summary", title: "Summary", type: "localizedText" }),
    defineField({ name: "logo", title: "Logo", type: "accessibleImage" }),
    defineField({ name: "heroImage", title: "Hero image", type: "accessibleImage" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["draft", "active", "archived"], layout: "radio" },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      initialValue: 100,
      validation: (Rule) => Rule.required().integer().min(0).max(9999),
    }),
    defineField({ name: "sourceMetadata", title: "Provenance", type: "sourceMetadata" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { select: { title: "name", subtitle: "status", media: "logo" } },
});

const productCategory = defineType({
  name: "productCategory",
  title: "Product category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "localizedText" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["draft", "active", "archived"], layout: "radio" },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      initialValue: 100,
      validation: (Rule) => Rule.required().integer().min(0).max(9999),
    }),
  ],
  preview: {
    select: { idTitle: "title.id", enTitle: "title.en", subtitle: "status" },
    prepare: ({ idTitle, enTitle, subtitle }) => ({
      title: idTitle || enTitle || "Untitled category",
      subtitle,
    }),
  },
});

const productContent = defineType({
  name: "productContent",
  title: "Product content",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "content", title: "Content" },
    { name: "media", title: "Media" },
    { name: "governance", title: "Governance" },
  ],
  fields: [
    defineField({
      name: "commerceProductId",
      title: "Commerce product ID",
      description: "Immutable binding to the future commerce service. This is never a price or SKU.",
      type: "string",
      group: "identity",
      readOnly: ({ document }) => Boolean(document?._createdAt),
      validation: (Rule) =>
        Rule.required()
          .regex(/^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$/)
          .custom(async (value, context) => {
            if (!value) return true;
            const documentId = context.document?._id?.replace(/^drafts\./, "");
            const duplicates = await context
              .getClient({ apiVersion: "2026-08-20" })
              .fetch<number>(
                `count(*[_type == "productContent" && commerceProductId == $value && !(_id in [$publishedId, $draftId])])`,
                { value, publishedId: documentId, draftId: `drafts.${documentId}` },
              );
            return duplicates === 0 ? true : "Commerce product ID must be globally unique.";
          }),
    }),
    defineField({
      name: "slug",
      title: "Public slug",
      type: "slug",
      group: "identity",
      options: { source: "name.en", maxLength: 96 },
      validation: (Rule) =>
        Rule.required().custom((value) =>
          !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
            ? true
            : "Use lowercase letters, numbers, and single hyphens only.",
        ),
    }),
    defineField({
      name: "name",
      title: "Product name",
      type: "localizedString",
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "productCategory" }],
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      group: "identity",
      options: {
        list: [
          { title: "Salon", value: "salon" },
          { title: "Barber", value: "barber" },
          { title: "Salon and barber", value: "both" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "localizedText",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "longDescription", title: "Long description", type: "localizedText", group: "content" }),
    defineField({ name: "howToUse", title: "How to use", type: "localizedText", group: "content" }),
    defineField({
      name: "keyBenefits",
      title: "Key benefits",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "localizedString" })],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: "recommendedFor",
      title: "Recommended for",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "localizedString" })],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: "variants",
      title: "Variant labels",
      description: "Display labels only. Price, SKU, and stock remain commerce-owned.",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          name: "productVariantContent",
          title: "Variant content",
          type: "object",
          fields: [
            defineField({
              name: "commerceVariantId",
              title: "Commerce variant ID",
              type: "string",
              readOnly: ({ document }) => Boolean(document?._createdAt),
              validation: (Rule) =>
                Rule.required()
                  .regex(/^[A-Za-z0-9][A-Za-z0-9._-]{2,95}$/)
                  .custom(async (value, context) => {
                    if (!value) return true;
                    const documentId = context.document?._id?.replace(/^drafts\./, "");
                    const duplicates = await context
                      .getClient({ apiVersion: "2026-08-20" })
                      .fetch<number>(
                        `count(*[_type == "productContent" && $value in variants[].commerceVariantId && !(_id in [$publishedId, $draftId])])`,
                        { value, publishedId: documentId, draftId: `drafts.${documentId}` },
                      );
                    return duplicates === 0 ? true : "Commerce variant ID must be globally unique.";
                  }),
            }),
            defineField({
              name: "label",
              title: "Display label",
              type: "localizedString",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { idLabel: "label.id", enLabel: "label.en", subtitle: "commerceVariantId" },
            prepare: ({ idLabel, enLabel, subtitle }) => ({ title: idLabel || enLabel, subtitle }),
          },
        }),
      ],
    }),
    defineField({
      name: "heroImage",
      title: "Primary product image",
      type: "accessibleImage",
      group: "media",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "accessibleImage" })],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: "infoSlides",
      title: "Information slides",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          name: "infoSlide",
          title: "Information slide",
          type: "object",
          fields: [
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: ["description", "features", "benefits", "application", "technology", "ingredients"],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "image", title: "Image", type: "accessibleImage", validation: (Rule) => Rule.required() }),
          ],
        }),
      ],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({ name: "heroBrandImage", title: "Product-line hero image", type: "accessibleImage", group: "media" }),
    defineField({
      name: "relatedProducts",
      title: "Related products",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "productContent" }] })],
      validation: (Rule) => Rule.unique().max(8),
    }),
    defineField({ name: "isNew", title: "Show new badge", type: "boolean", initialValue: false, group: "governance" }),
    defineField({
      name: "status",
      title: "Publication status",
      type: "string",
      group: "governance",
      options: { list: ["draft", "active", "archived"], layout: "radio" },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      group: "governance",
      initialValue: 100,
      validation: (Rule) => Rule.required().integer().min(0).max(9999),
    }),
    defineField({ name: "sourceMetadata", title: "Provenance", type: "sourceMetadata", group: "governance" }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "governance" }),
  ],
  preview: {
    select: {
      idTitle: "name.id",
      enTitle: "name.en",
      brand: "brand.name",
      status: "status",
      media: "heroImage",
    },
    prepare: ({ idTitle, enTitle, brand, status, media }) => ({
      title: idTitle || enTitle || "Untitled product",
      subtitle: `${brand ?? "No brand"} | ${status ?? "unknown"}`,
      media,
    }),
  },
});

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "catalogNotice",
      title: "Catalog notice",
      description: "Optional non-transactional demo notice shown near the catalog.",
      type: "localizedText",
    }),
    defineField({
      name: "featuredProducts",
      title: "Featured products",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "productContent" }] })],
      validation: (Rule) => Rule.unique().max(12),
    }),
    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo" }),
    defineField({ name: "sourceMetadata", title: "Provenance", type: "sourceMetadata" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const schemaTypes = [
  localizedString,
  localizedText,
  accessibleImage,
  sourceMetadata,
  seo,
  brand,
  productCategory,
  productContent,
  siteSettings,
];
