import type { MetadataRoute } from "next";
const siteUrl = "https://onkemetse-portfolio.vercel.app";
const lastModified = new Date("2026-11-28T00:00:00Z");
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/work/mckay-plant-hire`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteUrl}/work/the-grand-house`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteUrl}/work/little-acacia`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteUrl}/cv`, lastModified, changeFrequency: "yearly", priority: 0.6 }
  ];
}
