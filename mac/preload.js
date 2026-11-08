// Puente mínimo entre la página y la Mac: solo leer y guardar la clave de GitHub en el Llavero.
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('pvSecure',Object.freeze({
  get:()=>ipcRenderer.invoke('pv:secure-get'),
  set:(v)=>ipcRenderer.invoke('pv:secure-set',typeof v==='string'?v:'')
}));
