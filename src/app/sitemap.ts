import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.8 },
    { path: "/book", priority: 0.8 },
  ];
  return pages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    changeFrequency: "weekly" as const,
    priority: page.priority,
  }));
}
