function queryAge({ age }) {
    return { age: age * 2 };
}
function queryName({ name }) {
    return { name: 'hi ' + name };
}
const api = { queryAge, queryName };
// const api = {queryAge}
export default api;
