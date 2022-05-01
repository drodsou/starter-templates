import vmpa from './vite-plugin-vmpa/plugin';

// import tailwindcss from 'tailwindcss';
// import autoprefixer from 'autoprefixer';
// import postcssNesting from 'postcss-nesting';

export default {
  plugins: [vmpa()],
  root: 'src',
  build: {
    outDir : '../dist',
    rollupOptions : {
      external : ['src/style.css', '/about/index.js']
    }
  },

  // css: {
  //   postcss: {
  //       plugins: [
  //           tailwindcss, autoprefixer
  //       ],
  //   },
  // },

};

