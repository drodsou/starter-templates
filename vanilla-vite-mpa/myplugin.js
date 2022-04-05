// const fileRegex = /\.html\.js$/
const fileRegex = /\.html$/

export default function myPlugin() {
  return {
    name: 'transform-html',

    transformIndexHtml: {
      enforce: 'pre',

      async transform(src, ctx) {
        console.log('transform', ctx.path);
        // if (!fileRegex.test(ctx)) { return }
        // const html = (await import(id)).default;
        return  transformHtml(src);
      }
    },

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
function transformHtml(src) {
  console.log('transformHtml');
  const fmRegex = /^---\n([\s\S]*?)\n---\n/
  const fmText = (fmRegex.exec(src) ?? [''])[0];
  fmEntries = fmText.replaceAll('---','').trim().split('\n')
    .map(e => e.split(':').map(e2=>e2.trim()) )
  let body = layout(src.replace(fmText, ''));
  fmEntries.forEach(fmEntry => {
    body = body.replaceAll(`{{${fmEntry[0]}}}`, fmEntry[1]);
  });
  return body;
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



