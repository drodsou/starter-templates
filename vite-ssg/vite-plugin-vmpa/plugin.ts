import fs from "fs"; 
import customTransformHtml from './pageTransform';

// -- plugins wrapper
export default function plugin() {
  const PROJECT_ROOT = getViteConfigPath();
  // console.log({PROJECT_ROOT})
  return [vmpaPlugin(PROJECT_ROOT),  autoreloadExtraPlugin() ]
}


/**
 * main plugin
 * - virtual index.html
 * - maps .html to .md
 * - autogenerates input entries from .md/.html in root (/src)
*/
function vmpaPlugin (PROJECT_ROOT) {
 
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
          // intercepts html calls, no need for external index.html
          // thanks to: https://github.com/windsonR/vite-plugin-virtual-html
          req.originalUrl = req.url
          let id = (rootDir + req.originalUrl);
          let content = await customTransformHtml(id, rootDir);
          // adds default vite HMR
          content = await server.transformIndexHtml('',content)

          // res.status(200).set({ 'Content-Type': 'text/html' }).end(content)
          res.setHeader('Content-Type', 'text/html');
          res.end(content);
          // res.end();
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

// async function customTransformHtml(htmlPath) {
//   // TODO check if html or md exist
//   let id =  htmlPath.replace('.html','.md');
//   let content = await fs.promises.readFile(id, "utf-8")
//   content = layout(content)  
//   return content;
// }


// function layout(body) {
//   return `
//   <!DOCTYPE html>
//   <html lang="en">
//     <head>
//       <meta charset="UTF-8" />
//       <link rel="icon" type="image/svg+xml" href="favicon.svg" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <title>Vite App</title>
//     </head>
//     <body>
//       ${body}

//       <div>footer</div>
//     </body>
//   </html>
//   `;
// }


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

function getViteConfigPath() {

  // -- https://github.com/sindresorhus/callsites
 function callsites() {
   const _prepareStackTrace = Error.prepareStackTrace;
   Error.prepareStackTrace = (_, stack) => stack;
   // @ts-ignore
   const stack = new Error().stack.slice(1); // eslint-disable-line unicorn/error-message
   Error.prepareStackTrace = _prepareStackTrace;
   return stack;
 }

 let vcPath = (<any>callsites())
   .map((s:any)=>s.getFileName())
   .filter((e:any)=>e?.includes('vite.config'))[0]
   .replace(/\\/g,'/')
   .replace(/^file:\/\//,'')
   .replace(/\/vite\.config[^\/]*/,'')
 
 // Windows, /C:/somedir => C:/somedir
 if (vcPath.match(/^\/.:/)) {  
   vcPath = vcPath.slice(1)  
 }
  
 console.log(vcPath)
 return vcPath

}


/**
 * additional plugin
 * - autoreload on .md change
 * - custom HMR
*/
function autoreloadExtraPlugin() {
  return {
    name: 'autoreload-extra',
    enforce: 'post',
    handleHotUpdate({ file, server }) {
      if (file.match(/(\.md|\.loader\.js)$/)) {
        console.log('full page reload, file:', file);
        server.ws.send({type: 'full-reload', path: '*'});
      }
      else if (file.endsWith('.css')) {
        console.log('hot updating css file:', file);
        server.ws.send({type: 'update', updates: [
          {path: file.match(/.*static(.*)/)[1], timestamp: Date.now()}
        ]});
      } else {
        console.log('file modified, but no update action taken:', file)
      }
    },
  }
}


