export default {
  root : '_dist',
  publicDir : 'client/static',
  build: {
    outDir : 'dist',
    emptyOutDir: false,
    rollupOptions: {
      // input
      external: 'style.css',
    }
  }
};