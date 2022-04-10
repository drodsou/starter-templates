function queryAge ({age} : {age:number}) {
  return {age: age * 2}
}

function queryName ({name} : {name:string}) {
  return {name: 'hi ' + name}
}

const api = {queryAge, queryName}
// const api = {queryAge}

export default api

export type Api = typeof api;

