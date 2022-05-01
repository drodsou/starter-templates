export async function frontmatter () {
  
  let data: string[] = await new Promise(resolve=>{
    setTimeout(()=>resolve(['value1','value2']), 500)
  });
  return {
    loader : `
      <ul id="loader">
        ${data.map(e=>`<li>${e}</li>`).join('')}
      </ul>
    `,
  }
}
    

// -- Client only, HMR updated
if (typeof window !== 'undefined') { 
  setTimeout(()=>{
    // @ts-ignore
    document.querySelector(`#loader`).innerHTML = `updated by client 1`;
  },1000);

  // -- HMR (this only compiles in server and client if type:module in package.json)
  if (import.meta.hot) {
    import.meta.hot.accept((/*newModule*/) => {
      console.log('sbout-loader.ts hot updated:')
      // newModule.default();
    })
  }
}