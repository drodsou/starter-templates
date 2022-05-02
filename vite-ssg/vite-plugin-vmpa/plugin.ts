import fs from "fs"; 
import customTransformHtml from './pageTransform';


// -- plugins wrapper
export default function plugin() {
  return [vmpaPlugin(),  autoreloadExtraPlugin() ]
}


/**
 * main plugin
 * - virtual index.html
 * - maps .html to .md
 * - autogenerates input entries from .md/.html in root (/src)
*/
function vmpaPlugin () {
 
  let PAGES_ROOT = process.cwd().replace(/\\/g,'/') 
  let IS_DEV = true;

  return {
    name: 'myplugin',
    enforce: 'pre',

    config(config, {command}) {
      // console.log('--config');
      PAGES_ROOT += config.root ? '/'  + config.root : '';
      if (command === 'build') {
        IS_DEV = false;
        config.build = Object.assign( config.build ?? {}, {
          rollupOptions : {
            input : inputPages(PAGES_ROOT)
          }
        });
        console.log('--build2', config.build);
      }
    },

    configureServer(server) {

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
          let filePath = (PAGES_ROOT + req.originalUrl);
          let content = await customTransformHtml(filePath, PAGES_ROOT, true);
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
    async load(filePath) {
      // --build time only
      if (filePath.endsWith('.html')) {
        return await customTransformHtml(filePath, PAGES_ROOT, false)
      }
    },
    transform(src, filePath) {
      // --this is if you need to transform custom 'import' as well
      
      // -- dev time only, add HMR
      // if (IS_DEV && filePath.match(new RegExp(`${PAGES_ROOT}.*(\\.js|\\.ts)$`))) {
      //   src += `

      //     // -- autoincluded Vite HMR (in dev only)
      //     if (import.meta.hot) { import.meta.hot.accept((/*newModule*/) => {}) }
      //   `;
      //   return src;
      // }
    },
    async transformIndexHtml(html, ctx) {
      // dev should never reach here, intercepted by middleware
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

/**
 * Main plugin helper
*/
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

// -----------------------------------------------

/**
 *  Second plugin:
 *  - full page autoreload on .md change
*/
function autoreloadExtraPlugin() {
  return {
    name: 'autoreload-extra',
    enforce: 'post',
    handleHotUpdate({ file, server }) {
      if (file.match(/(\.md|\.build\.js)$/)) {
        console.log('full page reload, file:', file);
        server.ws.send({type: 'full-reload', path: '*'});
      
      // -- not needed, Vite does this already
      // } else if (file.endsWith('.css')) {
      //   console.log('hot updating css file:', file);
      //   server.ws.send({type: 'update', updates: [
      //     {path: file.match(/.*static(.*)/)[1], timestamp: Date.now()}
      //   ]});
      
      } else {
        console.log('file modified, but no update action taken:', file)
      }
    },
  }
}





// -- not needed, process.cwd() is enough
// function getViteConfigPath() {

//   // -- https://github.com/sindresorhus/callsites
//  function callsites() {
//    const _prepareStackTrace = Error.prepareStackTrace;
//    Error.prepareStackTrace = (_, stack) => stack;
//    // @ts-ignore
//    const stack = new Error().stack.slice(1); // eslint-disable-line unicorn/error-message
//    Error.prepareStackTrace = _prepareStackTrace;
//    return stack;
//  }

//  let vcPath = (<any>callsites())
//    .map((s:any)=>s.getFileName())
//    .filter((e:any)=>e?.includes('vite.config'))[0]
//    .replace(/\\/g,'/')
//    .replace(/^file:\/\//,'')
//    .replace(/\/vite\.config[^\/]*/,'')
 
//  // Windows, /C:/somedir => C:/somedir
//  if (vcPath.match(/^\/.:/)) {  
//    vcPath = vcPath.slice(1)  
//  }
  
//  console.log(vcPath)
//  return vcPath

// }