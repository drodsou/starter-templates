
export default async function loader (pageContent='') {
  
  console.log('running about.loader.ts ');
  // -- some async fetch
  let data = await new Promise(resolve=>{
    setTimeout(()=>resolve(['value1','value2']), 500)
  });
  let target = "loader";


  // -- convert
  if (typeof window === 'undefined') {
    // server
    return pageContent.replaceAll(`{{${target}}}`, `
      <ul id="${target}">
        ${data.map(e=>`<li>${e}</li>`).join('')}
      </ul>
    `);
  } else {
    // browser
    // maybe some clever updater, or maybe use preact or something for both
    document.querySelector(`#${target}`).innerHTML = `${JSON.stringify(data)}`;

  }
}


if (typeof window !== 'undefined') { 
  loader() 

  // -- this only compiles in server and client if type:module in package.json
  if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
      console.log('sbout-loader.ts hot updated:')
      newModule.default();
    })
  }
}


