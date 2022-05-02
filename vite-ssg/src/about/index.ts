// -- Client only, HMR updated
setTimeout(()=>{
  // @ts-ignore
  document.querySelector(`#loader`).innerHTML = `updated by client 2`;
},1000);
console.log('--index.js executed')
