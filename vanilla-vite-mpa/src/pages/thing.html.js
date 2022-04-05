const layout = ({title, body}) =>`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    ${body}
  </body>
  </html>
`;

export default async function page(props) {

  let page = `
    <button onclick="console.log('hey')">Click me</button>
  `;

  return layout({title:'thing', body: page});

}