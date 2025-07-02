import { defineConfig } from 'vite';
import fullReload from 'vite-plugin-full-reload';
import { globSync } from 'glob';
import path from 'path';

const entryFiles = globSync(['widgets/**/*.js', 'widgets/**/*.css'], {
  ignore: 'widgets/example/**',
});

const ViteDebugPlugin = () => {
  return {
    name: 'vite-plugin-debug',
    configureServer(server) {
      console.log('🕵️ ARCHIVOS ENCONTRADOS POR GLOB:', entryFiles);

      server.watcher.on('ready', () => {
        console.log('✅ EL OBSERVADOR DE VITE ESTÁ LISTO. VIGILANDO LOS SIGUIENTES ARCHIVOS:');
        const watchedFiles = server.watcher.getWatched();
        console.log(watchedFiles);
      });
    }
  }
}

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: entryFiles,
      output: {
        entryFileNames: (chunkInfo) => {
          const baseName = path.basename(chunkInfo.facadeModuleId, path.extname(chunkInfo.facadeModuleId));
          return `js/${baseName}-script.js`;
        },
        assetFileNames: (assetInfo) => {
          const baseName = path.basename(assetInfo.name, path.extname(assetInfo.name));
          return `css/${baseName}-style.css`;
        },
      },
    },
  },

  plugins: [
    fullReload(['widgets/**/*.php']),
    ViteDebugPlugin()
  ],

  optimizeDeps: {
    entries: entryFiles,
  },

  server: {
    watch: {
      usePolling: true,
    },
  },
});