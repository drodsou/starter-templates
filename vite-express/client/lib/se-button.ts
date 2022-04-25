// const SE_TYPE = import.meta.url.split('/').slice(-1)[0].replace(/\.(js|ts)$/,'');
const SE_TYPE = 'se-button';

// both 
function fetchState(initCount) {
  return {count:initCount}
}

// server
async function render (initCount=3) {
  let state = await fetchState(initCount);
  return `
    <button ${SE_TYPE}='${JSON.stringify(state)}'>
      ${state.count}
    </button>
  `;
}

// client
async function onMount (el, state){ 
  const update = ()=>{
    el.innerText = state.count;
    el.classList.add(state.count % 2 === 0 ? 'green' : 'red');
  }
  const action = el._action = {
    inc() {state.count++; update() },
    reset() {state.count = 0; update()},
  }
  el.addEventListener('click', action.inc);
}


// client, common for all components
if (typeof window !== 'undefined') {
  [...document.querySelectorAll(`[${SE_TYPE}]`)].forEach((el:any) => {
    let serverState = JSON.parse(el.getAttribute(SE_TYPE))
    onMount(el, serverState);
  });
}

export default {render}


