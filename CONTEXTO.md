# Contexto rápido — Plan de Volumen

App personal de gym + dieta de Marcos David Reinah Guzmán. Lee esto antes de cambiar algo.
Contexto completo (decisiones, historial, reglas de rutina y dieta): vault de Obsidian **CASA › Proyectos › GYM**.

## Estructura
| Ruta | Qué es |
|---|---|
| `src/app.js` | Toda la lógica (Hoy, Entreno, Comida, Progreso, Guía, Ajustes, sincronización, avisos, seguridad) |
| `src/app.html`, `src/app.css` | Plantilla y estilos |
| `src/diet.js` | Dieta SMAE (menús, equivalentes); se inserta en `/*DIET*/` |
| `src/data.json` | Rutina por día, imágenes de ejercicios, textos largos y fuentes (`frag`) |
| `build.py` | Arma `index.html`, `sw.js`, `manifest.webmanifest` e `icons/` en la raíz (GitHub Pages) |
| `avisos/` + `.github/workflows/avisos.yml` | Envío de notificaciones push cada 10 min (GitHub Actions) |
| `mac/` | Envoltura Electron de la app de Mac; `build_mac.js` arma los zips |

## Cómo se publica un cambio
1. Editar solo `src/` (nunca `index.html` ni `sw.js` a mano).
2. `python3 build.py` (necesita Pillow).
3. Probar en un navegador local (sin errores en consola, sin avisos de CSP).
4. Commit y push a `main`: GitHub Pages publica y el service worker actualiza el iPhone y la Mac al abrir con internet.
5. La app de Mac solo se reconstruye si cambia `mac/` (nuevo zip + reinstalar con la línea de `mac/LEEME.txt`).

## Reglas
- **Nunca** escribir claves, tokens ni contraseñas en el repo, en notas ni en registros. El repo es público.
- Cambios de rutina o dieta solo con aprobación de Marcos; un cambio con fecha va en `routine9()` o con otra fecha de corte, para no reescribir días pasados.
- Renombrar un ejercicio conserva su `id` para no partir el historial.
- Cambios de rutina vigentes desde el 9 nov 2026 viven en `routine9()` + `data.json` → `nov9` (press francés con mancuernas, dominadas asistidas, aperturas en máquina/pec deck del lunes con la polea como opción `alt`, elevaciones laterales del lunes con mancuernas en vez de polea). Cada ejercicio nuevo necesita su fila en `MUSX` para el diagrama de músculos.
- Datos que entran pasan por `sanDoc()`; cualquier campo nuevo en documentos debe validarse ahí.
- Toda conexión externa nueva debe agregarse a la CSP de `build.py`.
- Escanear Tanita con IA (Progreso → Cuerpo, solo en la PWA y la Mac): manda la foto/PDF a Gemini (`gemini-3.8-flash`, con respaldo `gemini-3.5-flash` y `gemini-flash-latest` si da 404 o tarda más de 60 s; `gemini-2.5-flash` ya no está disponible para cuentas nuevas). Las claves nuevas de AI Studio empiezan con `AQ.` (las viejas con `AIza`) usando la clave **propia** de Marcos, guardada solo en el equipo (`localStorage` `pvmgem:key`, no se sincroniza). La respuesta pasa por `gemClean()` (rangos, lb→kg, segmentos −4…4) y solo llena el formulario: nada se guarda hasta que él revisa y toca Guardar. La clave se pone o se borra en Ajustes → IA para la Tanita (se saca gratis en aistudio.google.com/apikey).
- Sin internet (service worker, en `build.py`): la app se pide a internet pero si no contesta en 3 s, falla o regresa una página sin la marca `<!--pv-app-->` (wifi con inicio de sesión, error), abre la copia guardada; la versión nueva se baja en segundo plano. Las letras de Google se guardan en la caché `pv-fonts` para no bloquear la pantalla sin señal. No quitar la marca `<!--pv-app-->` del `<head>`. Probar cambios del service worker con el navegador local en modo sin conexión y con el servidor colgado.
- Nota por medición de Tanita: cada entrada del doc `tanita` puede llevar `h` (hora HH:MM), `cond` (códigos de `TCOND`: ayunas, después de comer/entrenar, sin ir al baño, etc.) y `nota` (≤300 caracteres); se validan en `sanDoc()` y se muestran con `esc()`. La IA llena la hora si la hoja la trae. Se edita con "Agregar/Editar nota" sin tocar los números.
- Peso sugerido (Entreno, `sugFor()`): doble progresión con el rango de `sr`. Si la vez pasada todas las series con el peso más alto llegaron al tope de reps, sugiere +5 lb (`STEP`) y lo pone de placeholder; si no, mismo peso y +1 rep; en semana de descarga, mismo peso. Solo sugiere, no guarda nada.
- Rodilla (Entreno, miércoles y sábado, `LEGK`): dolor 0–10 en el doc del día como `rod` (validado en `sanDoc()`, se junta en `mergeDay`). `rodReady()` avisa de preguntar al fisio por la sentadilla cuando hay 4+ días de pierna seguidos con 0–1 que abarcan 14+ días.
- Resumen de la semana (Hoy, `renderWsum()`): domingo muestra la semana actual y lunes la pasada: sesiones contra la meta del modo (6/4/2), días de dieta, peso promedio contra la semana anterior, ejercicios donde subió peso o reps y la rodilla.
- Sincronización: gist secreto cifrado (`plan-volumen-datos.cifrado.json`); no cambiar el formato sin migración.
- Pesos del gym en lb; peso corporal en kg (cambiable en Ajustes).
- Textos de la interfaz en español, tono directo, sin mayúsculas forzadas.
- Comparación al completar la rutina (Entreno, `cmpHTML()` debajo de "Entreno completo"): busca la última sesión con la misma rutina (`dayKeyOf`, hasta 6 semanas atrás, normalmente 7 días) y compara por ejercicio el peso más alto y sus reps, volumen y reps totales, y la duración. El análisis (qué hiciste bien / qué no salió / qué mejorar) sale de reglas locales, sin internet: tope de reps → +5 lb, bajó → repetir peso, reps que se caen >30 % entre series → descanso completo, igual → +1 rep; en descarga no cuenta como retroceso. No guarda nada.
