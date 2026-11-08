// Arma "Plan de Volumen.app" para Mac (Apple M y Intel) a partir de Electron oficial.
// Uso: node mac/build_mac.js <carpeta con electron-arm64.zip y electron-x64.zip verificados> <carpeta de salida>
// Necesita: npm i @electron/asar @electron/fuses plist  (en la carpeta de trabajo)
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const asar=require('@electron/asar'),{flipFuses,FuseVersion,FuseV1Options}=require('@electron/fuses'),plist=require('plist');
const [,,DL,OUT]=process.argv,SRC=__dirname;
(async()=>{
for(const arch of ['arm64','x64']){
  const W=path.join(OUT,arch);fs.rmSync(W,{recursive:true,force:true});fs.mkdirSync(W,{recursive:true});
  cp.execFileSync('unzip',['-q',path.join(DL,`electron-${arch}.zip`),'-d',W]);
  const APP=path.join(W,'Plan de Volumen.app');fs.renameSync(path.join(W,'Electron.app'),APP);
  const RES=path.join(APP,'Contents/Resources');
  fs.rmSync(path.join(RES,'default_app.asar'),{force:true});
  const stage=path.join(W,'stage');fs.mkdirSync(stage);
  for(const f of ['main.js','preload.js','package.json','offline.html'])fs.copyFileSync(path.join(SRC,f),path.join(stage,f));
  await asar.createPackage(stage,path.join(RES,'app.asar'));fs.rmSync(stage,{recursive:true});
  fs.copyFileSync(path.join(SRC,'icon.icns'),path.join(RES,'electron.icns'));
  const pl=path.join(APP,'Contents/Info.plist'),P=plist.parse(fs.readFileSync(pl,'utf8'));
  P.CFBundleName='Plan de Volumen';P.CFBundleDisplayName='Plan de Volumen';P.CFBundleIdentifier='io.github.marcosreinah88.planvolumen';
  P.CFBundleShortVersionString='2.0.0';P.CFBundleVersion='2.0.0';
  const hdr=asar.getRawHeader(path.join(RES,'app.asar')).headerString;
  P.ElectronAsarIntegrity={'Resources/app.asar':{algorithm:'SHA256',hash:crypto.createHash('sha256').update(hdr).digest('hex')}};
  fs.writeFileSync(pl,plist.build(P));
  await flipFuses(APP,{version:FuseVersion.V1,resetAdHocDarwinSignature:false,
    [FuseV1Options.RunAsNode]:false,[FuseV1Options.EnableCookieEncryption]:true,[FuseV1Options.EnableNodeOptionsEnvironmentVariable]:false,
    [FuseV1Options.EnableNodeCliInspectArguments]:false,[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]:true,
    [FuseV1Options.OnlyLoadAppFromAsar]:true,[FuseV1Options.GrantFileProtocolExtraPrivileges]:false});
  const PK=path.join(W,'Plan-de-Volumen-Mac');fs.mkdirSync(PK);fs.renameSync(APP,path.join(PK,'Plan de Volumen.app'));
  fs.copyFileSync(path.join(SRC,'LEEME.txt'),path.join(PK,'LEEME.txt'));
  const zip=path.join(OUT,`Plan-de-Volumen-Mac-${arch==='arm64'?'Apple-M':'Intel'}.zip`);fs.rmSync(zip,{force:true});
  cp.execFileSync('zip',['-qry','--symlinks',zip,'Plan-de-Volumen-Mac'],{cwd:W});
  console.log(arch,'listo',(fs.statSync(zip).size/1e6).toFixed(0)+' MB');
}
})().catch(e=>{console.error(e);process.exit(1);});
