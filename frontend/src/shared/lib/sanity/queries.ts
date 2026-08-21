import { defineQuery } from "next-sanity";

const productProjection = `{
  _id,
  commerceProductId,
  "slug": slug.current,
  "name": coalesce(name.id, name.en),
  "brand": brand->name,
  "category": category->slug.current,
  "categoryLabel": coalesce(category->title.id, category->title.en),
  audience,
  "description": coalesce(shortDescription.id, shortDescription.en),
  "longDescription": coalesce(longDescription.id, longDescription.en),
  "howToUse": coalesce(howToUse.id, howToUse.en),
  "keyBenefits": keyBenefits[]{"value": coalesce(id, en)},
  "recommendedFor": recommendedFor[]{"value": coalesce(id, en)},
  "variants": variants[]{"id": commerceVariantId, "label": coalesce(label.id, label.en)},
  isNew,
  "image": heroImage.asset->url,
  "gallery": gallery[].asset->url,
  "infoSlides": infoSlides[]{type, "src": image.asset->url},
  "heroImage": heroBrandImage.asset->url,
  "relatedIds": relatedProducts[]->slug.current,
  "seoTitle": coalesce(seo.title.id, seo.title.en),
  "seoDescription": coalesce(seo.description.id, seo.description.en),
  "seoImage": seo.image.asset->url,
  "noIndex": coalesce(seo.noIndex, false)
}`;

const activeProductFilter = `
  _type == "productContent" &&
  status == "active" &&
  brand->status == "active" &&
  category->status == "active" &&
  defined(commerceProductId) &&
  defined(slug.current) &&
  defined(heroImage.asset) &&
  (defined(name.id) || defined(name.en)) &&
  (defined(shortDescription.id) || defined(shortDescription.en))
`;

export const catalogProductsQuery = defineQuery(`
  *[${activeProductFilter}]
  | order(displayOrder asc, name.id asc, name.en asc)
  ${productProjection}
`);

export const catalogProductBySlugQuery = defineQuery(`
  *[${activeProductFilter} && slug.current == $slug][0]
  ${productProjection}
`);

export const catalogProductSlugsQuery = defineQuery(`
  *[${activeProductFilter}].slug.current
`);

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    siteTitle,
    "catalogNotice": coalesce(catalogNotice.id, catalogNotice.en),
    "seoTitle": coalesce(defaultSeo.title.id, defaultSeo.title.en),
    "seoDescription": coalesce(defaultSeo.description.id, defaultSeo.description.en),
    "seoImage": defaultSeo.image.asset->url,
    "noIndex": coalesce(defaultSeo.noIndex, false)
  }
`);
