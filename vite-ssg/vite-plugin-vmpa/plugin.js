import fs from "fs"; 

let IS_DEV = false;

export default function myPlugin() {
  return {
    name: 'myplugin',
    enforce: 'pre',
    configureServer(server) {
      IS_DEV = true;
      server.middlewares.use((req, res, next) => {
        // custom handle request...
        console.log('--middleware', req.url);
        if (req.url.startsWith('/@') || req.url.startsWith('/__vite')) { return next(); }

        let ext = req.url.split('.')[1]
        if (!ext) {
          req.url += req.url.endsWith('/') ? 'index.html' : '/index.html';
          ext = 'html'
        }
        if (ext === 'html') {
          req.originalUrl = req.url
          req.url = `/index.html`
          console.log('--middleware2', req.url);
        }
        next();
      })
    },

    async buildStart(...args) {
      console.log('--buildStart')
    },
    async resolveId(importee, importer, importOpts) {
      // console.log('--resolveId', importee, importer)
      
      // if (importee === '/index') {
      //   return 'C:/Users/drodsou/dev/starter-templates/vite-ssg/index.html';
      // }

      if (importee.endsWith('.html')) {
        return importee;  // tell Vite index.html exists when it looks for it
      }
    },
    async load(id) {
      // console.log('--load', id)
      if (id.endsWith('.html')) {
        // read .md contents instead
        let content = await fs.promises.readFile(id.replace('.html','.md'), "utf-8")
        // do your custom transformation if needed, eg md => html
        content = layout(content)   
        return content;
      }
    },
    transform(src, ctx) {
      // console.log('--transform', ctx)
 
      // this is if you need to transform custom 'import' as well
    },
    async transformIndexHtml(html, ctx) {
      if (!IS_DEV) return html;
      
      console.log('--transformIndexHtml', ctx.originalUrl)
      let root = ctx.server.config.root;
      let id = (root + ctx.originalUrl).replace('.html','.md');
      console.log('--', id)
      let content = await fs.promises.readFile(id, "utf-8")
      content = layout(content)  

      return content;
      // return html.replace(
      //   /<title>(.*?)<\/title>/,
      //   `<title>Title replaced!</title>`
      // )
    }
  }
}


function layout(body) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="favicon.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Vite App</title>
    </head>
    <body>
      ${body}

      <div>footer</div>
    </body>
  </html>
  `;

}