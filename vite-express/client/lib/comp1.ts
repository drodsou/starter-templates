const E_TYPE = 'eButton';

// server
function render (state) {
  return `
    <button e-type='${E_TYPE}' e-state='${JSON.stringify(state)}'>
      ${state.count}
    </button>
  `;
}

// client
function init (el, state){ 
  const update = ()=>{
    el.innerText = state.count;
    el.classList.add(state.count % 2 === 0 ? 'green' : 'red');
  }
  const action = {
    inc() {state.count++; update() },
    reset() {state.count = 0; update()},
  }
  el.addEventListener('click', action.inc);
  el._e = action;
}

// both 
function fetchState() {
  return {count:3}
}

// client onMount, common for all components
if (typeof window !== 'undefined') {
  [...document.querySelectorAll(`[e-type="${E_TYPE}"]`)].forEach((el:any) => {
    let serverState = JSON.parse(el.getAttribute('e-state'))
    init(el, serverState);
  });
}

export default {render, fetchState};



