// @ts-check

import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://docs.albertplus.com",
  integrations: [
    starlight({
      title: "AlbertPlus Docs",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/TechAtNYU/AlbertPlus",
        },
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.gg/z8p4Qtjatw",
        },
      ],
      editLink: {
        baseUrl: "https://github.com/TechAtNYU/AlbertPlus/edit/main/apps/docs",
      },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Overview", slug: "getting-started/overview" },
            { label: "Prerequisites", slug: "getting-started/prerequisites" },
            { label: "Installation", slug: "getting-started/installation" },
            { label: "Quick Start", slug: "getting-started/quick-start" },
          ],
        },
        {
          label: "Architecture",
          items: [
            { label: "Overview", slug: "architecture/overview" },
            { label: "Monorepo Structure", slug: "architecture/monorepo" },
            { label: "Data Flow", slug: "architecture/data-flow" },
            { label: "Authentication", slug: "architecture/authentication" },
          ],
        },
        {
          label: "Applications",
          items: [
            { label: "Web App", slug: "applications/web-app" },
            { label: "Browser Extension", slug: "applications/browser-extension" },
            { label: "Scraper", slug: "applications/scraper" },
            { label: "Documentation", slug: "applications/documentation" },
          ],
        },
        {
          label: "Backend",
          items: [
            { label: "Convex Overview", slug: "backend/convex-overview" },
            { label: "Database Schema", slug: "backend/database-schema" },
            { label: "API Reference", slug: "backend/api-reference" },
          ],
        },
        {
          label: "Development",
          items: [
            { label: "Environment Setup", slug: "development/environment-setup" },
            { label: "Code Style", slug: "development/code-style" },
            { label: "Project Structure", slug: "development/project-structure" },
            { label: "Commands", slug: "development/commands" },
          ],
        },
        {
          label: "Tech Stack",
          items: [
            { label: "Overview", slug: "tech-stack/overview" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
