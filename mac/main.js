// Plan de Volumen para Mac: abre la versión publicada en GitHub Pages.
// Cada cambio que se sube al repositorio aparece aquí la próxima vez que abras la app con internet.
const {app,BrowserWindow,shell,Menu}=require('electron');
const path=require('path');
const URL='https://marcosreinah88-design.github.io/plan-volumen/';
let win;
function create(){
  win=new BrowserWindow({width:460,height:900,minWidth:360,minHeight:600,title:'Plan de Volumen',backgroundColor:'#0E1113',
    webPreferences:{contextIsolation:true,sandbox:true}});
  win.loadURL(URL);
  // si no hay internet ni copia guardada, o Pages aún no está activado
  win.webContents.on('did-fail-load',(e,code,desc,url,isMain)=>{if(isMain)win.loadFile(path.join(__dirname,'offline.html'));});
  // enlaces de afuera se abren en el navegador
  win.webContents.setWindowOpenHandler(({url})=>{shell.openExternal(url);return {action:'deny'};});
  win.webContents.on('will-navigate',(e,url)=>{if(!url.startsWith(URL)&&!url.startsWith('file:')){e.preventDefault();shell.openExternal(url);}});
}
app.whenReady().then(()=>{
  const isMac=process.platform==='darwin';
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(isMac?[{role:'appMenu'}]:[]),{role:'editMenu'},
    {label:'Ver',submenu:[{label:'Recargar',accelerator:'CmdOrCtrl+R',click:()=>win&&win.loadURL(URL)},{role:'togglefullscreen'},{role:'resetZoom'},{role:'zoomIn'},{role:'zoomOut'}]},
    {role:'windowMenu'}]));
  create();
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)create();});
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
