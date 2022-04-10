import fs from 'fs';
const __dirname = import.meta.url.split('/').slice(3,-1).join('/');

export function render(url, context) {
  console.log('render-page', url, context);
  

  let page = url.endsWith('about') ? 'about' : 'index';
  let pagePath = __dirname + `/../client/pages/${page}.md`
  
  console.log({pagePath})
  let pageContent = fs.readFileSync(pagePath, 'utf-8');

  // TODO frontpage & transform markdown, si es md
  const title = 'title'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
<h1>${url}</h1>
${pageContent}
</body>
</html>
`;
}