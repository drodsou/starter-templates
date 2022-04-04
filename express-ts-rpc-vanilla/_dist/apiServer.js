"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function queryAge({ age }) {
    return { age: age * 2 };
}
function queryName({ name }) {
    return { name: 'hi ' + name };
}
const api = { queryAge, queryName };
exports.default = api;
