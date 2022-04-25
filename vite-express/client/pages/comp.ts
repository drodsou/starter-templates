import seButton from '../lib/se-button.js';

console.log('comp.loader.ts')

export async function frontmatter () {
  let fm =  {
    seButton1 : await seButton.render(2),
    seButton2 : await seButton.render(4),
  }
  return fm;
}

if (typeof window !== 'undefined') {
  // -- Vite HMR: this only compiles in server and client if type:module in package.json
  if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
      console.log('comp-loader.ts hot updated:')
      newModule.default();
    })
  }
}


