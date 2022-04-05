import handlebars from 'vite-plugin-handlebars';
import myplugin from './myplugin';
import { resolve } from 'path';



// middleware
const mymiddleware = {
  name: 'mymiddleware',
  configureServer(server) {
    server.middlewares.use('/api', (req, res, next) => {
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({valgame: 'elpayo'}));
      // req.url += '.html'
      // next()
    })
  }
}



// handlebars
// const pageData = {
//   '/index.html': {
//     title: 'Index',
//   },
//   '/about/index.html': {
//     title: 'About',
//   },
// };

const root = resolve(__dirname, 'src/pages');
const outDir = resolve(__dirname, 'dist');

// auto /pages
const fs = require('fs');
const dir = (d) => fs.readdirSync(d, {withFileTypes:true})
  .map(f=>f.isDirectory() ? dir(d + '/' + f.name) : d + '/' + f.name)
  .flat();
let re = /pages\/(.*)\/index\.html/
let pages = dir(root)
  .filter(e=> e.match(re))
  .map(e=>e.match(re)[1]);
  
const input = {
  index: resolve(root, 'index.html'),
}  
pages.forEach(p=>input[p] = resolve(root, p + '/index.html'));

// - config
export default {
  root,
  plugins: [
    mymiddleware,
    myplugin(),
    // handlebars({
    //   partialDirectory: resolve(__dirname, 'src/_partials'),
    //   // context(pagePath) {
    //   //   return pageData[pagePath];
    //   // },
    // }),
  ],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input
    }
  }
};



// export default defineConfig(({ command, mode }) => {
//   // -- DEV
//   if (command === 'serve') {
//     return {
      

//     }
//   } 
//   // -- BUILD
//   else {
//     // command === 'build'
//     return {
//       // build specific config
//     }
//   }
// })