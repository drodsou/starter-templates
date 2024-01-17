import * as fs from 'fs';
import http from 'http';
import childProcess from 'child_process';
import {marked} from 'marked';

let mdDir = new URL('./md', import.meta.url).pathname.slice(1)  // antiguo: path.resolve(__dirname, './md')

function getMD() {
  
let mdFiles = fs.readdirSync(mdDir, {withFileTypes:true})
let mdAll = '';

for (let mdFile of mdFiles) {
  mdAll += '<i>' + mdFile.name.toUpperCase() + '</i><hr>\n\n'
  let mdFileContent = fs.readFileSync(mdDir + '/' + mdFile.name, 'utf-8')
  mdAll += marked.parse(mdFileContent)
  mdAll += `\n<p class="page-break"></p>`
  mdAll += `\n<p class="page-break-right"></p>`
}

mdAll = `
<html><body>
<style>
  .page {
    width: 170mm;

    padding: 40px;
  }
  .page-break {
    page-break-after: always;
  }
  .page-break-right {
    page-break-after: even;
  }
</style>
<div class="page">
\n` + mdAll + '</div></body></html>';

return mdAll;
}


// -- server
const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end(getMD());
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
    childProcess.exec(`start http://${host}:${port}`);
});






