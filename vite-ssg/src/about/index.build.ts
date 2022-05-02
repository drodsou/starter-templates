export default async function frontmatter () {
  
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