import fs from "fs"; 


export default function myPlugin() {

  const PROJECT_ROOT = new Error().stack
    .replaceAll('\\','/')
    .match(/\(([^)]*vite\.config\.js):/)[1]
    .replace('/vite.config.js','');
  

  return {
    name: 'myplugin',
    enforce: 'pre',

    config(config, {command}) {
      // console.log('--config');
      if (command === 'build') {
        config.build.rollupOptions.input = inputPages(PROJECT_ROOT + '/' + config.root)
      }
    },

    configureServer(server) {
      
      let rootDir = server.config.root
      // -- for dev mode only
      server.middlewares.use(async (req, res, next) => {

        console.log('--middleware', req.url);
        if (req.url.startsWith('/@') || req.url.startsWith('/__vite')) { return next(); }

        let ext = req.url.split('.')[1]
        if (!ext) {
          req.url += req.url.endsWith('/') ? 'index.html' : '/index.html';
          ext = 'html'
        }
        if (ext === 'html') {
          req.originalUrl = req.url
          let id = (rootDir + req.originalUrl);
          let content = await customTransformHtml(id);
          res.setHeader('Content-Type', 'text/html');
          res.write(content);
          res.end();
          return;
        }
        next();
      })
    },

    // -- .html process when vite build
    async resolveId(importee, importer, importOpts) {
      // console.log('--resolveId', importee, importer)
      if (importee.endsWith('.html')) {
        return importee;  // tell Vite index.html exists when it looks for it
      }
    },
    async load(id) {
      // console.log('--load', id)
      if (id.endsWith('.html')) {
        return await customTransformHtml(id)
      }
    },
    transform(src, ctx) {
      // console.log('--transform', ctx)
       // this is if you need to transform custom 'import' as well
    },
    async transformIndexHtml(html, ctx) {
      // dev should never reach here, handled by middleware
      // build needs to do nothing as its already transformed by load()
    }
  }
}

async function customTransformHtml(htmlPath) {
  // TODO check if html or md exist
  let id =  htmlPath.replace('.html','.md');
  let content = await fs.promises.readFile(id, "utf-8")
  content = layout(content)  
  return content;
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


function inputPages (pagesDir) {

  const readdirSyncRecursive = (d)=>  fs.readdirSync(d, {withFileTypes:true})
    .map(f=>f.isDirectory() ? readdirSyncRecursive(d + '/' + f.name) : d + '/' + f.name)
    .flat();
  
  let re = /\.(md|html)$/
  let pages = readdirSyncRecursive(pagesDir)
    .filter(e=> e.match(re))
    .map(e=>e.replace(pagesDir,'').replace('.md','.html'))
    .filter(e=>e !== '/index.html');

  let input = {
    'index' : pagesDir + '/index.html'
  }
  pages.forEach(p=>{
    input[p.slice(1)] = pagesDir + p;
  });


  return input;

  // input: {
  //   'index': 'index.html',
  //   'about/index.html': 'about/index.html'
  // }


}


