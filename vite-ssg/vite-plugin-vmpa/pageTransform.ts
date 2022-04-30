import {marked} from 'marked';
import {withLayout} from './pageLayouts';
import fs from 'fs';
// const __dirname = import.meta.url.split('/').slice(3,-1).join('/');

export default async function pageTransform (pagePath, context={}) {
  console.log('--pageTransform', pagePath);
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
  
  // -- add additional Fm entries from server loader, if exist
  let pageLoaderPath = pagePath.replace(/(\.md|\.html)$/, '.ts');
  

  if (fs.existsSync(pageLoaderPath)) {

    console.log({pageLoaderPath})
    let loaderFmObj = await import('file://' + pageLoaderPath).then(m=>m.frontmatter());
    pageFmObj = {...pageFmObj, ...loaderFmObj}

    // auto add loader script tag for client
    let clientScriptPath = pageLoaderPath.match(/\/client\/.*$/)[0]
    pageContent += `<script type="module" src="${clientScriptPath}"></script>`
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
  
  

  return pageHtml;
  
}



