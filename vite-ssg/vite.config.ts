import vmpa from './vite-plugin-vmpa/plugin';

// import tailwindcss from 'tailwindcss';
// import autoprefixer from 'autoprefixer';
// import postcssNesting from 'postcss-nesting';

export default {
  plugins: [vmpa()],
  root: 'src',
  build: {
    outDir : '../dist',
  },

  // css: {
  //   postcss: {
  //       plugins: [
  //           tailwindcss, autoprefixer
  //       ],
  //   },
  // },

};

