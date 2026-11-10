"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * next/image calls this for every width it needs (the srcset). Unsplash's CDN
 * resizes the photo and picks AVIF or WebP for the browser, so Next.js never
 * downloads and processes the full-size originals.
 * Registered in next.config.ts (images.loaderFile).
 */
export default function unsplashLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.startsWith("https://images.unsplash.com/")) return src;
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 72));
  return url.href;
}
