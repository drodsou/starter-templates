const {marked} = require('marked');

export default function myPlugin() {
  return {
    name: 'transform-html',
    enforce: 'pre',
    async transform(src, ctx) {
      console.log('transform', ctx);
      if (!ctx.match(/\.(html|md)$/)) { return src }
      // const html = (await import(id)).default;
      return  transformHtml(src, ctx);
    }
    

    

    // -- copied from handlebars plugin
    // configResolved(config) {
    //   root = config.root;
    // },

    // async handleHotUpdate({
    //   server,
    //   file
    // }) {
    //   if (reloadOnPartialChange && partialsSet.has(file)) {
    //     server.ws.send({
    //       type: 'full-reload'
    //     });
    //     return [];
    //   }
    // },

  }
}



// frontmatter regex
function transformHtml(src, id) {
  console.log('transformHtml');
  const fmRegex = /^---\n([\s\S]*?)\n---\n/
  let fmText = (fmRegex.exec(src) ?? [''])[0];
  fmEntries = fmText.replaceAll('---','').trim().split('\n')
    .map(e => e.split(':').map(e2=>e2.trim()) )
  fmObj = Object.fromEntries(fmEntries)
  if (fmObj.markdown) { fmText = marked.parse(fmText)  }

  let html = layout(src.replace(fmText, ''));
  fmEntries.forEach(fmEntry => {
    html = html.replaceAll(`{{${fmEntry[0]}}}`, fmEntry[1]);
  });
  // if (id.endsWith('.md')) { body = marked(body) }
  
  return html;
}


const layout = (body) =>`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{title}}</title>
  </head>
  <body>
    <h1>{{title}}</h1>
    ${body}
  </body>
  </html>
`;



