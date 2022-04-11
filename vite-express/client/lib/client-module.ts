
// you could here: import '../static/style.css';

import {supu} from './client-module2';
export function init() {
  supu();
};

init();
let a: string = 'a';

//- vite hmr
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    console.log('client-module.js hot updated:')
    newModule.init();
  })
}

