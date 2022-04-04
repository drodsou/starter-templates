const {watch} = require('fs');
const {spawn} = require('child_process');
const { cp } = require('fs/promises');
// const { watch } = require('fs/promises');


function run(...args) {
  const [prog, ...rest] = args;
  const child = spawn(prog, rest);
  child.stdout.on('data', data => process.stdout.write(data.toString()));
  child.stderr.on('data', data => process.stdout.write(data.toString()));
  return new Promise(resolve=>{
    child.on('exit', code=>resolve(code));
  });
};

const buildQueue = new Set(['tsc:server', 'tsc:client','cp:public','node:server'])
let nodeServer;

async function build() {

  const tasks = {
    'tsc:server': async () => {
      process.chdir(__dirname + '/src/server');
      return await run('node', __dirname + '/node_modules/typescript/bin/tsc'); 
    },
    'tsc:client': async () => {
      process.chdir(__dirname + '/src/client');
      return await run('node', __dirname + '/node_modules/typescript/bin/tsc'); 
    },
    'cp:public': async () => {
      return await cp(__dirname + '/src/client/public', __dirname + '/_dist/client', {recursive: true});
    },
    'node:server': async () => {
        if (nodeServer) nodeServer.kill();
        process.chdir(__dirname + '/_dist');
        nodeServer = run('node','server.js');
        return 0;
    },
  }

  
  for (let taskKey of buildQueue) {
    console.log(taskKey);
    const res = await tasks[taskKey]();
    if ((res ?? 0) !== 0) { break; } 
    buildQueue.delete(taskKey);
  }


}

async function main() { 
  await build();
  startWatching();
}


function startWatching() {
  let lastTime = 0;
  let building = false;
  watch(__dirname + '/src', {recursive: true}, async (eventType, filename) => {
    if (building || (Date.now() - lastTime < 1000)) return;
    lastTime = Date.now();
    building = true;
    console.log(filename);
    filename = filename.replaceAll('\\', '/');
    if (filename.includes('client/lib')) { buildQueue.add('tsc:client'); }
    if (filename.includes('client/public')) { buildQueue.add('cp:public'); }
    if (filename.includes('server')) { 
      buildQueue.add('tsc:server'); 
      buildQueue.add('node:server'); 
    }
    await build();
    building = false;
  })
}

main();



