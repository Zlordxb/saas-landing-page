import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework in every response ("X-Powered-By: Next.js").
  poweredByHeader: false,

  // Photos come from Unsplash. Their CDN resizes them for each screen,
  // so next/image asks our loader for URLs instead of optimizing images itself.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/unsplash-loader.ts",
  },

  // Tailwind CSS 4 runs as a Turbopack loader, the setup create-next-app 16.4 generates.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // The create-next-app template also turns on `cacheComponents` and `partialPrefetching`.
  // BookFlow uses the previous caching model instead (`export const revalidate`,
  // `export const dynamic`), which Next.js removes when Cache Components is on.
  // Moving to Cache Components is a later step: see docs/ROADMAP.md.
};

export default nextConfig;
