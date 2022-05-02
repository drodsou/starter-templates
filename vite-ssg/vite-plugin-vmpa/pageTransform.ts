import {marked} from 'marked';
import {withLayout} from './pageLayouts';
import fs from 'fs';
import tsImport from './ts-import';
// const __dirname = import.meta.url.split('/').slice(3,-1).join('/');

export default async function pageTransform (pagePath, pageRootPath, isDev=false) {
  
  if (!fs.existsSync(pagePath)) {
    pagePath = pagePath.replace('.html','.md')
  } 
  if (!fs.existsSync(pagePath)) {
    return withLayout(pagePath,'fourOfour');
  } 

  // -- file exists, read file and parse content
  let pageContent = fs.readFileSync(pagePath, 'utf-8');

  // -- parse frontmatter
  const fmRegex = /^---\n([\s\S]*?)\n---\n/
  let pageFmText = (fmRegex.exec(pageContent) ?? [''])[0];
  let pageFmObj = Object.fromEntries(
    pageFmText.replace(/---/g,'').trim().split('\n')
      .map(e => e.split(':').map(e2=>e2.trim()) )
  )
  
  // -- add additional Fm entries from page's build script, if exist
  let pageBuildScriptPath = '';
  for (let ext of ['.build.js','.build.ts']) {
    let maybePath = pagePath.replace(/(\.md|\.html)$/, ext)
    if (fs.existsSync(maybePath)) {
      pageBuildScriptPath = maybePath;
      break;
    }
  }
  if (pageBuildScriptPath !== '') {
    let extraFmObj = pageBuildScriptPath.endsWith('.js')
      ? await import('file://' + pageBuildScriptPath).then(m=>m.default())
      : await tsImport('file://' + pageBuildScriptPath).then(m=>m.default());

    pageFmObj = {...pageFmObj, ...extraFmObj}
  }


  // -- auto add client script tag, if exists
  let pageClientScriptPath = '';
  for (let ext of ['.js','.ts']) {
    let maybePath = pagePath.replace(/(\.md|\.html)$/, ext)
    if (fs.existsSync(maybePath)) {
      pageClientScriptPath = maybePath;
      break;
    }
  }
  if (pageClientScriptPath !== '') {
    let relativeClientScriptPath = pageClientScriptPath.replace(pageRootPath,'')
    pageContent += `<script type="module" src="${relativeClientScriptPath}"></script>`
  }
   
  // -- check frontmatter defaults
  if (!pageFmObj.lang) { pageFmObj.lang = 'en'; }
  if (!pageFmObj.title) { pageFmObj.title = 'missing title'; }

  // -- get body, if markdown convert to html
  let pageBody = pageContent.replace(pageFmText, '')
  if (pagePath.endsWith('.md')) {
    pageBody = marked.parse(pageBody)
  }
  
  // -- add layout
  let pageHtml = withLayout(pageBody, pageFmObj.layout ?? 'main');

  // -- substitute frontmatter values
  Object.entries(pageFmObj).forEach(fmEntry => {
    pageHtml = pageHtml.split(`{{${fmEntry[0]}}}`).join(fmEntry[1]);
  });
  

  // -- auto link page css file, if exists
  let pageClientCssPath = '';
  for (let ext of ['.css']) {
    let maybePath = pagePath.replace(/(\.md|\.html)$/, ext)
    if (fs.existsSync(maybePath)) {
      pageClientCssPath = maybePath;
      break;
    }
  }
  if (pageClientCssPath !== '') {
    let relativeClientCssPath = pageClientCssPath.replace(pageRootPath,'')
    pageHtml = pageHtml.replace('</head>',
      `<link rel="stylesheet" href="${relativeClientCssPath}"></head>`
    );
  }
  

  return pageHtml;
  
}



