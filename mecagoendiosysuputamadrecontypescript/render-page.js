import { readFileSync } from 'fs';
const __dirname = import.meta.url.split('/').slice(3, -1).join('/');
export async function render() {
    const mod = './suputamadre.ts';
    console.log(__dirname, readFileSync);
    console.log((await import(mod)).default('uno'));
}
render();
