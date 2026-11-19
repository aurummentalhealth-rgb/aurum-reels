/*
 * Shot 1 · lejos · T 0.0–3.0 · paper plate
 * "¿El colegio se siente lejos?" The child on the near cliff, the school across the gap.
 * Layers, back to front:
 *   1 sky stripes, sun, clouds          5 the child (worried, looking across)
 *   2 birds                              6 the dashed arc that falls short + question mark
 *   3 river in the gap                   7 the gap bracket
 *   4 cliffs, tree, flowers, school      8 the text card (screen-fixed)
 */
(function () {
  'use strict';
  const FILM = window.FILM;
  const ID = 'lejos';
  const TAU = Math.PI * 2;
  const FR = 1 / 24;
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  const B_ARC = 0.375;   // T 0.375  the arc starts to draw
  const B_FALL = 1.5;    // T 1.5    the arc falls short (cue)
  const B_Q = 1.875;     // T 1.875  question mark pops

  function birds(ctx, L, P, t) {
    const tw = L.onTwos(t);
    for (let i = 0; i < 4; i++) {
      const bx = 380 + i * 70 + tw * 40, by = 980 - i * 26 - Math.sin(tw * 3 + i) * 8;
      const flap = Math.sin(tw * 14 + i * 1.7) * 9;
      L.inkPath(ctx, [[bx - 18, by - flap], [bx, by], [bx + 18, by - flap]], { width: 2.2, seed: 900 + i, taper: 4 });
    }
  }

  function flowers(ctx, L, P, t) {
    const fl = [[40, 1090], [110, 1094], [270, 1092], [800, 1092], [1050, 1094]];
    fl.forEach(([x, y], k) => {
      L.inkLine(ctx, x, y, x + 2, y - 26, { width: 1.6, seed: 940 + k, color: P.leaf });
      L.inkCircle(ctx, x + 2, y - 30, 7, { fill: k % 2 ? P.sun : P.rose, width: 1.6, seed: 950 + k });
    });
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

      // 1 sky
      L.paper(ctx, { seed: 3 });
      C.sky(ctx, T);
      // 2 birds
      birds(ctx, L, P, t);
      // 3 river
      C.river(ctx, T);
      // 4 cliffs, tree, school
      C.cliffs(ctx, T);
      C.tree(ctx, T, 70, G.deckY + 4, 1.05, 960);
      flowers(ctx, L, P, T);
      C.school(ctx, T);
      // empty plank slots, very faint: the bridge that is not there yet
      ctx.save();
      ctx.globalAlpha = L.seg(t, 2.1, 2.9, 'outCubic') * 0.8;
      C.bridge(ctx, 0, { ghosts: true });
      ctx.restore();

      // 5 the child
      const look = Math.sin(L.onTwos(t) * 2.2) * 2;
      C.child(ctx, { x: G.childX + look, y: G.deckY, s: 1, mood: 'worry', blink: t > 2.3 && t < 2.42 });

      // 6 the arc that tries to reach the school and falls short
      const pa = L.seg(t, B_ARC, B_FALL, 'inOutSine');
      if (pa > 0) {
        const pts = [];
        const n = Math.ceil(40 * pa);
        for (let i = 0; i <= n; i++) {
          const u = (i / 40);
          const x = lerp(270, 600, u);
          const y = 830 - Math.sin(u * Math.PI * 0.85) * 150 + u * u * 380;
          pts.push([x, y]);
        }
        ctx.save();
        ctx.setLineDash([16, 12]);
        ctx.lineDashOffset = -L.onTwos(t) * 40;
        ctx.strokeStyle = P.annBlue;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        L.tracePath(ctx, pts, false);
        ctx.stroke();
        ctx.restore();
        if (t >= B_FALL - FR) {
          // the end drops into the gap: little splash marks
          const sp = L.seg(t, B_FALL - FR, B_FALL + 0.5, 'outCubic');
          L.ticks(ctx, 600, 1210 + sp * 30, { r: 10 + sp * 14, n: 7, len: 10 + sp * 16, start: -Math.PI * 0.95, span: Math.PI * 0.9, color: P.annBlue, alpha: 1 - sp * 0.6, width: 3 });
        }
      }
      // question mark
      const pq = L.seg(t, B_Q - FR, B_Q + 0.25, 'outBack');
      if (pq > 0) {
        ctx.save();
        ctx.translate(545, 760);
        ctx.rotate(0.12 + Math.sin(L.onTwos(t) * 5) * 0.05);
        ctx.scale(pq, pq);
        L.text(ctx, '?', 0, 0, { size: 150, weight: 800, color: P.annMagenta, align: 'center', baseline: 'middle' });
        ctx.restore();
      }

      // 7 gap bracket: how far it is
      L.bracket(ctx, G.leftEdge, G.deckY - 30, G.rightEdge, G.deckY - 30, { color: P.annYellow, alpha: 0.95, width: 3, p: L.seg(t, 0.9, 1.7, 'outCubic'), offset: 0, cap: 22 });

      // 8 the card
      C.card(ctx, ['¿El colegio', 'se siente lejos?'], { p: 0.75 + L.seg(t, 0, 0.25) * 0.25, size: 76 });
    },
  });
})();
