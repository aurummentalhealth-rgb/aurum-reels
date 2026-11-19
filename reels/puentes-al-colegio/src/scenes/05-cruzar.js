/*
 * Shot 5 · cruzar · T 12.0–15.0 · paper plate
 * "No es cambiar quién es: es tender puentes". The finished bridge with ropes; the child (still
 * wearing headphones: the supports stay) walks across and a classmate waves by the school.
 * Layers, back to front:
 *   1 sky, birds, river, cliffs, tree, school    4 the child walking across, then waving
 *   2 the full bridge with ropes                  5 gold sparkles and a footstep trail
 *   3 the classmate, waving                        6 the text card (screen-fixed)
 */
(function () {
  'use strict';
  const FILM = window.FILM;
  const ID = 'cruzar';
  const TAU = Math.PI * 2;
  const FR = 1 / 24;
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  const WALK = [0.15, 2.1];  // T 12.15 – 14.1
  const B_STEP = 1.5;        // T 13.5 footstep taps
  const B_WAVE = 2.25;       // T 14.25 friend waves, sparkles

  FILM.scene({
    id: ID,
    draw(ctx, tIn, info) {
      const L = info.lib;
      const P = L.pal;
      const C = FILM.cast;
      const G = C.G;
      const t = clamp(tIn, 0, info.dur);
      const T = info.shot.start + t;
      const tw = L.onTwos(t);

      // 1 set
      L.paper(ctx, { seed: 3 });
      C.sky(ctx, T);
      for (let i = 0; i < 3; i++) {
        const bx = 420 + i * 80 + tw * 50, by = 860 - i * 30;
        const flap = Math.sin(tw * 14 + i * 1.7) * 9;
        L.inkPath(ctx, [[bx - 18, by - flap], [bx, by], [bx + 18, by - flap]], { width: 2.2, seed: 5900 + i, taper: 4 });
      }
      C.river(ctx, T);
      C.cliffs(ctx, T);
      C.tree(ctx, T, 70, G.deckY + 4, 1.05, 960);
      C.school(ctx, T);

      // 2 bridge
      C.bridge(ctx, 5, { ropes: 1 });

      // 3 classmate in front of the school
      const waving = t >= 0.9;
      C.friend(ctx, { x: 885, y: G.deckY, s: 1, pose: waving ? 'wave' : 'stand', mood: 'smile', t });

      // 4 the child crossing
      const w = L.seg(L.onTwos(t), WALK[0], WALK[1], 'inOutSine');
      const x = lerp(G.childX, 680, w);
      const walking = t > WALK[0] && t < WALK[1];
      C.child(ctx, { x, y: G.deckY, s: 1, pose: walking ? 'walk' : t >= WALK[1] ? 'wave' : 'stand', phase: tw * 9, mood: 'smile', headphones: true, t: t + 0.4 });

      // 5 footsteps on the planks and sparkles
      for (let i = 0; i < 5; i++) {
        const px = G.plankX(i) + 44;
        if (x < px) continue;
        const age = clamp((x - px) / 300);
        L.glowDot(ctx, px, G.deckY + 15, 6 + (1 - age) * 6, { color: P.sun, rays: 0, glow: 3, alpha: 1 - age * 0.5 });
      }
      const sp = L.seg(t, B_WAVE - FR, B_WAVE + 0.6, 'outCubic');
      if (sp > 0) {
        for (let k = 0; k < 10; k++) {
          const a = (k / 10) * TAU + 0.3;
          const r = 120 + sp * 90 + L.h3(k, 2, 55) * 40;
          const sx = 775 + Math.cos(a) * r, sy = 900 + Math.sin(a) * r * 0.8;
          const tws = 0.5 + 0.5 * Math.sin(tw * 10 + k * 1.3);
          L.glowDot(ctx, sx, sy, 6 + tws * 6, { color: k % 2 ? P.sun : P.aurumGold, rays: 4, rayLen: 3, glow: 2, rot: k, alpha: Math.min(1, sp * 2) });
        }
        // a small heart between the two friends
        const hp = L.ease.outBack(sp);
        ctx.save();
        ctx.translate(782, 760 - sp * 20);
        ctx.scale(hp, hp);
        const hp2 = new Path2D();
        hp2.moveTo(0, 30);
        hp2.bezierCurveTo(-46, 0, -34, -38, 0, -16);
        hp2.bezierCurveTo(34, -38, 46, 0, 0, 30);
        ctx.fillStyle = P.annMagenta;
        ctx.fill(hp2);
        ctx.strokeStyle = P.ink;
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.stroke(hp2);
        ctx.restore();
      }
      // step taps on the beat
      const st = L.seg(t, B_STEP - FR, B_STEP + 0.4, 'outExpo');
      if (st > 0 && st < 1) L.ticks(ctx, x + 10, G.deckY + 4, { r: 14 + st * 20, n: 7, len: 8 + st * 14, start: -Math.PI * 0.95, span: Math.PI * 0.9, color: P.aurumGold, alpha: 1 - st, width: 3 });

      // 6 card
      C.card(ctx, ['No es cambiar quién es:', 'es tender puentes'], { p: 0.75 + L.seg(t, 0, 0.25) * 0.25, size: 66, accent: L.seg(t, 1.2, 1.9, 'outCubic') });
    },
  });
})();
