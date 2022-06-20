import { defineConfig } from "vite";
import { mksitePlugin } from "./vite-plugin-mksite.js";

const config = {
  root: "src",
  envDir: "../",
  plugins: [mksitePlugin()],
  server: {
  },
  build: {
    target: 'esnext',
    emptyOutDir: true
  }
};

// https://vitejs.dev/config/
const mksiteViteConfig = (customConfig = {}) => {
  return defineConfig(({ command, mode }) => {
    // command: serve, build
    // mode: development, production
    return {
      ...config,
      customConfig
    };
  });
};

Object.assign(mksiteViteConfig, config);

export { mksiteViteConfig };
