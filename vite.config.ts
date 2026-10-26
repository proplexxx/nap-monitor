import { defineConfig } from "vite";
import { readFileSync } from "node:fs";

const manifest = JSON.parse(
  readFileSync("custom_components/nap_monitor/manifest.json", "utf8"),
);

// The card is built straight into the integration's frontend folder so a
// HACS install (which only downloads custom_components/nap_monitor) ships it.
export default defineConfig({
  define: {
    __CARD_VERSION__: JSON.stringify(manifest.version),
  },
  build: {
    outDir: "custom_components/nap_monitor/frontend",
    emptyOutDir: false,
    target: "es2022",
    minify: true,
    sourcemap: false,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "nap-monitor-card.js",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
