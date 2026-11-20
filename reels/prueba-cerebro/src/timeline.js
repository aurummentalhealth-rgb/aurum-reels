// FILM.TIMELINE: "Prueba cerebro" — a 3 s complementary scene built over a supplied image.
// 80 bpm: a beat is 0.75 s; the film is one bar.
(function () {
  'use strict';
  const FILM = window.FILM;
  FILM.TIMELINE = {
    title: 'Prueba cerebro',
    bpm: 80,
    duration: 3,
    fps: 24,
    width: 1080,
    height: 1920,
    shots: [
      { id: 'cerebro', file: '01-cerebro.js', start: 0, end: 3, mode: 'illustrated', title: 'El cerebro se enciende', transitionIn: { kind: 'cut', dur: 0 },
        brief: 'The supplied engraving (brain, face, blue flowers) on grey, slow push-in anchored at the bottom. Sparks run along the brain like firing neurons, a dendrite network grows up from the crown into the empty grey above, blue petals drift, and a soft light sweep crosses the brain on the downbeats.' },
    ],
    cues: [
      { t: 0, kind: 'open', note: 'Soft shimmer pad' },
      { t: 0.75, kind: 'sfx', note: 'Spark bell' },
      { t: 1.5, kind: 'sfx', note: 'Spark bell, network blooms' },
      { t: 2.25, kind: 'swell', note: 'Light sweep bell' },
    ],
  };
})();
