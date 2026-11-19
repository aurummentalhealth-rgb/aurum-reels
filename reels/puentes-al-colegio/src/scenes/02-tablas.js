/*
 * Shot 2 · tablas · T 3.0–6.0 · blueprint plate
 * "Cada apoyo es una tabla". The same set as shot 1 in schematic line; planks 1 and 2 drop in.
 * Layers, back to front:
 *   1 blueprint ground, construction circles      5 plank 1 (T 3.75) + speech bubble icon
 *   2 river lines, cliffs, school, child          6 plank 2 (T 4.5) + visual schedule panel
 *   3 dashed plank slots, deck ticks              7 labels in the gap, leader lines
 *   4 span bracket                                8 the text card (screen-fixed)
 */
(function () {
  'use strict';
  const FILM = window.FILM;
  const ID = 'tablas';
  const TAU = Math.PI * 2;
  const FR = 1 / 24;
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);

  const B_P1 = 0.75;  // T 3.75 plank 1 lands
  const B_P2 = 1.5;   // T 4.5  plank 2 lands
  const DROP = 0.375; // planks fall for half a beat before they land

  function burst(ctx, L, P, x, y, t, a) {
    const b = L.seg(t, a - FR, a + 0.5, 'outExpo');
    if (b <= 0 || b >= 1) return;
    L.ticks(ctx, x, y, { r: 30 + b * 50, n: 18, len: 16 + b * 40, color: P.magenta, alpha: 1 - b, width: 3 });
    L.guideCircle(ctx, x, y, 40 + b * 120, { color: P.magenta, alpha: (1 - b) * 0.8, width: 2.5 });
  }

  function pill(ctx, L, P, str, x, y, p, seed) {
    if (p <= 0) return;
    ctx.save();
    ctx.font = '700 56px "SF Pro Rounded", ui-rounded, "Helvetica Neue", system-ui, Arial, sans-serif';
    const w = ctx.measureText(str).width;
    ctx.restore();
    ctx.save();
    ctx.globalAlpha *= clamp(p * 1.5);
    const bx = x - w / 2 - 22, by = y - 36;
    const box = L.rrectPts(bx, by, w + 44, 84, 20, 16);
    L.inkPath(ctx, box, { closed: true, fill: P.navyDeep, color: P.schemGold, width: 2.6, seed, wobble: 0.8 });
    L.text(ctx, str, x, y + 2, { size: 56, weight: 700, color: P.lineWhite, align: 'center', baseline: 'middle', p: L.ease.outCubic(clamp(p * 1.4)) });
    ctx.restore();
  }

  // speech bubble with three dots, schematic line
  function bubble(ctx, L, P, x, y, p, t) {
    if (p <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(L.ease.outBack(p), L.ease.outBack(p));
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * TAU;
      pts.push([Math.cos(a) * 74, Math.sin(a) * 50]);
    }
    L.inkPath(ctx, pts, { closed: true, fill: P.navyLight, color: P.lineWhite, width: 3, seed: 2101 });
    L.inkPath(ctx, [[-30, 44], [-46, 80], [-6, 48]], { color: P.lineWhite, width: 3, seed: 2102 });
    for (let k = -1; k <= 1; k++) {
      const on = Math.floor(L.onTwos(t) * 4) % 3 === k + 1 ? 1.35 : 1;
      L.inkCircle(ctx, k * 26, 0, 7 * on, { fill: P.schemGold, color: P.schemGold, width: 1, seed: 2103 + k });
    }
    ctx.restore();
  }

  // the visual schedule: four tiles (arrive, class, play, home) with a moving marker
  function schedule(ctx, L, P, x, y, p, t) {
    if (p <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    const sc = L.ease.outBack(p);
    ctx.scale(sc, sc);
    const tw = 86, gap = 14, n = 4, W = n * tw + (n - 1) * gap;
    const frame = L.rrectPts(-W / 2 - 16, -tw / 2 - 16, W + 32, tw + 32, 18, 16);
    L.inkPath(ctx, frame, { closed: true, fill: P.navyDeep, color: P.lavender, width: 2.4, seed: 2201 });
    const active = Math.min(3, Math.floor(L.seg(t, 1.9, 2.9) * 4));
    for (let i = 0; i < n; i++) {
      const cx = -W / 2 + tw / 2 + i * (tw + gap);
      const tile = L.rrectPts(cx - tw / 2, -tw / 2, tw, tw, 12, 12);
      L.inkPath(ctx, tile, { closed: true, fill: i === active ? P.navyLight : P.navy, color: i === active ? P.schemGold : P.lineWhite, width: i === active ? 3.2 : 2, seed: 2210 + i });
      const ic = i === active ? P.schemGold : P.paleBlue;
      if (i === 0) { // sun: morning arrival
        L.inkCircle(ctx, cx, 0, 16, { color: ic, width: 2.4, seed: 2220 });
        L.ticks(ctx, cx, 0, { r: 22, n: 8, len: 9, color: ic, alpha: 1, width: 2.2 });
      } else if (i === 1) { // book: class
        L.inkPath(ctx, [[cx - 26, -16], [cx, -8], [cx + 26, -16], [cx + 26, 18], [cx, 26], [cx - 26, 18]], { closed: true, color: ic, width: 2.4, seed: 2221 });
        L.inkLine(ctx, cx, -8, cx, 26, { color: ic, width: 2, seed: 2222 });
      } else if (i === 2) { // ball: break
        L.inkCircle(ctx, cx, 0, 24, { color: ic, width: 2.4, seed: 2223 });
        L.inkPath(ctx, [[cx - 22, -8], [cx, 4], [cx + 22, -8]], { color: ic, width: 1.8, seed: 2224 });
      } else { // house: home time
        L.inkPath(ctx, [[cx - 24, 26], [cx - 24, -2], [cx, -26], [cx + 24, -2], [cx + 24, 26]], { closed: true, color: ic, width: 2.4, seed: 2225 });
        L.inkPath(ctx, L.rectPts(cx - 7, 8, 14, 18, 6), { closed: true, color: ic, width: 1.8, seed: 2226 });
      }
      if (i < active) L.inkPath(ctx, [[cx - 14, tw / 2 - 18], [cx - 4, tw / 2 - 8], [cx + 16, tw / 2 - 30]], { color: P.magenta, width: 3.2, seed: 2230 + i });
    }
    ctx.restore();
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

      // 1 ground
      L.blueprint(ctx, { seed: 21, center: [540, G.deckY], circles: 5, diagonals: 6 });
      L.guideCircle(ctx, 540, G.deckY, 330, { alpha: 0.3, dash: [3, 8], cross: 18, quadrants: 14 });
      L.guideCircle(ctx, 540, G.deckY, 230, { alpha: 0.35, p: L.seg(t, 0, 1.2, 'inOutCubic'), width: 1.4 });

      // 2 set in line
      C.river(ctx, T, S);
      C.cliffs(ctx, T, S);
      C.school(ctx, T, Object.assign({ line: P.lavender }, S));
      C.tree(ctx, T, 70, G.deckY + 4, 1.05, 960, S);
      C.child(ctx, { x: G.childX, y: G.deckY, s: 1, mood: 'calm', schem: true, line: P.lineWhite });

      // 3 slots and ticks
      C.bridge(ctx, 0, { schem: true, ghosts: true });
      L.ticks(ctx, G.leftEdge, G.deckY + 52, { kind: 'linear', length: G.rightEdge - G.leftEdge, n: 20, len: 8, major: 4, majorLen: 18, color: P.lavender, alpha: 0.6, width: 1.3 });

      // 4 span bracket
      L.bracket(ctx, G.leftEdge, G.deckY - 150, G.rightEdge, G.deckY - 150, { color: P.lavender, alpha: 0.7, width: 1.8, p: L.seg(t, 0, 0.6, 'outCubic') });

      // 5 + 6 planks
      const d1 = L.seg(t, B_P1 - DROP, B_P1, 'linear');
      const d2 = L.seg(t, B_P2 - DROP, B_P2, 'linear');
      if (d1 > 0) C.plank(ctx, 0, { schem: true, drop: d1, line: P.lineWhite });
      if (d2 > 0) C.plank(ctx, 1, { schem: true, drop: d2, line: P.lineWhite });
      burst(ctx, L, P, G.plankX(0) + 44, G.deckY + 15, t, B_P1);
      burst(ctx, L, P, G.plankX(1) + 44, G.deckY + 15, t, B_P2);
      // plank glow once laid
      for (const [i, a] of [[0, B_P1], [1, B_P2]]) {
        if (t >= a - FR) L.glowDot(ctx, G.plankX(i) + 44, G.deckY + 15, 10, { color: P.schemGold, rays: 0, glow: 4, twinkle: 0.1, rot: t });
      }
      bubble(ctx, L, P, 330, 760, L.seg(t, B_P1 - FR, B_P1 + 0.3), T);
      schedule(ctx, L, P, 560, 930, L.seg(t, B_P2 - FR, B_P2 + 0.3), t);

      // 7 labels in the gap with leader lines up to their plank
      const l1 = L.seg(t, B_P1, B_P1 + 0.4);
      const l2 = L.seg(t, B_P2, B_P2 + 0.4);
      if (l1 > 0) L.inkLine(ctx, G.plankX(0) + 44, G.deckY + 34, G.plankX(0) + 44, 1190, { color: P.schemGold, width: 2, seed: 2301, draw: l1 });
      if (l2 > 0) L.inkLine(ctx, G.plankX(1) + 44, G.deckY + 34, G.plankX(1) + 44, 1300, { color: P.schemGold, width: 2, seed: 2302, draw: l2 });
      pill(ctx, L, P, 'Comunicación', 540, 1220, l1, 2311);
      pill(ctx, L, P, 'Anticipar rutinas', 540, 1340, l2, 2312);

      // 8 card
      C.card(ctx, ['Cada apoyo', 'es una tabla'], { p: 0.75 + L.seg(t, 0, 0.25) * 0.25, size: 76, schem: true });
    },
  });
})();
