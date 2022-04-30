export default function getViteConfigPath() {

   // -- https://github.com/sindresorhus/callsites
  function callsites() {
    const _prepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    // @ts-ignore
    const stack = new Error().stack.slice(1); // eslint-disable-line unicorn/error-message
    Error.prepareStackTrace = _prepareStackTrace;
    return stack;
  }

  let vcPath = (<any>callsites())
    .map((s:any)=>s.getFileName())
    .filter((e:any)=>e?.includes('vite.config'))[0]
    .replace(/\\/g,'/')
    .replace(/^file:\/\//,'')
    .replace(/\/vite\.config[^\/]*/,'')
  
  // Windows, /C:/somedir => C:/somedir
  if (vcPath.match(/^\/.:/)) {  
    vcPath = vcPath.slice(1)  
  }
   
  console.log(vcPath)
  return vcPath

 }


