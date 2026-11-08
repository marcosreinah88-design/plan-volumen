// Plan de Volumen para Mac: abre la versión publicada en GitHub Pages.
// Cada cambio que se sube al repositorio aparece aquí la próxima vez que abras la app con internet.
// Seguridad: solo puede abrir tu app de GitHub Pages (https), todo lo demás se abre en el navegador o se bloquea;
// la página no tiene acceso a la Mac (sandbox, sin Node); la clave de GitHub se guarda cifrada en el Llavero.
const {app,BrowserWindow,shell,Menu,session,ipcMain,safeStorage}=require('electron');
const path=require('path'),fs=require('fs'),{pathToFileURL}=require('url');
const ORIGIN='https://marcosreinah88-design.github.io';
const URL_APP=ORIGIN+'/plan-volumen/';
const OFFLINE=pathToFileURL(path.join(__dirname,'offline.html')).href;
const okNav=u=>typeof u==='string'&&(u.startsWith(URL_APP)||u===OFFLINE);
const okExt=u=>{try{return new URL(u).protocol==='https:';}catch(e){return false;}};
const fromApp=e=>{try{const f=e.senderFrame;return !!f&&f===e.sender.mainFrame&&f.url.startsWith(URL_APP);}catch(er){return false;}};
app.enableSandbox();
if(!app.requestSingleInstanceLock()){app.quit();}
let win;
function create(){
  win=new BrowserWindow({width:460,height:900,minWidth:360,minHeight:600,title:'Plan de Volumen',backgroundColor:'#0E1113',
    webPreferences:{contextIsolation:true,sandbox:true,nodeIntegration:false,nodeIntegrationInWorker:false,nodeIntegrationInSubFrames:false,
      webSecurity:true,allowRunningInsecureContent:false,webviewTag:false,navigateOnDragDrop:false,spellcheck:false,
      preload:path.join(__dirname,'preload.js')}});
  win.loadURL(URL_APP);
  // si no hay internet ni copia guardada
  win.webContents.on('did-fail-load',(e,code,desc,url,isMain)=>{if(isMain&&code!==-3)win.loadFile(path.join(__dirname,'offline.html'));});
  // enlaces de afuera: solo https, y en el navegador
  win.webContents.setWindowOpenHandler(({url})=>{if(okExt(url))shell.openExternal(url);return {action:'deny'};});
  const guard=(e,url)=>{if(!okNav(url)){e.preventDefault();if(okExt(url))shell.openExternal(url);}};
  win.webContents.on('will-navigate',guard);
  win.webContents.on('will-redirect',guard);
  win.webContents.on('will-frame-navigate',e=>{if(!e.isMainFrame&&!okNav(e.url))e.preventDefault();});
}
// la clave de GitHub: cifrada con el Llavero de macOS, solo para tu app
const KEYFILE=()=>path.join(app.getPath('userData'),'clave-github.bin');
const encOk=async()=>{
  try{if(process.platform==='linux'&&safeStorage.getSelectedStorageBackend()==='basic_text')return false;
    return safeStorage.isAsyncEncryptionAvailable?await safeStorage.isAsyncEncryptionAvailable():safeStorage.isEncryptionAvailable();}catch(e){return false;}};
ipcMain.handle('pv:secure-get',async e=>{
  if(!fromApp(e)||!(await encOk()))return '';
  try{
    const buf=fs.readFileSync(KEYFILE());
    if(!safeStorage.decryptStringAsync)return safeStorage.decryptString(buf);
    const r=await safeStorage.decryptStringAsync(buf);
    if(r.shouldReEncrypt)fs.writeFileSync(KEYFILE(),await safeStorage.encryptStringAsync(r.result),{mode:0o600});
    return r.result||'';
  }catch(er){return '';}
});
ipcMain.handle('pv:secure-set',async(e,v)=>{
  if(!fromApp(e)||typeof v!=='string'||v.length>200)return false;
  try{
    if(!v){fs.rmSync(KEYFILE(),{force:true});return true;}
    if(!/^(ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{50,100})$/.test(v)||!(await encOk()))return false;
    const buf=safeStorage.encryptStringAsync?await safeStorage.encryptStringAsync(v):safeStorage.encryptString(v);
    fs.writeFileSync(KEYFILE(),buf,{mode:0o600});return true;
  }catch(er){return false;}
});
app.on('web-contents-created',(e,c)=>{
  c.on('will-attach-webview',ev=>ev.preventDefault());
  c.setWindowOpenHandler(({url})=>{if(okExt(url))shell.openExternal(url);return {action:'deny'};});
});
app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.focus();}});
app.whenReady().then(()=>{
  const ses=session.defaultSession;
  // permisos: solo copiar al portapapeles (botón Copiar); cámara, micrófono, ubicación, etc. siempre no
  ses.setPermissionRequestHandler((wc,perm,cb,d)=>cb(perm==='clipboard-sanitized-write'&&String(d&&d.requestingUrl||'').startsWith(URL_APP)));
  ses.setPermissionCheckHandler((wc,perm,origin)=>perm==='clipboard-sanitized-write'&&origin===ORIGIN);
  ses.setDevicePermissionHandler(()=>false);
  // nada sin cifrar: cualquier petición http:// se cancela
  ses.webRequest.onBeforeRequest({urls:['http://*/*','ws://*/*']},(d,cb)=>cb({cancel:true}));
  ses.on('will-download',(e)=>e.preventDefault());
  const isMac=process.platform==='darwin';
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(isMac?[{role:'appMenu'}]:[]),{role:'editMenu'},
    {label:'Ver',submenu:[{label:'Recargar',accelerator:'CmdOrCtrl+R',click:()=>win&&win.loadURL(URL_APP)},{role:'togglefullscreen'},{role:'resetZoom'},{role:'zoomIn'},{role:'zoomOut'}]},
    {role:'windowMenu'}]));
  create();
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)create();});
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
