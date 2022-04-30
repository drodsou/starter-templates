# vite plugin vanilla mpa

vite plugin for a vanilla mpa similar to nextjs/sveltekit


# DONE

- .md + layout instead of .html
- plugin works both in dev and 'vite build'
- plugin autoconfigs pages on build
- no empty index.html needed (intercepted by plugin)


## TODO

- add vite-express frontmatter + loader.ts transforms
- tailwind?
- dont load .md if .html exists
- configurable transformer: .md + layouts instead of .html, or other custom template, providing transformer.
- configurable layouts
- server functions