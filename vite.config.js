import { defineConfig, build } from 'vite';
import path from 'path';
import chokidar from 'chokidar';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const widgetsDir = path.resolve(__dirname, 'widgets');

const predefinedInputs = {
  "age-approve-style": "widgets/age-approve/age-approve.css",
  "age-approve-script": "widgets/age-approve/age-approve.js",
  "promo-grid-style": "widgets/promo-grid/promo-grid.css",
  "animated-carousel-style": "widgets/age-approve/age-approve.css",
  "animated-carousel-script": "widgets/age-approve/age-approve.js",
};

export default defineConfig(({ command }) => {
  const isServe = command === 'serve';

  const config = {
    root: './',
    build: {
      outDir: 'dist',
      emptyOutDir: !isServe,
      rollupOptions: {
        input: predefinedInputs,
        output: {
          assetFileNames: 'css/[name].css',
          entryFileNames: 'js/[name].js',
        },
        watch: isServe ? {} : null,
      },
    },
    css: {
      postcss: {
        configFile: path.resolve(__dirname, 'postcss.config.cjs')
      },
    },
    plugins: [
      viteStaticCopy({
        targets: [],
      }),
    ],
    server: {
      watch: {
        usePolling: true,
      },
      hmr: {
        overlay: true,
      },
    },
  };

  if (isServe) {
    const watcher = chokidar.watch(`${widgetsDir}/**/*.{js,css}`, {
      persistent: true,
      ignoreInitial: true,
    });

    watcher.on('change', async (filePath) => {
      console.log(`🔁 Cambio detectado en ${filePath}`);
      console.log(`⚙️ Ejecutando build con entradas predefinidas...`);

      await build({
        configFile: false,
        build: {
          outDir: 'dist',
          emptyOutDir: false,
          rollupOptions: {
            input: predefinedInputs,
            output: {
              assetFileNames: 'css/[name].css',
              entryFileNames: 'js/[name].js',
            },
          },
        },
      });

      console.log(`✅ Build completo terminado.`);
    });
  }

  return config;
});
