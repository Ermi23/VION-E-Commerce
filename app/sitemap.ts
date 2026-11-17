import type { MetadataRoute } from "next";
import { productPath, siteUrl } from "@/lib/format";
import { getCatalogue } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const { products } = await getCatalogue();
  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/products?category=shoes`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/products?category=clothes`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.5 },
    ...products.map((p) => ({
      url: `${base}${productPath(p.id)}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
