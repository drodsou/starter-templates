# react-vite-template

Minimal React/Vite starting template for quick tinkering with React, based on Vite official template.

Includes basic `/pages routing`, both static and lazy/dynamic versions. 

## Usage

Download
```
npx degit https://github.com/drodsou/react-vite-template.git YOUR_PROJECT_NAME
```

Run
```
cd YOUR_PROJECT_NAME
npm install

npm run dev
```

Rename `main-lazy.jsx` to main.jsx if you want to use the lazy router version, or delete `main-lazy.jsx` 

If using the default static router `main.jsx`, remember to import each `/src/page/` you create in `main.jsx` and also add them to the `pages` object just bellow the imports.
