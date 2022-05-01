const main = (body:string) => `
<!DOCTYPE html>
<html lang="{{lang}}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{title}}</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <h1>{{title}}</h1>
  ${body}
</body>
</html>
`;

const fourOfour = (body:string) => `
  <!DOCTYPE html>
  <html lang="{{lang}}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{title}}</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>404: Not found</h1>
    ${body}
  </body>
  </html>
`;

const layouts = {main, fourOfour};


export function withLayout (body, layout = 'main') {
  if (!(layout in layouts)) { 
    console.warn('layout not found:', layout);
    layout = 'default'; 
  }
  return layouts[layout](body);
}
