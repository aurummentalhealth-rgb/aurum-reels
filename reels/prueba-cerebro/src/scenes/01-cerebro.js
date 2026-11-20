/*
 * Shot 1 · cerebro · T 0.0–3.0 · supplied engraving + drawn animation
 * The supplied image (engraved brain and face crowned with blue flowers) fills the lower frame on
 * its own grey, pushing in slowly about the bottom centre. Over it:
 *   1 grey ground, the image (cached at 1:1 so the zoom never resamples the source twice)
 *   2 a soft light sweep across the cortex on the 2.25 beat
 *   3 a dendrite network that grows up out of the flower crown into the grey, engraving-dark lines
 *     with blue blossoms and gold sparks at the tips
 *   4 neurons firing: sparks that run along curved paths over the cortex, with fading trails and
 *     small synapse bursts on the beats
 *   5 blue petals drifting across the frame (screen-fixed)
 */
(function () {
  'use strict';
  const FILM = window.FILM;
  const ID = 'cerebro';
  const TAU = Math.PI * 2;
  const FR = 1 / 24;
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };

  const B1 = 0.75, B2 = 1.5, B3 = 2.25;   // beats
  const IMG_W = 1080, IMG_H = Math.round(1080 * 616 / 570);  // 1167
  const IMG_Y = 1920 - IMG_H;                                   // 753: the image sits on the bottom edge
  const K = 1080 / 570;
  const I = (ix, iy) => [ix * K, IMG_Y + iy * K];               // image px -> frame px

  // the cortex as an ellipse in frame px (image: centre 240,318, radii 205,105)
  const BR = { cx: I(240, 318)[0], cy: I(240, 318)[1], rx: 205 * K, ry: 105 * K };

  // ---------------------------------------------------------------- geometry, built once
  let GEO = null;
  function geo(L) {
    if (GEO) return GEO;
    const r = L.rng(L.hash(ID, 'geo'));
    // dendrite network: roots along the flower crown, branching upward
    const branches = [];
    const roots = [[I(150, 95), -1.75], [I(300, 70), -1.57], [I(430, 105), -1.35], [I(70, 140), -1.95], [I(500, 150), -1.15]];
    const grow = (x, y, ang, len, depth, t0, parent) => {
      const pts = [[x, y]];
      let a = ang;
      const n = 8;
      for (let i = 1; i <= n; i++) {
        a += (r() - 0.5) * 0.22;
        pts.push([pts[i - 1][0] + Math.cos(a) * len / n, pts[i - 1][1] + Math.sin(a) * len / n]);
      }
      const dur = 0.32 + depth * 0.04;
      const b = { pts, depth, t0, t1: t0 + dur, w: Math.max(1, 4.2 - depth * 0.75), parent };
      branches.push(b);
      const end = pts[n];
      if (depth < 4 && end[1] > 470) {
        const kids = depth < 2 ? 2 + (r() < 0.5 ? 1 : 0) : 2;
        for (let k = 0; k < kids; k++) {
          const spread = (k - (kids - 1) / 2) * (0.55 + r() * 0.2);
          grow(end[0], end[1], a + spread, len * (0.6 + r() * 0.16), depth + 1, b.t1 - 0.06, b);
        }
      } else {
        b.tip = true;
      }
    };
    roots.forEach(([[x, y], a], k) => grow(x, y, a, 130 + r() * 40, 0, 0.05 + k * 0.12, null));
    // neuron paths across the cortex: smooth curves inside the ellipse
    const paths = [];
    for (let k = 0; k < 15; k++) {
      const pts = [];
      let a = r() * TAU, rad = 0.2 + r() * 0.6;
      const turn = (r() - 0.5) * 0.5;
      for (let i = 0; i <= 40; i++) {
        a += 0.09 + turn * 0.1;
        rad = clamp(rad + (r() - 0.5) * 0.06, 0.15, 0.88);
        pts.push([BR.cx + Math.cos(a) * BR.rx * rad, BR.cy + Math.sin(a) * BR.ry * rad]);
      }
      paths.push({ pts, t0: (k / 15) * 2.2 - 0.3, speed: 0.6 + r() * 0.3, col: k % 3 });
    }
    // petals: start positions and drift
    const petals = [];
    for (let k = 0; k < 16; k++) {
      petals.push({ x: r() * 1180 - 50, y: 120 + r() * 1300, vx: 30 + r() * 50, vy: 20 + r() * 40, rot: r() * TAU, spin: (r() - 0.5) * 2.4, s: 0.7 + r() * 0.8, c: k % 3 });
    }
    // synapse nodes on the cortex that flash on the beats
    const nodes = [];
    for (let k = 0; k < 14; k++) {
      const a = r() * TAU, rad = Math.sqrt(r()) * 0.85;
      nodes.push({ x: BR.cx + Math.cos(a) * BR.rx * rad, y: BR.cy + Math.sin(a) * BR.ry * rad, beat: [B1, B2, B3][k % 3] });
    }
    GEO = { branches, paths, petals, nodes };
    return GEO;
  }

  function photoCanvas(L) {
    return L.cached('cerebro-photo-1080', () => {
      const c = FILM.makeCanvas ? FILM.makeCanvas(IMG_W, IMG_H) : Object.assign(document.createElement('canvas'), { width: IMG_W, height: IMG_H });
      const g = c.getContext('2d');
      g.imageSmoothingQuality = 'high';
      g.drawImage(FILM.photo('cerebro'), 0, 0, IMG_W, IMG_H);
      return c;
    });
  }

  // partial polyline up to fraction p
  function partial(pts, p) {
    if (p >= 1) return pts;
    const n = pts.length - 1, f = p * n, k = Math.floor(f);
    const out = pts.slice(0, k + 1);
    if (k < n) out.push([lerp(pts[k][0], pts[k + 1][0], f - k), lerp(pts[k][1], pts[k + 1][1], f - k)]);
    return out;
  }

  function blossom(ctx, L, P, x, y, r, rot, p, seed) {
    if (p <= 0) return;
    const s = L.ease.outBack(p);
    for (let q = 0; q < 5; q++) {
      const a = rot + (q / 5) * TAU;
      const pts = L.ellipsePts(x + Math.cos(a) * r * 0.62 * s, y + Math.sin(a) * r * 0.62 * s, r * 0.55 * s, r * 0.34 * s, 16, a);
      L.inkPath(ctx, pts, { closed: true, fill: q % 2 ? P.iceBlue : P.petalBlue, color: P.engrave, width: 1.3, seed: seed + q });
      L.hatch(ctx, pts, { angle: a + 1.2, spacing: 3, width: 0.7, color: P.deepBlue, alpha: 0.6, seed: seed + 10 + q, density: 0.5 });
    }
    L.inkCircle(ctx, x, y, r * 0.24 * s, { fill: P.goldSpark, color: P.engrave, width: 1.1, seed: seed + 20 });
  }

  FILM.scene({
    id: ID,
    draw(ctx, tIn, info) {
      const L = info.lib;
      const P = L.pal;
      const t = clamp(tIn, 0, info.dur);
      const tw = L.onTwos(t);
      const G = geo(L);

      // 1 ground and image, slow push-in about the bottom centre
      ctx.fillStyle = P.photoGrey;
      ctx.fillRect(0, 0, 1080, 1920);
      // faint engraving guide circles in the empty grey (house construction style)
      L.guideCircle(ctx, 560, 640, 360, { color: P.engrave, alpha: 0.12, dash: [3, 8], cross: 14 });
      L.guideCircle(ctx, 560, 640, 250, { color: P.engrave, alpha: 0.1, width: 1, p: L.seg(t, 0, 1.6, 'inOutCubic') });
      const z = lerp(1, 1.07, L.ease.inOutSine(t / 3));
      ctx.save();
      ctx.translate(540, 1920);
      ctx.scale(z, z);
      ctx.translate(-540, -1920);
      ctx.drawImage(photoCanvas(L), 0, IMG_Y, IMG_W, IMG_H);

      // 2 light sweep across the cortex
      const sw = L.seg(t, B3 - 0.5, B3 + 0.7, 'inOutSine');
      if (sw > 0 && sw < 1) {
        const gx = lerp(BR.cx - BR.rx * 1.2, BR.cx + BR.rx * 1.2, sw);
        const g = ctx.createRadialGradient(gx, BR.cy, 0, gx, BR.cy, 260);
        g.addColorStop(0, 'rgba(255,247,225,0.42)');
        g.addColorStop(0.5, 'rgba(200,225,255,0.16)');
        g.addColorStop(1, 'rgba(200,225,255,0)');
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(BR.cx, BR.cy, BR.rx * 1.05, BR.ry * 1.1, 0, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
      // a constant faint glow that breathes on the beats
      const breath = 0.5 + 0.5 * Math.cos(((t % 0.75) / 0.75) * TAU);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const g2 = ctx.createRadialGradient(BR.cx, BR.cy, 0, BR.cx, BR.cy, BR.rx);
      g2.addColorStop(0, `rgba(160,200,245,${0.08 + 0.06 * breath})`);
      g2.addColorStop(1, 'rgba(160,200,245,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(BR.cx - BR.rx, BR.cy - BR.rx, BR.rx * 2, BR.rx * 2);
      ctx.restore();

      // 3 dendrite network growing up into the grey
      for (const b of G.branches) {
        const p = L.seg(tw, b.t0, b.t1, 'outCubic');
        if (p <= 0) continue;
        const pts = partial(b.pts, p);
        L.inkPath(ctx, pts, { color: P.engrave, width: b.w, seed: 7000 + G.branches.indexOf(b), wobble: 0.8, taper: [4, 18] });
        // engraving: a second hairline beside the thicker branches
        if (b.depth < 2) L.inkPath(ctx, pts.map(([x, y]) => [x + 5, y + 2]), { color: P.engrave, width: 0.8, alpha: 0.55, seed: 7200 + G.branches.indexOf(b) });
        // nodes along the way
        if (p >= 1 && !b.tip) L.inkCircle(ctx, b.pts[8][0], b.pts[8][1], 3.5, { fill: P.engrave, width: 1, seed: 7400 + G.branches.indexOf(b) });
        if (b.tip && p > 0.85) {
          const k = G.branches.indexOf(b);
          const [x, y] = b.pts[8];
          blossom(ctx, L, P, x, y, 15 + (k % 3) * 4, k * 0.7 + tw * 0.4, L.seg(tw, b.t1 - 0.05, b.t1 + 0.3), 7600 + k * 30);
          const tws = 0.5 + 0.5 * Math.sin(tw * 9 + k * 1.7);
          L.glowDot(ctx, x, y, 4 + tws * 4, { color: P.goldSpark, rays: 4, rayLen: 2.6, glow: 2.4, rot: k });
        }
        // a pulse running up the finished branch
        if (p >= 1) {
          const u = ((tw - b.t1) * 1.6 + (b.depth * 0.13)) % 1;
          const k = Math.min(8, Math.floor(u * 8));
          const q = u * 8 - k;
          const px = lerp(b.pts[k][0], b.pts[Math.min(8, k + 1)][0], q), py = lerp(b.pts[k][1], b.pts[Math.min(8, k + 1)][1], q);
          L.glowDot(ctx, px, py, 4, { color: P.iceBlue, rays: 0, glow: 2.5, core: P.white });
        }
      }

      // 4 neurons firing across the cortex
      for (const nP of G.paths) {
        const age = t - nP.t0;
        if (age < 0) continue;
        const u = clamp(age * nP.speed);
        const head = Math.floor(u * 40);
        const tail = Math.max(0, head - 14);
        const trail = nP.pts.slice(tail, head + 1);
        const col = [P.goldSpark, P.goldSpark, P.iceBlue][nP.col];
        if (trail.length > 1) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          for (let i = 1; i < trail.length; i++) {
            ctx.strokeStyle = L.rgba(col, (i / trail.length) * 0.95 * (1 - u * 0.3));
            ctx.lineWidth = 2 + (i / trail.length) * 5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(trail[i - 1][0], trail[i - 1][1]);
            ctx.lineTo(trail[i][0], trail[i][1]);
            ctx.stroke();
          }
          ctx.restore();
        }
        if (u < 1) L.glowDot(ctx, nP.pts[head][0], nP.pts[head][1], 10, { color: col, core: P.white, rays: 4, rayLen: 2.2, glow: 3, rot: tw * 3 });
      }
      // synapse bursts on the beats
      for (const n of G.nodes) {
        const b = L.seg(t, n.beat - FR, n.beat + 0.45, 'outExpo');
        if (b <= 0 || b >= 1) continue;
        L.ticks(ctx, n.x, n.y, { r: 6 + b * 16, n: 10, len: 6 + b * 14, color: P.goldSpark, alpha: 1 - b, width: 2.2 });
        L.glowDot(ctx, n.x, n.y, 7 * (1 - b) + 2, { color: P.goldSpark, core: P.white, rays: 0, glow: 3 });
      }
      ctx.restore();

      // 5 petals drifting (screen-fixed)
      for (const pt of G.petals) {
        const x = pt.x + pt.vx * tw;
        const y = pt.y + pt.vy * tw + Math.sin(tw * 2 + pt.rot) * 12;
        const a = pt.rot + pt.spin * tw;
        const s = pt.s;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(a);
        const pts = [[0, -14 * s], [9 * s, -4 * s], [7 * s, 10 * s], [0, 14 * s], [-7 * s, 10 * s], [-9 * s, -4 * s]];
        L.inkPath(ctx, pts, { closed: true, fill: [P.iceBlue, P.petalBlue, P.deepBlue][pt.c], color: P.engrave, width: 1.2, seed: 7900 + pt.c, alpha: 0.9 });
        L.inkPath(ctx, [[0, -10 * s], [0, 10 * s]], { color: P.engrave, width: 0.8, alpha: 0.6, seed: 7910 });
        ctx.restore();
      }
    },
  });
})();
