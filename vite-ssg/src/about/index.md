---
title: About
---

## frontmateer test

md frontmatter `title` should appear above, and on the browser's tab.

## style text

- this pages should be automatically affected by `/src/style.css`

## build + client test

{{loader}}

it shoud be something up here on initial page load, coming from `about/index.build.js`, and then changed from `about/index.client.js` soon after


## HMR dev import test

<button onClick="this.innerText = parseInt(this.innerText)+1">0</button>

- When in DEV, if you click this button and then modify `about/index.client.ts`, it shoul HMR reload the above, without losing the button state.

- Also when in DEV, modifying /src/style.css should change styles without resetting the button state


