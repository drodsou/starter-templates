import comp1 from '../lib/comp1.js';

export default async function loader (pageContent='') {
  
  console.log('running comp.loader.ts ');
  // -- some async fetch
  let state: any = await comp1.fetchState();
  let target = "loader";

  // -- convert
  if (typeof window === 'undefined') {
    // server
    return pageContent.replaceAll(`{{${target}}}`, 
      comp1.render(state)
    );
  } 
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


