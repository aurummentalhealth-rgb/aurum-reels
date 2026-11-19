# Aurum Reels · instrucciones para Claude

Este repositorio sirve para una sola cosa: **producir reels verticales para Instagram/Facebook/TikTok de Aurum Mental Health** con la skill `procedural-film` (`skills/procedural-film/SKILL.md`). Cada chat produce, normalmente, **un reel**.

La usuaria es psicóloga, no programadora. Háblale siempre en **español**, con lenguaje sencillo, sin jerga técnica, y pide su aprobación en los puntos marcados abajo.

## 1. Quién es Aurum

Aurum Mental Health es un centro de psicología y neuropsicología en Ecuador. Los reels pueden tratar cualquiera de sus servicios:

| Servicio | Enfoque para el reel |
|---|---|
| Evaluación neuropsicológica | Qué es, cuándo pedirla, qué mide (atención, memoria, funciones ejecutivas), qué recibe la familia (informe, recomendaciones). |
| Estimulación cognitiva para TDAH | Atención, control inhibitorio («el freno del cerebro»), memoria de trabajo, organización. |
| Problemas de aprendizaje | Dificultades en lectura, escritura y cálculo (dislexia, disgrafía, discalculia): señales tempranas, evaluación, intervención. |
| Autismo | Evaluación, diagnóstico e intervención para **aumentar la capacidad de adaptación** de la persona autista a su entorno: comunicación, autonomía, regulación, apoyos. |
| Rehabilitación neurocognitiva | Adultos y adultos mayores: memoria, atención, después de daño cerebral o con deterioro cognitivo. |
| Psicoterapia y psicoeducación | Terapia, orientación a madres, padres y familias. |

**Público principal: madres y padres** de niños y adolescentes en edad escolar. Escribe para ellos: frases cálidas, concretas, sin culpa («no es falta de voluntad», «hay formas de ayudar»).

## 2. Reglas clínicas y éticas (obligatorias)

- **Nada de diagnósticos en el video.** Se describen señales («si notas que…») y se invita a consultar; nunca «tu hijo tiene X».
- **Sin promesas** de cura ni de resultados («mejora garantizada», «en 10 sesiones»). Habla de apoyar, entrenar, acompañar.
- **Lenguaje respetuoso y no estigmatizante.** Nunca «sufre de», «padece», «normal vs. anormal», «enfermo». En autismo: «persona autista» o «persona con autismo»; destacar fortalezas, apoyos y adaptación, nunca «curar» ni «corregir» el autismo. En TDAH: no «niño malcriado», «vago» ni «hiperactivo» como etiqueta.
- **Contenido con evidencia.** Cada afirmación debe tener respaldo en una fuente fiable (guías clínicas, OMS, DSM-5-TR, artículos revisados). Anota las fuentes en `reels/<slug>/docs/fuentes.md`. Si algo no está claro en la evidencia, no lo afirmes.
- **Sin pacientes reales ni datos personales**, ni casos «basados en un paciente». Los personajes son genéricos e inventados.
- La usuaria **revisa y aprueba** el contenido clínico antes de publicar; recuérdaselo al entregar.

## 3. Formato del reel

- **Estilo por defecto: dibujado** (`drawn`), 1080×1920, 24 fps: tinta sobre papel alternado con planos técnicos azul marino, como `examples/butterfly-life`. Los otros modos (`photo-doodle`, `retro`) solo si la usuaria los pide; el retro es horizontal y habría que adaptarlo.
- **Duración: 15–20 s por defecto** (máximo 30 s). Entre **5 y 7 planos**. Menos planos = menos costo.
- **Sin voz.** El mensaje lo llevan las imágenes y el **texto en pantalla**:
  - como máximo **8 palabras por tarjeta** de texto, letra de **56 px o más**, alto contraste;
  - cada tarjeta visible al menos **1,5 s**;
  - zona segura de Reels: todo texto importante entre **y = 250 y y = 1540** y a más de **120 px del borde derecho** (ahí van los botones de Instagram). El control automático ya comprueba el borde inferior (380 px); el superior y el derecho los revisas tú en las capturas.
