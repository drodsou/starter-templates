import esbuild from 'esbuild';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';


/**
 * dynamic import a typescript file from javascript esm
*/
export default async function tsImport (tsFile) {
  tsFile = normalizePath(tsFile);
  let tmpFile = getTempFile('mjs');
  // console.log({tmpFile});
  
  await esbuild.build({
    // entryPoints: [dir + '/uno.ts'],
    entryPoints: [tsFile],
    bundle: true,
    target: 'esnext',
    format: 'esm',
    outfile: tmpFile,
  })

  let mod = await import('file://' + tmpFile)
    .finally(()=>{
      // console.log('--deletin', tmpFile)
      fs.promises.rm(tmpFile);
    })

  return mod;
}

// -- test
// ;(async ()=>{
//   // let mod = await tsImport('uno.ts');
//   mod.default();
// })();


// -- HELPERS

function getTempFile  (ext) {
  return fs.realpathSync(os.tmpdir())
    .replace(/\\/g,'/') + '/' 
    + crypto.randomUUID()
    + '.' + ext;
}

function normalizePath (filePath) {
  let newFilePath = filePath
    .replace(/\\/g,'/')
    .replace(/^file:\/\//,'');
  // Windows, /C:/somedir => C:/somedir
  if (newFilePath.match(/^\/.:/)) {  
    newFilePath = newFilePath.slice(1)  
  }
  return newFilePath
}