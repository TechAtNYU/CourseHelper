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
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
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
