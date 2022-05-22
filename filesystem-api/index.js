let file = {};

file.load = async function () {
  ;[this.handle] = await window.showOpenFilePicker()
  this.info = await this.handle.getFile();
  this.text = await this.info.text();
  this.data = JSON.parse(this.text);
  console.log(this.data)
  // await this.save(); // optional: ask for save consent immediatly 
}

file.save = async function() {
  // delete this:
  this.data[Date.now()] = Math.random()

  this.stream = await this.handle.createWritable();
  await this.stream.write(JSON.stringify(this.data,null,2));
  await this.stream.close();

}

// needs to come from a user event
document.querySelector(`#load`).addEventListener('click', ()=>file.load());
document.querySelector(`#save`).addEventListener('click', ()=>file.save());
// --visualize page reloads
setTimeout(()=>{
  document.querySelector(`#starting`).innerHTML = '';
}, 500);


// setTimeout(()=>{
//   // no need to come from a user event
//   console.log("autosaving");
//   file.save()
// }, 8000)





// file.load() // direct calls fail, need to come from user gesture