


export default async function api(_, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  }).end(JSON.stringify({
    some: "api result"
  }));

}