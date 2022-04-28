import fs from 'fs';
import path from 'path';
import { render } from './render-page';

const __dirname = import.meta.url.split('/').slice(3, -1).join('/');

const pagesDir = path.resolve(__dirname, '../client/pages');
const distDir = path.resolve(__dirname, '../_dist');

const readdirSyncRecursive = (d)=>  fs.readdirSync(d, {withFileTypes:true})
  .map(f=>f.isDirectory() ? readdirSyncRecursive(d + '/' + f.name) : d + '/' + f.name)
  .flat();

let re = /pages(\/(.*)\.(md|html))$/
let pages = readdirSyncRecursive(pagesDir)
  .filter(e=> e.match(re))
  .map(e=>e.match(re)[1].replace('.md','.html'));

;(async () => {

  for (let url of pages) {
    let html = await render(url);
    fs.writeFileSync(distDir + url, html);
    console.log(`Generated ${distDir + url}`);
  }
})();