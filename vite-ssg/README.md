# vite plugin vanilla mpa

vite plugin for a vanilla mpa similar to nextjs/sveltekit


## TODO

- tailwind?
- confirm index.ts are autoloaded (dev and build)
- server functions (build)
- configurable transformer: .md + layouts instead of .html, or other custom template, providing transformer.


# DONE

- postcss works (eg postcss nesting)
- both plugin in one clal
- add hotreload on .md change
- add vite-express frontmatter + loader.ts transforms, dont load .md if .html exists
- typescript + esm (tests single esm.tes with 'esmo' or node --loader ts-node/esm
- configurable layouts
- .md + layout instead of .html
- plugin works both in dev and 'vite build'
- plugin autoconfigs pages on build
- no empty index.html needed (intercepted by plugin)



## using tailwind (or other postcss plugin)

- rename to tailwind.config.cjs  // not .js

- add .md to content:

```tailwind
 content: [
    './src/**/*.{html,md,js,ts,css}',
  ],
```

remove postcss.config.js and use this in vite.config.ts

```vite
  css: {
    postcss: {
        plugins: [
            tailwindcss, autoprefixer
        ],
    },
  },
```
