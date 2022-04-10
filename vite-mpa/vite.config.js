import handlebars from 'vite-plugin-handlebars';
import myplugin from './myplugin';
import { resolve } from 'path';



// middleware
const mymiddleware = {
  name: 'mymiddleware',
  configureServer(server) {
    server.middlewares.use('', (req, res, next) => {
      console.log('mid', req.url)
      req.url += 'index.md'
      next()
    })

    server.middlewares.use('/api', (req, res, next) => {
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({valgame: 'elpayo'}));
      // req.url += '.html'
      // next()
    })
  }
}


const root = resolve(__dirname, 'src/pages');
const outDir = resolve(__dirname, 'dist');

// auto /pages
const fs = require('fs');
const dir = (d) => fs.readdirSync(d, {withFileTypes:true})
  .map(f=>f.isDirectory() ? dir(d + '/' + f.name) : d + '/' + f.name)
  .flat();
let re = /pages\/(.*)\/index\.(md)/
let pages = dir(root)
  .filter(e=> e.match(re))
  

console.log(pages)
  
const input = {
  index: resolve(root, 'index.html'),
}  
pages.forEach(p=>{
  let [route, ext] = p.match(re)
  input[p] = resolve(root, p + `/index.md`);
});

// - config
export default {
  root,
  plugins: [
    mymiddleware,
    myplugin(),
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