# Plan de Volumen

App de dieta (SMAE) y rutina de gym. Se instala en el iPhone desde Safari y se actualiza sola cada vez que hay cambios en este repositorio.

**Abrir:** https://marcosreinah88-design.github.io/plan-volumen/

## Instalar en el iPhone
1. Abre el enlace en **Safari**.
2. Toca Compartir y luego **Agregar a pantalla de inicio**.
3. Abre la app desde el ícono nuevo.

## Tus registros
Se guardan en el propio iPhone (no en este repositorio). En **Progreso → Respaldo** puedes guardar un archivo de respaldo y cargarlo en otro equipo. Haz uno cada semana.

## Cómo se actualiza
- El código está en `src/` (`app.js`, `app.css`, `app.html`, `diet.js`, `data.json`).
- `python3 build.py` arma `index.html`, `manifest.webmanifest`, `sw.js` e `icons/`.
- Al subir a `main`, GitHub Pages publica la versión nueva. El service worker pide primero la versión de internet, así que la app instalada la recibe la próxima vez que se abra con señal.

## App de Mac
`mac/` tiene la envoltura de la app de Mac (Electron 33.2.1): abre la URL de GitHub Pages, así que se actualiza sola igual que la del iPhone. Para armarla se copia `main.js`, `package.json` y `offline.html` a `Electron.app/Contents/Resources/app/`, `icon.icns` a `Contents/Resources/electron.icns`, y se cambia el nombre en `Info.plist`. Instrucciones de instalación en `mac/LEEME.txt`.
