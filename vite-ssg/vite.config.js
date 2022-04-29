import vmpa from './vite-plugin-vmpa/plugin.js';

export default {
  plugins: [vmpa()],
  build: {
    rollupOptions: {
      input: {
        'index': 'index.html',
        'about/index.html': 'about/index.html'
      }
      // external: 'style.css',
    }
  }
};

// export default {
//   root : '_dist',
//   publicDir : 'client/static',
//   build: {
//     outDir : 'dist',
//     emptyOutDir: false,
//     rollupOptions: {
//       // input
//       external: 'style.css',
//     }
//   }
// };