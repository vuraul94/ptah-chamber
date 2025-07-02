import { defineConfig, build } from 'vite';
import path from 'path';
import chokidar from 'chokidar';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fs from 'fs';
import picomatch from 'picomatch';

const widgetsDir = path.resolve(__dirname, 'widgets');

// Function to dynamically get inputs from the widgets directory with an exclude option
function getDynamicInputs(excludePatterns = []) {
  const inputs = {};
  // Create a picomatch function to check if a path is excluded
  const isExcluded = picomatch(excludePatterns, { dot: true });

  try {
    const widgetFolders = fs.readdirSync(widgetsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const folder of widgetFolders) {
      const folderPath = path.join(widgetsDir, folder);
      const folderPathRelative = path.relative(__dirname, folderPath);

      // Check if the entire folder is excluded
      if (isExcluded(folderPathRelative)) {
        console.log(`Skipping excluded folder: ${folderPathRelative}`);
        continue;
      }

      const filesInFolder = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile());

      for (const file of filesInFolder) {
        const fileName = file.name;
        const filePathRelative = path.join('widgets', folder, fileName); // Path relative to root

        // Check if the individual file is excluded
        if (isExcluded(filePathRelative)) {
          console.log(`Skipping excluded file: ${filePathRelative}`);
          continue;
        }

        const fileExtension = path.extname(fileName);
        const baseName = path.basename(fileName, fileExtension);

        if (fileExtension === '.js') {
          inputs[`${baseName}-script`] = filePathRelative;
        } else if (fileExtension === '.css') {
          inputs[`${baseName}-style`] = filePathRelative;
        }
      }
    }
  } catch (error) {
    console.error("Error reading widgets directory:", error);
  }
  return inputs;
}

export default defineConfig(({ command }) => {
  const isServe = command === 'serve';
  // const excludePatterns = ['widgets/promo-grid/**', 'widgets/example/example.js'];
  const excludePatterns = ['widgets/example/**'];
  let dynamicInputs = getDynamicInputs(excludePatterns);

  // Variable para mantener la instancia del servidor de desarrollo de Vite
  let viteServer = null;

  const config = {
    root: './',
    build: {
      outDir: 'dist',
      emptyOutDir: !isServe,
      rollupOptions: {
        input: dynamicInputs,
        output: {
          assetFileNames: 'css/[name].css',
          entryFileNames: 'js/[name].js',
        },
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
      // Plugin personalizado para obtener la instancia del servidor de desarrollo de Vite
      {
        name: 'chokidar-reloader',
        apply: 'serve', // Aplicar este plugin solo durante el modo de desarrollo
        configureServer(server) {
          viteServer = server; // Almacenar la instancia del servidor
        },
      },
    ],
    server: {
      watch: {
        usePolling: true, // Mantener para entornos donde la detección de cambios nativa puede ser inestable
      },
      hmr: {
        overlay: true, // Mostrar la superposición de errores de HMR
      },
    },
  };

  if (isServe) {
    const watcher = chokidar.watch(`${widgetsDir}/**/*.{js,css,php}`, {
      persistent: true,
      ignoreInitial: true,
    });

    watcher.on('change', async (filePath) => {
      console.log(`🔁 Cambio detectado en ${filePath}`);
      console.log(`⚙️ Re-evaluando entradas y ejecutando build...`);

      // Actualizar las entradas dinámicas antes de la reconstrucción
      dynamicInputs = getDynamicInputs(excludePatterns);

      await build({
        configFile: false, // Asegurar que Vite use esta configuración de build específica
        build: {
          outDir: 'dist',
          emptyOutDir: false, // Mantener los archivos existentes a menos que se eliminen explícitamente
          rollupOptions: {
            input: dynamicInputs, // Usar las entradas dinámicas actualizadas para la reconstrucción
            output: {
              assetFileNames: 'css/[name].css',
              entryFileNames: 'js/[name].js',
            },
          },
        },
      });

      console.log(`✅ Build completo terminado.`);

      // Disparar una recarga completa de la página en el navegador a través del servidor WebSocket de Vite
      if (viteServer) {
        console.log('🔄 Disparando recarga completa de la página...');
        viteServer.ws.send({ type: 'full-reload', path: '*' });
      }
    });
  }

  return config;
});