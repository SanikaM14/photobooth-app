import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

export default defineConfig({
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  // KEEP THIS: It fixes the "JSX syntax extension is not currently enabled" errors
  // because your project uses .js files for React components.
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
    sourcemap: true,
  },
  plugins: [
    tsconfigPaths(), 
    react({
      include: ['**/*.jsx', '**/*.js', '**/*.tsx', '**/*.ts'],
      babel: {
        presets: [['@babel/preset-react', { runtime: 'automatic' }]],
      },
    }), 
    tagger()
  ],
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      overlay: true
    }
  }
});