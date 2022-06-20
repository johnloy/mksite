import { defineConfig } from "astro/config";
import lit from "@astrojs/lit";
import postcssJitProps from "postcss-jit-props";
import OpenProps from "open-props";

// https://astro.build/config
export default defineConfig({
  integrations: [lit()],
  vite: {
    css: {
      postcss: {
        plugins: [postcssJitProps(OpenProps)]
      }
    }
  }
});
