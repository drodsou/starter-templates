import fs from 'fs';
import path from 'path';
import { render } from './render-page';

const __dirname = import.meta.url.split('/').slice(3, -1).join('/');

const INDEX_HTML_PATH = path.resolve(__dirname, 'dist/static/index.html');


(async () => {
  // 1. Read
  const template = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

  // 2. Render
  const appHtml = await render('/');
  const html = template.replace('<!--server-outlet-->', appHtml);

  // 3. Write
  fs.writeFileSync(INDEX_HTML_PATH, html);
  console.log('Generated index.html');
  console.log('`npx serve dist/static` to run static server');
})();