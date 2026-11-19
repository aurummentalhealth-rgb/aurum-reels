/*
 * Shot 4 · juntos · T 9.0–12.0 · blueprint plate
 * "Familia y colegio construyen juntos". A parent and a teacher on the far cliff lay planks 4 and 5
 * (T 9.75, T 10.5); at T 11.25 the ropes draw on and the whole bridge lights up.
 * Layers, back to front:
 *   1 blueprint ground, construction circles     5 bursts, plank glows
 *   2 river, cliffs, tree, school, child          6 tags Familia / Colegio with leaders
 *   3 parent and teacher                          7 completion arc and sparkles (T 11.25)
 *   4 planks 1–3 laid, 4 and 5 drop, ropes        8 the text card (screen-fixed)
 */
(function () {
  'use strict';
  const FILM = window.FILM;
  const ID = 'juntos';
  const TAU = Math.PI * 2;
  const FR = 1 / 24;
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  const B_P4 = 0.75;   // T 9.75
  const B_P5 = 1.5;    // T 10.5
  const B_DONE = 2.25; // T 11.25
  const DROP = 0.375;

  function burst(ctx, L, P, x, y, t, a, col) {
    const b = L.seg(t, a - FR, a + 0.5, 'outExpo');
    if (b <= 0 || b >= 1) return;
    L.ticks(ctx, x, y, { r: 30 + b * 50, n: 18, len: 16 + b * 40, color: col, alpha: 1 - b, width: 3 });
    L.guideCircle(ctx, x, y, 40 + b * 120, { color: col, alpha: (1 - b) * 0.8, width: 2.5 });
  }

  FILM.scene({
    id: ID,
    draw(ctx, tIn, info) {
      const L = info.lib;
      const P = L.pal;
      const C = FILM.cast;
      const G = C.G;
      const t = clamp(tIn, 0, info.dur);
      const T = info.shot.start + t;
      const S = { schem: true };
      const done = L.seg(t, B_DONE - FR, B_DONE + 0.6, 'outCubic');

      // 1 ground
      L.blueprint(ctx, { seed: 41, center: [540, G.deckY], circles: 5, diagonals: 6 });
      L.guideCircle(ctx, 540, G.deckY, 330, { alpha: 0.3, dash: [3, 8], cross: 18, quadrants: 14 });
      L.guideCircle(ctx, 540, G.deckY, 230, { alpha: 0.35, width: 1.4, p: 1 - L.seg(t, 0, 1.2, 'inOutCubic') * 0 });

      // 2 set
      C.river(ctx, T, S);
      C.cliffs(ctx, T, S);
      C.tree(ctx, T, 70, G.deckY + 4, 1.05, 960, S);
      C.school(ctx, T, S);
      C.child(ctx, { x: G.childX, y: G.deckY, s: 1, mood: done > 0.3 ? 'smile' : 'calm', pose: done > 0.3 ? 'arms' : 'stand', schem: true, line: P.lineWhite, t });

      // 3 the grown-ups: hands forward while they still hold a plank
      const c4 = 1 - L.seg(t, B_P4 - FR, B_P4 + 0.2);
      const c5 = 1 - L.seg(t, B_P5 - FR, B_P5 + 0.2);
      C.adult(ctx, { x: 850, y: G.deckY, s: 1.0, dir: -1, long: true, carry: c4 > 0.5 ? 1 : 0, schem: true, line: P.lineWhite, seed: 610, mood: 'smile' });
      C.adult(ctx, { x: 985, y: G.deckY, s: 1.06, dir: -1, bun: true, glasses: true, skirt: true, carry: c5 > 0.5 ? 1 : 0, schem: true, line: P.lineWhite, seed: 640, mood: 'smile' });
      // planks held at chest height before they are laid
      for (const [i, held, hx, hy] of [[3, c4, 850 - 70, G.deckY - 220], [4, c5, 985 - 74, G.deckY - 233]]) {
        if (held <= 0.5) continue;
        const pts = L.rectPts(hx - 42, hy - 15, 84, 30, 10);
        L.inkPath(ctx, pts, { closed: true, fill: P.navyLight, color: P.schemGold, width: 2.6, seed: 4100 + i });
      }

      // 4 planks
      C.bridge(ctx, 3, { schem: true, ghosts: true, line: P.lineWhite });
      const d4 = L.seg(t, B_P4 - DROP, B_P4, 'linear');
      const d5 = L.seg(t, B_P5 - DROP, B_P5, 'linear');
      if (d4 > 0) C.plank(ctx, 3, { schem: true, drop: d4, line: P.schemGold });
      if (d5 > 0) C.plank(ctx, 4, { schem: true, drop: d5, line: P.schemGold });
      if (done > 0) C.bridge(ctx, 5, { schem: true, ropes: done, line: P.lineWhite });

      // 5 bursts and glows
      burst(ctx, L, P, G.plankX(3) + 44, G.deckY + 15, t, B_P4, P.magenta);
      burst(ctx, L, P, G.plankX(4) + 44, G.deckY + 15, t, B_P5, P.magenta);
      for (let i = 0; i < 5; i++) {
        const on = i < 3 || (i === 3 && t >= B_P4 - FR) || (i === 4 && t >= B_P5 - FR);
        if (!on) continue;
        const pulse = done > 0 ? 1 + 0.6 * Math.sin(Math.min(1, done) * Math.PI) : 1;
        L.glowDot(ctx, G.plankX(i) + 44, G.deckY + 15, 9 * pulse, { color: P.schemGold, rays: done > 0 ? 6 : 0, rayLen: 2.4, glow: 4, twinkle: 0.1, rot: t + i });
      }

      // 6 tags
      const l4 = L.seg(t, B_P4, B_P4 + 0.4);
      const l5 = L.seg(t, B_P5, B_P5 + 0.4);
      if (l4 > 0) L.inkLine(ctx, G.plankX(3) + 44, G.deckY + 34, G.plankX(3) + 44, 1190, { color: P.schemGold, width: 2, seed: 4301, draw: l4 });
      if (l5 > 0) L.inkLine(ctx, G.plankX(4) + 44, G.deckY + 34, G.plankX(4) + 44, 1300, { color: P.schemGold, width: 2, seed: 4302, draw: l5 });
      C.tag(ctx, 'Familia', 560, 1220, l4, { schem: true, seed: 4311 });
      C.tag(ctx, 'Colegio', 560, 1340, l5, { schem: true, seed: 4312 });

      // 7 completion: a magenta arc links the child and the grown-ups, sparkles over the deck
      if (done > 0) {
        L.arcAnnotation(ctx, 520, 1090, 330, Math.PI * 1.12, Math.PI * 1.88, { color: P.magenta, width: 4, p: done, arrow: 18, dot: 6 });
        for (let k = 0; k < 9; k++) {
          const u = (k + 0.5) / 9;
          const x = lerp(G.leftEdge, G.rightEdge, u);
          const y = G.deckY - 40 - Math.sin(u * Math.PI) * 60 - L.h3(k, 4, 77) * 60;
          const tw = 0.5 + 0.5 * Math.sin(L.onTwos(t) * 9 + k * 2);
          L.glowDot(ctx, x, y, 5 + tw * 4, { color: k % 2 ? P.schemGold : P.lineWhite, rays: 4, rayLen: 3, glow: 2, rot: k });
        }
      }

      // 8 card
      C.card(ctx, ['Familia y colegio', 'construyen juntos'], { p: 0.75 + L.seg(t, 0, 0.25) * 0.25, size: 72, schem: true });
    },
  });
})();
