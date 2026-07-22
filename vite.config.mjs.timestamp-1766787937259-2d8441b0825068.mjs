// vite.config.mjs
import { defineConfig } from "file:///D:/rose-photobooth-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/rose-photobooth-frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tsconfigPaths from "file:///D:/rose-photobooth-frontend/node_modules/vite-tsconfig-paths/dist/index.mjs";
import tagger from "file:///D:/rose-photobooth-frontend/node_modules/@dhiwise/component-tagger/dist/index.mjs";
var vite_config_default = defineConfig({
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"]
  },
  // KEEP THIS: It fixes the "JSX syntax extension is not currently enabled" errors
  // because your project uses .js files for React components.
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      }
    }
  },
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2e3,
    sourcemap: true
  },
  plugins: [
    tsconfigPaths(),
    react({
      include: ["**/*.jsx", "**/*.js", "**/*.tsx", "**/*.ts"],
      babel: {
        presets: [["@babel/preset-react", { runtime: "automatic" }]]
      }
    }),
    tagger()
  ],
  server: {
    port: 3e3,
    strictPort: true,
    hmr: {
      overlay: true
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxccm9zZS1waG90b2Jvb3RoLWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxyb3NlLXBob3RvYm9vdGgtZnJvbnRlbmRcXFxcdml0ZS5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9yb3NlLXBob3RvYm9vdGgtZnJvbnRlbmQvdml0ZS5jb25maWcubWpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xyXG5pbXBvcnQgdGFnZ2VyIGZyb20gXCJAZGhpd2lzZS9jb21wb25lbnQtdGFnZ2VyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHJlc29sdmU6IHtcclxuICAgIGV4dGVuc2lvbnM6IFsnLmpzJywgJy50cycsICcuanN4JywgJy50c3gnLCAnLmpzb24nXSxcclxuICB9LFxyXG4gIC8vIEtFRVAgVEhJUzogSXQgZml4ZXMgdGhlIFwiSlNYIHN5bnRheCBleHRlbnNpb24gaXMgbm90IGN1cnJlbnRseSBlbmFibGVkXCIgZXJyb3JzXHJcbiAgLy8gYmVjYXVzZSB5b3VyIHByb2plY3QgdXNlcyAuanMgZmlsZXMgZm9yIFJlYWN0IGNvbXBvbmVudHMuXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBlc2J1aWxkT3B0aW9uczoge1xyXG4gICAgICBsb2FkZXI6IHtcclxuICAgICAgICAnLmpzJzogJ2pzeCcsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogXCJidWlsZFwiLFxyXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyMDAwLFxyXG4gICAgc291cmNlbWFwOiB0cnVlLFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgdHNjb25maWdQYXRocygpLCBcclxuICAgIHJlYWN0KHtcclxuICAgICAgaW5jbHVkZTogWycqKi8qLmpzeCcsICcqKi8qLmpzJywgJyoqLyoudHN4JywgJyoqLyoudHMnXSxcclxuICAgICAgYmFiZWw6IHtcclxuICAgICAgICBwcmVzZXRzOiBbWydAYmFiZWwvcHJlc2V0LXJlYWN0JywgeyBydW50aW1lOiAnYXV0b21hdGljJyB9XV0sXHJcbiAgICAgIH0sXHJcbiAgICB9KSwgXHJcbiAgICB0YWdnZXIoKVxyXG4gIF0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiAzMDAwLFxyXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcclxuICAgIGhtcjoge1xyXG4gICAgICBvdmVybGF5OiB0cnVlXHJcbiAgICB9XHJcbiAgfVxyXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlRLFNBQVMsb0JBQW9CO0FBQ3RTLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLFlBQVk7QUFFbkIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsWUFBWSxDQUFDLE9BQU8sT0FBTyxRQUFRLFFBQVEsT0FBTztBQUFBLEVBQ3BEO0FBQUE7QUFBQTtBQUFBLEVBR0EsY0FBYztBQUFBLElBQ1osZ0JBQWdCO0FBQUEsTUFDZCxRQUFRO0FBQUEsUUFDTixPQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUix1QkFBdUI7QUFBQSxJQUN2QixXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsY0FBYztBQUFBLElBQ2QsTUFBTTtBQUFBLE1BQ0osU0FBUyxDQUFDLFlBQVksV0FBVyxZQUFZLFNBQVM7QUFBQSxNQUN0RCxPQUFPO0FBQUEsUUFDTCxTQUFTLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxTQUFTLFlBQVksQ0FBQyxDQUFDO0FBQUEsTUFDN0Q7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
