/*
 * Shot 6 · cierre · T 15.0–18.0 · light cream paper
 * Call to action: "Agenda tu evaluación" + "Aurum Mental Health". The box 310..770 x 610..1110
 * (460 x 500 around x 540, y 860) stays empty: the Aurum logo is pasted there after the render
 * (marca/poner-logo.sh, from T 15).
 * Layers, back to front:
 *   1 cream paper                    3 the call to action between y 1150 and 1450
 *   2 gold frame and corner sprigs   4 a small finished bridge doodle under the text, sparkles
 */
(function () {
  'use strict';
  const FILM = window.FILM;
  const ID = 'cierre';
  const TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  const LOGO = { x0: 310, x1: 770, y0: 610, y1: 1110 };

  function sprig(ctx, L, P, x, y, sx, sy, p, seed) {
    if (p <= 0) return;
    const stem = [[x, y], [x + sx * 60, y + sy * 20], [x + sx * 120, y + sy * 60]];
    L.inkPath(ctx, stem, { color: P.aurumGold, width: 2.6, seed, draw: p });
    for (let k = 0; k < 3; k++) {
      const u = 0.3 + k * 0.25;
      if (p < u) break;
      const lx = x + sx * 120 * u, ly = y + sy * 60 * u * u + sy * 6;
      const leaf = L.ellipsePts(lx, ly - sy * 14, 14, 7, 16, sx * sy * 0.6);
      L.inkPath(ctx, leaf, { closed: true, fill: L.rgba(P.aurumGold, 0.35), color: P.aurumGold, width: 1.6, seed: seed + 1 + k });
    }
  }

  FILM.scene({
    id: ID,
    draw(ctx, tIn, info) {
      const L = info.lib;
      const P = L.pal;
      const t = clamp(tIn, 0, info.dur);
      const tw = L.onTwos(t);

      // 1 paper
      L.paper(ctx, { seed: 61, color: P.aurumCream, vignette: 0.15, mottle: 0.5 });

      // 2 frame: a thin gold double rule, drawn on
      const fp = L.seg(t, 0, 0.9, 'outCubic');
      const frame = L.rrectPts(90, 210, 840, 1340, 40, 20);
      L.inkPath(ctx, frame, { closed: true, color: P.aurumGold, width: 2.4, seed: 6101, draw: fp, double: { offset: 10, alpha: 0.5, width: 0.5, from: 0.02, to: 0.98 } });
      sprig(ctx, L, P, 130, 260, 1, 1, L.seg(t, 0.3, 1.1), 6110);
      sprig(ctx, L, P, 890, 260, -1, 1, L.seg(t, 0.35, 1.15), 6120);
      sprig(ctx, L, P, 130, 1500, 1, -1, L.seg(t, 0.4, 1.2), 6130);
      sprig(ctx, L, P, 890, 1500, -1, -1, L.seg(t, 0.45, 1.25), 6140);
      // faint guide circle around the logo box, outside it
      L.guideCircle(ctx, 540, 860, 330, { color: P.aurumGold, alpha: 0.35, width: 1.6, dash: [4, 10], p: L.seg(t, 0.2, 1.4, 'inOutCubic') });

      // 3 call to action
      const tp = L.seg(t, 0, 0.35, 'outCubic');
      ctx.save();
      ctx.globalAlpha *= 0.4 + tp * 0.6;
      L.text(ctx, 'Agenda tu evaluación', 540, 1230, { size: 64, weight: 800, color: P.aurumBrown, align: 'center', baseline: 'middle' });
      ctx.restore();
      L.inkPath(ctx, [[300, 1290], [540, 1298], [780, 1288]], { color: P.aurumGold, width: 5, seed: 6201, draw: L.seg(t, 0.3, 0.9, 'outCubic') });
      const tn = L.seg(t, 0.2, 0.55, 'outCubic');
      ctx.save();
      ctx.globalAlpha *= 0.3 + tn * 0.7;
      L.text(ctx, 'Aurum Mental Health', 540, 1365, { size: 58, weight: 600, color: P.aurumGray, align: 'center', baseline: 'middle', tracking: 1 });
      ctx.restore();

      // 4 a small finished bridge under the text
      const by = 1460, bx0 = 380, bx1 = 700;
      const bp = L.seg(t, 0.5, 1.3, 'outCubic');
      L.inkPath(ctx, [[bx0 - 50, by], [bx0, by]], { color: P.aurumBrown, width: 3, seed: 6301, draw: bp });
      L.inkPath(ctx, [[bx1, by], [bx1 + 50, by]], { color: P.aurumBrown, width: 3, seed: 6302, draw: bp });
      for (let i = 0; i < 5; i++) {
        const u = clamp(bp * 5 - i);
        if (u <= 0) continue;
        const px = lerp(bx0, bx1, i / 5) + 3;
        const pts = L.rectPts(px, by - 6 - (1 - L.ease.outBack(u)) * 40, (bx1 - bx0) / 5 - 6, 14, 8);
        L.inkPath(ctx, pts, { closed: true, fill: P.plank, color: P.aurumBrown, width: 2, seed: 6310 + i });
      }
      const rope = [];
      for (let k = 0; k <= 20; k++) {
        const u = k / 20;
        rope.push([lerp(bx0, bx1, u), by - 40 + Math.sin(u * Math.PI) * 14]);
      }
      L.inkPath(ctx, rope, { color: P.aurumBrown, width: 2, seed: 6320, draw: L.seg(t, 1.1, 1.7, 'outCubic') });
      // sparkles outside the logo box
      const sparks = [[200, 420], [880, 470], [170, 980], [900, 1040], [230, 1460], [850, 1450]];
      sparks.forEach(([x, y], k) => {
        const a = L.seg(t, 0.6 + k * 0.1, 1.0 + k * 0.1);
        if (a <= 0) return;
        const tws = 0.5 + 0.5 * Math.sin(tw * 8 + k * 1.9);
        L.glowDot(ctx, x, y, 5 + tws * 5, { color: P.aurumGold, rays: 4, rayLen: 3, glow: 2, rot: k, alpha: a });
      });
    },
  });
})();
