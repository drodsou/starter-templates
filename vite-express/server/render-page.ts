import {marked} from 'marked';
import {withLayout} from './render-layouts';
import fs from 'fs';
const __dirname = import.meta.url.split('/').slice(3,-1).join('/');

export async function render(url, context) {

  // -- parse requested url into specific file
  const urlObj = new URL(url, 'http://localhost');
  let urlPath = urlObj.pathname;
  if (urlPath.endsWith('.html')) {
    urlPath = urlPath.replace('.html', '')
  } else {
    if (urlPath.at(-1) !== '/') { urlPath += '/'; }
    urlPath += 'index'; 
  }

  // -- check if related file exists (.html o .md)
  let pagePath = __dirname + '/../client/pages' + urlPath
  if (fs.existsSync(pagePath + '.html')) {
    pagePath += '.html';
  } else if (fs.existsSync(pagePath + '.md')) {
    pagePath += '.md';
  } else {
    return withLayout(pagePath,'fourOfour');
  }

  // -- file exists, read file and parse content
  let pageContent = fs.readFileSync(pagePath, 'utf-8');

  // -- parse frontmatter
  const fmRegex = /^---\n([\s\S]*?)\n---\n/
  let pageFmText = (fmRegex.exec(pageContent) ?? [''])[0];
  let pageFmEntries = pageFmText.replaceAll('---','').trim().split('\n')
    .map(e => e.split(':').map(e2=>e2.trim()) )
  let pageFmObj = Object.fromEntries(pageFmEntries)

  // -- check frontmatter defaults
  if (!pageFmObj.lang) { pageFmObj.lang = 'en'; }
  if (!pageFmObj.titte) { pageFmObj.title = 'missing title'; }

  // -- get body, if markdown convert to html
  let pageBody = pageContent.replace(pageFmText, '')
  if (pagePath.endsWith('.md')) {
    pageBody = marked.parse(pageBody)
  }

  // -- add layout
  let pageHtml = withLayout(pageBody, pageFmObj.layout ?? 'main');

  // -- substitute frontmatter values
  pageFmEntries.forEach(fmEntry => {
    pageHtml = pageHtml.replaceAll(`{{${fmEntry[0]}}}`, fmEntry[1]);
  });

  // -- execute page loader if exists
  let pageLoaderPath = pagePath.replace(/(\.md|\.html)$/, '.loader.ts');
  console.log('loader?', pageLoaderPath)
  if (fs.existsSync(pageLoaderPath)) {
    console.log('imporing loader');
    // pageLoaderPath = pageLoaderPath.replace(".ts", "");
    pageHtml = (await import(pageLoaderPath)).default(pageHtml);
  }
  
  return pageHtml;
  
}



