
import fs from 'fs';

const __d = import.meta.url.split('/').slice(3,-1).join('/');

console.log(__d, fs.readFileSync)