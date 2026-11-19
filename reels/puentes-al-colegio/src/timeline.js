// FILM.TIMELINE: shot list and audio cues for "Puentes al colegio" (Aurum Mental Health).
// 80 bpm: a beat is 0.75 s (18 frames at 24 fps); a bar is 3 s; every shot is one bar.
(function () {
  'use strict';
  const FILM = window.FILM;

  FILM.TIMELINE = {
    title: 'Puentes al colegio',
    bpm: 80,
    duration: 18,
    fps: 24,
    width: 1080,
    height: 1920,
    shots: [
      { id: 'lejos', file: '01-lejos.js', start: 0, end: 3, mode: 'illustrated', title: '¿El colegio se siente lejos?', transitionIn: { kind: 'cut', dur: 0 },
        brief: 'Paper. A child with a backpack stands on the near cliff, the school on the far cliff, a river gap between. A dashed blue arc tries to reach the school and falls short. Card: ¿El colegio se siente lejos?' },
      { id: 'tablas', file: '02-tablas.js', start: 3, end: 6, mode: 'schematic', title: 'Cada apoyo es una tabla', transitionIn: { kind: 'cut', dur: 0 },
        brief: 'Blueprint of the same set. Five dashed plank slots; planks 1 and 2 drop in on beats 3.75 and 4.5 with magenta flashes, labelled Comunicación (speech bubble) and Anticipar rutinas (mini visual schedule). Card: Cada apoyo es una tabla.' },
      { id: 'calma', file: '03-calma.js', start: 6, end: 9, mode: 'illustrated', title: 'Herramientas para regularse', transitionIn: { kind: 'cut', dur: 0 },
        brief: 'Paper. Close on the child with headphones; jagged noise marks around the head soften into round breathing rings. Pull back to the wide set; plank 3 (Calma) drops at 7.5. Card: Herramientas para regularse.' },
      { id: 'juntos', file: '04-juntos.js', start: 9, end: 12, mode: 'schematic', title: 'Familia y colegio construyen juntos', transitionIn: { kind: 'cut', dur: 0 },
        brief: 'Blueprint. A parent and a teacher on the far cliff lay planks 4 (Familia) and 5 (Colegio) on beats 9.75 and 10.5; at 11.25 the ropes draw on and the bridge glows complete. Card: Familia y colegio construyen juntos.' },
      { id: 'cruzar', file: '05-cruzar.js', start: 12, end: 15, mode: 'illustrated', title: 'No es cambiar quién es: es tender puentes', transitionIn: { kind: 'cut', dur: 0 },
        brief: 'Paper. The finished bridge with ropes. The child walks across and is greeted by a classmate by the school; gold sparkles. Card: No es cambiar quién es: / es tender puentes.' },
      { id: 'cierre', file: '06-cierre.js', start: 15, end: 18, mode: 'illustrated', title: 'Agenda tu evaluación', transitionIn: { kind: 'fade', dur: 0.375 },
        brief: 'Light cream paper (#f6efe0). A clear 460x500 box at x 540, y 860 for the Aurum logo (pasted later). A small bridge doodle frames the bottom. Agenda tu evaluación + Aurum Mental Health between y 1150 and 1450.' },
    ],
    cues: [
      { t: 0, kind: 'open', note: 'Soft pad and kalimba motif' },
      { t: 1.5, kind: 'sfx', note: 'Falling two-note question as the arc falls short' },
      { t: 3, kind: 'cut', note: 'Glass ping into the blueprint' },
      { t: 3.75, kind: 'hit', note: 'Wood knock: plank 1' },
      { t: 4.5, kind: 'hit', note: 'Wood knock: plank 2' },
      { t: 6, kind: 'cut', note: 'Paper: muffled noise bed fades' },
      { t: 6.75, kind: 'swell', note: 'Breath-in swell' },
      { t: 7.5, kind: 'hit', note: 'Wood knock: plank 3' },
      { t: 9, kind: 'cut', note: 'Glass ping into the blueprint' },
      { t: 9.75, kind: 'hit', note: 'Wood knock: plank 4' },
      { t: 10.5, kind: 'hit', note: 'Wood knock: plank 5' },
      { t: 11.25, kind: 'swell', note: 'Bridge complete: rising chime' },
      { t: 12, kind: 'cut', note: 'Full groove: warm chord' },
      { t: 13.5, kind: 'sfx', note: 'Footstep taps on the planks' },
      { t: 14.25, kind: 'sfx', note: 'Sparkle bells as the friend waves' },
      { t: 15, kind: 'fade', note: 'Resolving chord into the close' },
      { t: 16.5, kind: 'sfx', note: 'Soft bell' },
    ],
  };
})();
