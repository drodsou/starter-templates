import sirv from 'sirv';
import express, { Request, Response } from 'express';
import api from './apiServer';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV !== 'production';
const port = parseInt(PORT || '3000');

console.log(`listening in http://localhost:${port}`);

express() 
	.use(
		sirv(__dirname + '/client', { dev }),
    express.json()
	)
  .post('/api', apiController)
	.listen(port, (...args)=> {
		console.log('server:', args);
	});


  // -- API

function apiController (req: Request & {body:object}, res: Response) {
  
  // body: { api: xxx, args: {...} }
  console.log(req.body);
  // @ts-ignore
  let result = api[req.body.api](req.body.args)
  console.log('result:', result)
  res.json(result) ;    
}

  