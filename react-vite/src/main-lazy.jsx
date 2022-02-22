import React from 'react'
import ReactDOM from 'react-dom'
import './main.css'

// -- dynamically imports react component /#About => ./pages/About.jsx
function ImportHashPage() {
  let newPageRoute = window.location.hash.replace('#','./pages/') || './pages/Index';
  return React.lazy(() => {
    return import(newPageRoute).catch(() => ({ 
      default: () => <div>404 Not found: {newPageRoute}</div> 
    }))
  })
}

const navLinks = ['Index', 'About'];

function Main () {
  const [Page, setPage] = React.useState(ImportHashPage); // useState executes passed function (?)
  React.useEffect(()=>{
    window.addEventListener('hashchange', ()=> setPage(ImportHashPage));
  },[]);

  return (
    <>
      <nav>{navLinks.map((e,i)=><a key={i} href={'#'+e}>{e}</a>)}</nav>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Page />
      </React.Suspense>
    </>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
)
