import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  manifest: {
    permissions: ["storage"],
    web_accessible_resources: [
      {
        matches: ["<all_urls>"],
        resources: ["/theme.js"],
      },
    ],
  },
  vite: (_env) => {
    return {
      plugins: [tailwindcss()],
    };
  },
});
