export async function frontmatter () {
  let data = await new Promise(resolve=>{
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
    

if (typeof window !== 'undefined') { 
  setTimeout(()=>{
    document.querySelector(`#loader`).innerHTML = `updated by client`;
  },1000);

  // -- this only compiles in server and client if type:module in package.json
  if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
      console.log('sbout-loader.ts hot updated:')
      newModule.default();
    })
  }
}