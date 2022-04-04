import { apiClient } from './apiClient.js';

(async ()=>{
  
  // typed
  let r1 = await apiClient('queryAge', { age: 6 });
  
  
  console.log(r1);

})();