# Storyboard · Puentes al colegio

**Idea:** el colegio está al otro lado de un río; la intervención en autismo pone, tabla por tabla, los apoyos que forman el puente. El niño cruza **sin dejar de ser quien es** (conserva sus audífonos).

**Números:** 80 bpm · 1 tiempo = 0,75 s · 1 compás = 3 s · 6 compases = 18 s · 1080×1920 · 24 fps · un plano por compás.

| # | id | T | Placa | Qué se ve | Texto en pantalla | Sonido |
|---|---|---|---|---|---|---|
| 1 | lejos | 0–3 | papel | Niño en el acantilado cercano, colegio al otro lado; una línea punteada no llega y cae al agua; «?». | ¿El colegio / se siente lejos? | kalimba; pregunta descendente 1,5 |
| 2 | tablas | 3–6 | plano azul | Caen las tablas 1 y 2 (3,75 / 4,5): globo de diálogo y agenda visual de 4 casillas. | Cada apoyo / es una tabla · Comunicación · Anticipar rutinas | cristal 3; golpes de madera |
| 3 | calma | 6–9 | papel | Primer plano: ruido (zigzags) → círculos de respiración; la cámara se aleja y cae la tabla 3 (7,5). | Herramientas / para regularse · Calma | ruido apagado; respiro 6,75; madera 7,5 |
| 4 | juntos | 9–12 | plano azul | Mamá y profesora ponen las tablas 4 y 5 (9,75 / 10,5); cuerdas y brillo a las 11,25. | Familia y colegio / construyen juntos · Familia · Colegio | cristal 9; madera; campanitas 11,25 |
| 5 | cruzar | 12–15 | papel | El niño cruza con sus audífonos; el compañero saluda; corazón y destellos (14,25). | No es cambiar quién es: / es tender puentes | ritmo completo 12; pasos 13,5; campanas 14,25 |
| 6 | cierre | 15–18 | crema #f6efe0 | Marco dorado, recuadro libre para el logo (x 540, y 860), puentecito al pie. | Agenda tu evaluación · Aurum Mental Health | acorde final 15; campana 16,5 |

## Geometría compartida (G1, `src/cast.js`)

| Elemento | Valor |
|---|---|
| Borde superior de los acantilados y del puente | y = 1100 |
| Borde del acantilado izquierdo / derecho | x = 320 / x = 760 |
| Tablas | 5 × 88 px, alto 30 |
| Agua | y ≥ 1430 |
| Niño | x = 200, 300 px de alto |
| Colegio | centro x = 925 |
| Tarjeta de texto | centro (520, 400), letra 66–76 px, borde derecho ≤ 945 |

Zona segura: todo el texto entre y = 290 y y = 1400, x entre 120 y 945.
