"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sirv_1 = __importDefault(require("sirv"));
const express_1 = __importDefault(require("express"));
const apiServer_1 = __importDefault(require("./apiServer"));
const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV !== 'production';
const port = parseInt(PORT || '3000');
console.log(`listening in http://localhost:${port}`);
(0, express_1.default)()
    .use((0, sirv_1.default)(__dirname + '/client', { dev }), express_1.default.json())
    .post('/api', apiController)
    .listen(port, (...args) => {
    console.log('server:', args);
});
// -- API
function apiController(req, res) {
    // body: { api: xxx, args: {...} }
    console.log(req.body);
    // @ts-ignore
    let result = apiServer_1.default[req.body.api](req.body.args);
    console.log('result:', result);
    res.json(result);
}
