// vite.config.js
import { createVuePlugin } from 'vite-plugin-vue2'
import path from 'path'

export default {
  base: './',
  plugins: [
    createVuePlugin(/*options*/)
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'v-cesium',
      // fileName: (format) => `my-lib.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': require('path').resolve(__dirname, '/src')
    }
  }
}
