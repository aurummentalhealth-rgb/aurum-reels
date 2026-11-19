/*
 * Shot 3 · calma · T 6.0–9.0 · paper plate
 * "Herramientas para regularse". Close on the child wearing headphones: jagged noise marks around
 * the head soften into round breathing rings, then the camera pulls back to the wide set and
 * plank 3 (Calma) drops in on T 7.5.
 * Layers, back to front (inside the camera):
 *   1 sky, river, cliffs, tree, school       4 noise zigzags (fading) and breathing rings
 *   2 planks 1–2 laid, plank 3 drops          5 the Calma tag in the gap
 *   3 the child with headphones
 * Screen-fixed: 6 the text card.
 */
(function () {
  'use strict';
  const FILM = window.FILM;
  const ID = 'calma';
  const TAU = Math.PI * 2;
  const FR = 1 / 24;
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  const B_BREATH = 0.75; // T 6.75 breath-in swell: noise turns into rings
  const B_P3 = 1.5;      // T 7.5  plank 3 lands
  const PULL = [0.6, 1.4];

  function zigzags(ctx, L, P, hx, hy, t, fade) {
    if (fade <= 0) return;
    const tw = L.onTwos(t);
    for (let k = 0; k < 7; k++) {
      const a = -2.9 + k * 0.48;
      const r0 = 80 + (k % 2) * 14, r1 = r0 + 70 + Math.sin(tw * 9 + k) * 10;
      const pts = [];
      for (let i = 0; i <= 8; i++) {
        const u = i / 8;
        const r = lerp(r0, r1, u);
        const off = (i % 2 ? 1 : -1) * 9;
        pts.push([hx + Math.cos(a) * r + Math.cos(a + Math.PI / 2) * off, hy + Math.sin(a) * r + Math.sin(a + Math.PI / 2) * off]);
      }
      L.inkPath(ctx, pts, { color: P.annMagenta, width: 3.6, seed: 3100 + k, alpha: fade, smooth: false });
    }
  }

  function rings(ctx, L, P, hx, hy, t, p) {
    if (p <= 0) return;
    const breath = 0.5 - 0.5 * Math.cos((t - B_BREATH) * TAU / 1.5);
    for (let k = 0; k < 3; k++) {
      const r = 100 + k * 34 + breath * 26;
      L.guideCircle(ctx, hx, hy, r, { color: P.annBlue, alpha: p * (0.85 - k * 0.22), width: 3.4 - k * 0.6, ink: true, seed: 3200 + k, p: L.seg(t, B_BREATH - FR + k * 0.08, B_BREATH + 0.5 + k * 0.08, 'outCubic') });
    }
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

      const pull = L.seg(t, PULL[0], PULL[1], 'inOutCubic');
      const zoom = lerp(1.75, 1, pull);
      const cx = lerp(300, 540, pull), cy = lerp(930, 960, pull);
      const calm = L.seg(t, B_BREATH - FR, B_BREATH + 0.6, 'inOutSine');

      L.paper(ctx, { seed: 3 });
      L.camera(ctx, { x: cx, y: cy, zoom }, () => {
        // 1 set
        C.sky(ctx, T);
        C.river(ctx, T);
        C.cliffs(ctx, T);
        C.tree(ctx, T, 70, G.deckY + 4, 1.05, 960);
        C.school(ctx, T);
        // 2 planks
        C.bridge(ctx, 2, { ghosts: true });
        const d3 = L.seg(t, B_P3 - 0.375, B_P3, 'linear');
        if (d3 > 0) C.plank(ctx, 2, { drop: d3 });
        const b = L.seg(t, B_P3 - FR, B_P3 + 0.5, 'outExpo');
        if (b > 0 && b < 1) L.ticks(ctx, G.plankX(2) + 44, G.deckY + 15, { r: 26 + b * 40, n: 14, len: 12 + b * 30, color: P.annYellow, alpha: 1 - b, width: 3 });
        // 3 child
        const a = C.child(ctx, { x: G.childX, y: G.deckY, s: 1, mood: calm > 0.5 ? 'calm' : 'worry', headphones: true, blink: t > 2.2 && t < 2.32 });
        // 4 noise, then breath
        zigzags(ctx, L, P, a.head[0], a.head[1], t, 1 - calm);
        rings(ctx, L, P, a.head[0], a.head[1], t, calm);
        // little notes of calm: three soft dots rising
        for (let k = 0; k < 3; k++) {
          const u = ((t - B_BREATH) * 0.6 + k / 3) % 1;
          if (t < B_BREATH) break;
          L.inkCircle(ctx, a.head[0] + 120 + k * 8, a.head[1] - 40 - u * 120, 6 + k, { fill: P.washBlue, color: P.annBlue, width: 1.4, seed: 3300 + k, alpha: Math.sin(u * Math.PI) * calm });
        }
        // 5 tag
        const tp = L.seg(t, B_P3, B_P3 + 0.4);
        if (tp > 0) L.inkLine(ctx, G.plankX(2) + 44, G.deckY + 34, G.plankX(2) + 44, 1200, { color: P.aurumGold, width: 2.4, seed: 3401, draw: tp });
        C.tag(ctx, 'Calma', G.plankX(2) + 44, 1230, tp, { seed: 3402 });
      });

      // 6 card
      C.card(ctx, ['Herramientas', 'para regularse'], { p: 0.75 + L.seg(t, 0, 0.25) * 0.25, size: 76 });
    },
  });
})();
