// import api from './shared/apiServer';
// api.queryAge;

import {spawn} from 'child_process';
import path from 'path';
import express from 'express';
import  { createServer as createViteServer } from 'vite';
const __dirname = import.meta.url.split('/').slice(3,-1).join('/');

const isProd = process.env.NODE_ENV === 'production';
const SERVER_PORT = 3000;
const CLIENT_OUT = isProd ? path.resolve(__dirname, 'dist', 'client') : __dirname;
const RENDER_PAGE_PATH = `${isProd ? './dist/server' : __dirname}/render-page.ts`;
const INDEX_HTML_PATH = path.join(CLIENT_OUT, 'index.html');


// -- generate d.ts of shared api on restart (ts-node-dev)
if (!isProd) {
  console.log('-- generating server/shared d.ts');
  const child = spawn('node', [
    __dirname + '/../node_modules/typescript/bin/tsc', 
    __dirname + '/shared/apiServer.ts', '--declaration', '--emitDeclarationOnly'
  ]);
  child.stdout.on('data', data => process.stdout.write(data.toString()));
  child.stderr.on('data', data => process.stdout.write(data.toString()));
}

// TODO: dont use Vite in production
async function createServer() {
  const app = express()
  app.use(express.static(__dirname + '/../client/static'))

  // Create Vite server in middleware mode. This disables Vite's own HTML
  // serving logic and let the parent server take control.
  //
  // If you want to use Vite's own HTML serving logic (using Vite as
  // a development middleware), using 'html' instead.
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' },
    plugins: [autoreloadExtraPlugin()  ]

  })
  // use vite's connect instance as middleware
  app.use(vite.middlewares)

  // if (isProd) {
  //   app.use('/assets', express.static(path.join(CLIENT_OUT, 'assets')));
  // }

  app.use('*', async (req, res) => {
    const url = req.originalUrl
  
    try {
            // 3. Load the server entry. vite.ssrLoadModule automatically transforms
      //    your ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      let render;
      if (isProd) {
        ({ render } = await import(RENDER_PAGE_PATH));

      } else {
        ({ render } = await vite.ssrLoadModule(RENDER_PAGE_PATH));
      }
  
      // 4. render the app HTML. This assumes render-page.js's exported `render`
      //    function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      let html = await render(url)
      html = await vite.transformIndexHtml(url, html)
  
      // 5. Inject the app-rendered HTML into the template.
      // const html = template.replace(`<!--server-outlet-->`, appHtml)
  
      // 6. Send the rendered HTML back.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // If an error is caught, let Vite fix the stracktrace so it maps back to
      // your actual source code.
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })

  app.listen(SERVER_PORT, () => {
    console.log(`Server listening on port ${SERVER_PORT}`);
  })
}

createServer()



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