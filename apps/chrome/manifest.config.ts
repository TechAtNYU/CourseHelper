import { defineManifest } from "@crxjs/vite-plugin";
import pkgRoot from "../../package.json";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkgRoot.name,
  version: pkg.version,
  icons: {
    48: "public/logo.png",
  },
  action: {
    default_icon: {
      48: "public/logo.png",
    },
    default_popup: "src/popup/index.html",
  },
  permissions: ["sidePanel", "contentSettings", "storage"],
  content_scripts: [
    {
      js: ["src/content/main.tsx"],
      matches: ["https://*/*"],
    },
  ],
  side_panel: {
    default_path: "src/sidepanel/index.html",
  },
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
});
