
## TODO

- build: convert client .ts, bundle and copy static (vite?, rollup?)
  - how vite and rollup work together

- loader helper (hmr)
- tailwind: https://tailwindcss.com/docs/guides/vite
- consistent __dirname /C:/folder,, C:/folder  /c/folder, C:\\folder =>  [C:]/folder
  - shorten file pathserver / autoreload pluging skipped file console.log

## DONE

- generate all pages to html (1st part)
- page loader .ts refactor, auto include loader script in .md, returns frontmatter
- vanilla component pattern: ssr + client continue/hydrate
- estado, ssr+client
- move server require =>import, type=module in package.json
- optional loader .js/ts files for pages  
- layout chose from frontmatter
- convert markdown / frontmatter
- pages routing 
- static css hot reload
- generates shared/d.ts on restart
- rpc type sharing srv/client (ts-node-dev + server 
- typescript in server ts-node-dev
- typescript in client checked
- static folder
- folder organization client/server
- checked that client imports resolve node_modules
- hmr css & vanilla js modules (!)
- autoreload on md change
- pages routing markdown/html dynamic ssr