- **Idioma:** español neutro con trato de «tú» (Ecuador), con tildes y signos de apertura (¿¡).
- **Música:** la de la skill (sintetizada, sin derechos de autor). Volumen normalizado a −14 LUFS en la versión para teléfono (paso 10 de la skill).

## 4. Cierre del reel (llamado a la acción)

El llamado a la acción **va rotando**. Lee `reels/REGISTRO.md`, elige uno distinto del último reel y anótalo al terminar:

1. **«Agenda tu cita»**: texto «Agenda tu evaluación» + «Aurum Mental Health».
2. **«Síguenos para más»**: texto «Síguenos para más» + «Aurum Mental Health».
3. **Solo el logo**.

Cómo se hace (el control automático prohíbe imágenes dentro de la película, por eso el logo se pega después):

- El **último plano** (2,5–3 s) es de **papel crema claro** (color `#f6efe0` o parecido, en el estilo de la película) y deja **libre un recuadro de unos 460×500 px centrado en x = 540, y = 860**: sin trazos ni texto ahí. El texto del llamado a la acción va **debajo**, entre y = 1150 y y = 1450. En el tono de la marca: dorado `#b08858`, café `#604020`, gris oscuro `#202020`.
- Después de renderizar el master: `bash marca/poner-logo.sh reels/<slug>/exports/<slug>.mp4 <segundo en que empieza el último plano>` → crea `<slug>-logo.mp4` con el logo de Aurum (`marca/logo_aurum_transparente.png`) con un fundido suave. Las versiones para teléfono se hacen a partir de ese archivo.

## 5. Flujo de trabajo y costo

Sigue `skills/procedural-film/SKILL.md` (pasos 0 a 10) con estos cambios:

1. **Paso 0 (brief):** propone a la usuaria **2 o 3 enfoques** del tema (gancho de los primeros 2 segundos, mensaje central, cierre elegido) y espera su elección. Di qué inventaste.
2. **Proyecto:** crea `reels/<slug>/` (slug en minúsculas con guiones, p. ej. `freno-del-cerebro`) y copia ahí `skills/procedural-film/foundation/`. Playwright y ffmpeg ya están instalados en las sesiones en la nube; si `npm install` en `tools/` falla por red, prueba sin él.
3. **Antes del paso 7 (escenas, la parte más costosa): muestra el storyboard** en el chat (tabla: plano, segundos, qué se ve, texto en pantalla) y **espera la aprobación** de la usuaria.
4. **Escenas:** apunta a 500–1000 líneas por escena (menos que la mariposa), con la misma densidad visual en los planos clave.
5. **Críticos (paso 9):** **una sola ronda**, centrada en los problemas P1 (legibilidad en el teléfono, texto fuera de la zona segura, errores de contenido). Más rondas solo si la usuaria lo pide.
6. Muestra a la usuaria una **hoja de contacto** (paso 9) antes del render final y otra vez el video terminado.

Ignora `examples/claude-quest*` (son ejemplos de videojuegos ajenos a Aurum). El ejemplo útil es `examples/butterfly-life`.

## 6. Entregables de cada reel

En `reels/<slug>/`:

- `<slug>-telefono.mp4`: versión final para publicar (720×1280, con logo y audio normalizado). **Este es el archivo que se sube a git** (pesa unos 20 MB). Los masters de `exports/` no se suben (pesan ~200 MB y GitHub no acepta archivos de más de 100 MB); entrégalos en el chat si la usuaria los pide.
- `publicacion.md`: texto para la publicación (gancho, 3–5 líneas, llamado a la acción, 5–10 hashtags en español), y una **descripción accesible** del video para personas ciegas.
- `docs/` con el storyboard, la biblia de arte y `fuentes.md`.

Al terminar:

1. Añade una línea a `reels/REGISTRO.md` (fecha, slug, tema, servicio, cierre usado).
2. Haz commit y **push a `main`** (la usuaria lo autorizó para este repositorio): `git add reels/ && git commit && git push origin main`.
3. Envía el video y `publicacion.md` a la usuaria con la herramienta de envío de archivos.
4. Recuérdale revisar el contenido clínico antes de publicar.
