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
`mac/` tiene la envoltura de la app de Mac (Electron 45.2.3): abre la URL de GitHub Pages, así que se actualiza sola igual que la del iPhone. Para armarla se copia `main.js`, `package.json` y `offline.html` a `Electron.app/Contents/Resources/app/`, `icon.icns` a `Contents/Resources/electron.icns`, y se cambia el nombre en `Info.plist`. Instrucciones de instalación en `mac/LEEME.txt`.


## Seguridad
- **Datos que entran** (respaldo, GitHub, almacenamiento): pasan por `sanDoc` en `src/app.js` (quita caracteres para inyectar código, llaves `__proto__`, tamaños y tipos raros).
- **CSP**: `build.py` agrega una Content-Security-Policy con la huella sha256 de cada script; nada más se ejecuta y solo se conecta a GitHub.
- **Sincronización cifrada**: el gist guarda `plan-volumen-datos.cifrado.json` (AES-256-GCM, llave PBKDF2-SHA256 310 000 vueltas derivada de la clave de GitHub). Si el archivo se altera o se cambió de clave, la app no lo usa ni lo sobrescribe.
- **Avisos** (`.github/workflows/avisos.yml`): acciones fijadas por SHA, `permissions: contents: read`, dependencias con `package-lock` y `npm ci --ignore-scripts`, registros sin datos personales.
- **Mac** (`mac/`): sandbox, sin Node en la página, navegación solo a la app, enlaces solo https en el navegador, permisos negados, http bloqueado, clave en el Llavero (`safeStorage`), app empaquetada en asar con verificación de integridad y fuses (sin RunAsNode/NODE_OPTIONS/inspect). Se arma con `node mac/build_mac.js <zips de Electron verificados> <salida>`.
