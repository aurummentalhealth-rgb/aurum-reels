/*
 * Shot 5 · cruzar · T 12.0–15.0 · paper plate · DETAILED VERSION (butterfly-level finish)
 * "No es cambiar quién es: es tender puentes". A closer, medium shot of the finished rope bridge:
 * the child (still wearing headphones: the supports stay) walks across it and meets a classmate
 * who waves at the far end, with the school small on the far hill.
 *
 * Layers, back to front:
 *   1 paper, sky stripes, construction circle + blue path ticks (house style)
 *   2 sun, clouds, birds
 *   3 far hills (stippled), school on the far hill, background trees
 *   4 banks: cliff faces (cross-hatched), stones, grass tufts, flowers
 *   5 river: water body, ripples, bridge reflection
 *   6 bridge: back hand rope, posts, stringer, planks with grain and nails, suspenders, front rope
 *   7 the classmate (waving), then the child walking (detailed figures)
 *   8 footstep glints, sparkles, heart
 *   9 the text card (screen-fixed)
 */
(function () {
  'use strict';
  const FILM = window.FILM;
  const ID = 'cruzar';
  const TAU = Math.PI * 2;
  const FR = 1 / 24;
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };

  const WALK = [0.1, 2.05];  // T 12.1 – 14.05
  const B_STEP = 1.5;        // T 13.5 footstep taps
  const B_WAVE = 2.25;       // T 14.25 sparkles, heart

  // ---------------------------------------------------------------- geometry (this shot only)
  const XL = 150, XR = 930;        // bridge posts
  const DY = 1300;                 // deck height at the posts
  const SAG = 24;                  // deck sag at mid-span
  const POST_TOP = 1010;
  const WATER = 1490;
  const NPL = 7;                   // planks
  const deckY = (x) => DY + SAG * Math.sin(Math.PI * clamp((x - XL) / (XR - XL)));
  const deckSlope = (x) => (SAG * Math.PI / (XR - XL)) * Math.cos(Math.PI * clamp((x - XL) / (XR - XL)));
  const ropeY = (x, top, sag) => top + sag * Math.sin(Math.PI * clamp((x - XL) / (XR - XL)));

  // ---------------------------------------------------------------- helpers
  function poly(L, pts, o) { L.inkPath(o.ctx, pts, o); }

  // a rope: two thin parallel strokes with twist ticks between them
  function rope(ctx, L, P, pts, seed, o = {}) {
    const w = o.w || 7;
    const col = o.color || P.inkSoft;
    const fill = o.fill || P.tan;
    const n = pts.length;
    const up = [], dn = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
      const nx = -dy / d, ny = dx / d;
      up.push([pts[i][0] + nx * w / 2, pts[i][1] + ny * w / 2]);
      dn.push([pts[i][0] - nx * w / 2, pts[i][1] - ny * w / 2]);
    }
    const body = up.concat(dn.slice().reverse());
    L.inkPath(ctx, body, { closed: true, fill, color: col, width: 0.1, seed: seed + 1, smooth: false });
    L.inkPath(ctx, up, { color: P.ink, width: 1.8, seed: seed + 2 });
    L.inkPath(ctx, dn, { color: P.ink, width: 1.8, seed: seed + 3 });
    // twist ticks every ~11 px
    const p = new Path2D();
    let acc = 0;
    for (let i = 1; i < n; i++) {
      const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      acc += seg;
      if (acc < 11) continue;
      acc = 0;
      p.moveTo(up[i][0] - 3, up[i][1]);
      p.lineTo(dn[i][0] + 3, dn[i][1]);
    }
    ctx.save();
    ctx.strokeStyle = L.rgba(P.ink, 0.65);
    ctx.lineWidth = 1.1;
    ctx.stroke(p);
    ctx.restore();
  }

  function sampleRope(top, sag, x0, x1, n) {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const x = lerp(x0, x1, i / n);
      pts.push([x, ropeY(x, top, sag)]);
    }
    return pts;
  }

  // ---------------------------------------------------------------- background
  function backdrop(ctx, L, P, t, T) {
    L.paper(ctx, { seed: 3 });
    L.stripes(ctx, { bounds: [0, 0, 1080, 1920], colors: [P.stripeCream, P.stripeSky], width: 150, angle: -0.5, offset: L.onTwos(T) * 8, seed: 31 });
    // construction circle around the meeting point, house style
    L.guideCircle(ctx, 640, 1060, 470, { color: P.inkFaint, alpha: 0.35, dash: [3, 8], cross: 14 });
    L.guideCircle(ctx, 640, 1060, 380, { color: P.inkFaint, alpha: 0.25, width: 1 });
    for (let k = 0; k < 9; k++) {
      const a = -Math.PI / 2 + (k - 4) * 0.22;
      L.inkLine(ctx, 640, 1060, 640 + Math.cos(a) * 470, 1060 + Math.sin(a) * 470, { color: P.inkFaint, width: 0.8, alpha: 0.2, seed: 5000 + k });
    }
    // sun with rays
    L.glowDot(ctx, 175, 640, 50, { color: P.sun, core: P.glow, additive: false, rays: 16, rayLen: 2.2, rayWidth: 0.11, twinkle: 0.05, glow: 2.4, rot: T * 0.15 });
    L.guideCircle(ctx, 175, 640, 92, { color: P.inkFaint, alpha: 0.4, dash: [3, 7] });
    // clouds with a shaded underside
    [[760, 660, 1.0], [430, 740, 0.7], [980, 300, 0.75]].forEach(([cx, cy, s], k) => {
      const dx = L.onTwos(T) * 6 * (k + 1);
      const pts = [];
      for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * TAU;
        const r = 1 + 0.16 * Math.sin(a * 5 + k) + 0.06 * Math.sin(a * 11 + k * 2);
        pts.push([cx + dx + Math.cos(a) * 110 * s * r, cy + Math.sin(a) * 38 * s * (a > Math.PI ? 1.35 : 0.55)]);
      }
      L.inkPath(ctx, pts, { closed: true, fill: P.white, color: P.inkSoft, width: 2.2, seed: 5010 + k });
      L.hatch(ctx, pts, { angle: 0.1, spacing: 5, width: 0.9, color: P.inkFaint, alpha: 0.6, seed: 5020 + k, density: (x, y) => sstep(cy - 4, cy + 22 * s, y) });
    });
    // birds
    const tw = L.onTwos(t);
    for (let i = 0; i < 4; i++) {
      const bx = 380 + i * 64 + tw * 46, by = 860 - i * 22 - Math.sin(tw * 3 + i) * 6;
      const flap = Math.sin(tw * 14 + i * 1.7) * 8;
      L.inkPath(ctx, [[bx - 16, by - flap], [bx - 6, by - 2], [bx, by], [bx + 6, by - 2], [bx + 16, by - flap]], { width: 2, seed: 5030 + i, taper: 4 });
    }
  }

  function hills(ctx, L, P, T) {
    // far hill band, stippled for distance
    const far = [[-20, 1130], [140, 1080], [330, 1100], [520, 1060], [700, 1050], [880, 1030], [1100, 1060], [1100, 1300], [-20, 1300]];
    L.inkPath(ctx, far, { closed: true, fill: P.stripeSage, color: P.inkSoft, width: 2, seed: 5100 });
    L.stipple(ctx, far, { spacing: 6, r: [0.4, 1.1], color: P.inkSoft, alpha: 0.6, seed: 5101, density: (x, y) => 0.25 + 0.5 * sstep(1050, 1250, y) });
    // the school, small on the far hill (scaled copy of the cast's school)
    const C = FILM.cast;
    ctx.save();
    ctx.translate(735, 1062);
    ctx.scale(0.5, 0.5);
    ctx.translate(-C.G.schoolX, -C.G.deckY);
    C.school(ctx, T);
    ctx.restore();
    // background trees on the far hill
    [[300, 1098, 0.42], [420, 1080, 0.36], [1000, 1050, 0.4]].forEach(([x, y, s], k) => C.tree(ctx, T, x, y, s, 5110 + k * 40));
  }

  function banks(ctx, L, P, t) {
    const sides = [
      [[-30, DY], [XL + 30, DY], [XL + 40, DY + 70], [XL + 10, DY + 170], [XL + 40, DY + 260], [XL + 20, 1950], [-30, 1950]],
      [[1110, DY], [XR - 30, DY], [XR - 44, DY + 80], [XR - 12, DY + 180], [XR - 40, DY + 290], [XR - 24, 1950], [1110, 1950]],
    ];
    sides.forEach((pts, k) => {
      L.inkPath(ctx, pts, { closed: true, fill: P.cliff, width: 3.4, seed: 5200 + k, smooth: false });
      L.crossHatch(ctx, pts, { angle: 0.95, spacing: 6, width: 1.05, seed: 5202 + k, alpha: 0.8, density: (x, y) => 0.15 + 0.75 * sstep(DY + 30, DY + 520, y) * (k ? sstep(1100, XR - 40, x) * 0.6 + 0.4 : sstep(-30, XL + 40, x) * 0.6 + 0.4) });
      // strata
      for (let s = 0; s < 6; s++) {
        const y = DY + 60 + s * 95 + (s % 2) * 12;
        const x0 = k ? XR - 10 : -20, x1 = k ? 1100 : XL + 10;
        L.inkPath(ctx, [[x0, y], [(x0 + x1) / 2, y + 8 * Math.sin(s * 1.7 + k)], [x1, y - 5]], { width: 1.6, alpha: 0.6, seed: 5210 + s + k * 10, color: P.inkSoft });
      }
      // stones in the cliff face
      for (let s = 0; s < 6; s++) {
        const sx = k ? lerp(XR + 30, 1060, L.h3(s, k, 9)) : lerp(20, XL - 20, L.h3(s, k, 9));
        const sy = DY + 90 + L.h3(s, k, 10) * 320;
        const rx = 16 + L.h3(s, k, 11) * 18, ry = rx * 0.62;
        const st = L.ellipsePts(sx, sy, rx, ry, 22, L.h3(s, k, 12) - 0.5);
        L.inkPath(ctx, st, { closed: true, fill: s % 2 ? P.paperDeep : P.tan, width: 2, seed: 5230 + s + k * 10 });
        L.hatch(ctx, st, { angle: -0.8, spacing: 4, width: 0.9, seed: 5250 + s + k * 10, alpha: 0.8, density: (x, y) => sstep(-0.2, 0.9, (x - sx) / rx * 0.6 + (y - sy) / ry * 0.8) });
      }
      // grass lip with blades
      const gx0 = k ? XR - 30 : -30, gx1 = k ? 1110 : XL + 30;
      const lip = [[gx0, DY - 2], [gx1, DY - 2], [gx1, DY + 22], [gx0, DY + 28]];
      L.inkPath(ctx, lip, { closed: true, fill: P.grass, width: 2.4, seed: 5270 + k, smooth: false });
      L.hatch(ctx, lip, { angle: 1.3, spacing: 4, width: 1, color: P.leaf, alpha: 0.9, seed: 5272 + k });
      const p = new Path2D();
      for (let i = 0; i < 34; i++) {
        const gx = lerp(gx0 + 6, gx1 - 6, i / 33) + L.h3(i, k, 3) * 4;
        const h = 12 + L.h3(i, k, 4) * 18;
        const sw = Math.sin(L.onTwos(t) * 3 + i) * 3;
        p.moveTo(gx, DY + 2);
        p.quadraticCurveTo(gx + 2, DY - h * 0.5, gx + 5 + sw, DY - h);
      }
      ctx.save();
      ctx.strokeStyle = P.ink;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.stroke(p);
      ctx.restore();
    });
    // flowers on the near bank
    [[30, DY - 4, P.rose], [70, DY - 2, P.sun], [1040, DY - 4, P.sun], [1070, DY - 2, P.rose]].forEach(([x, y, c], k) => {
      L.inkLine(ctx, x, y, x + 3, y - 34, { width: 1.8, seed: 5290 + k, color: P.leaf });
      for (let q = 0; q < 5; q++) {
        const a = (q / 5) * TAU;
        L.inkCircle(ctx, x + 3 + Math.cos(a) * 7, y - 38 + Math.sin(a) * 7, 5, { fill: c, width: 1.2, seed: 5300 + k * 5 + q });
      }
      L.inkCircle(ctx, x + 3, y - 38, 3.5, { fill: P.ochre, width: 1, seed: 5320 + k });
    });
  }

  function river(ctx, L, P, t) {
    const x0 = XL - 20, x1 = XR + 20;
    const water = [[x0, WATER], [x1, WATER], [x1, 1950], [x0, 1950]];
    L.inkPath(ctx, water, { closed: true, fill: P.water, width: 0.1, seed: 5400, smooth: false });
    L.hatch(ctx, water, { angle: 0, spacing: 7, width: 1, color: P.waterDeep, seed: 5401, alpha: 0.85, density: (x, y) => 0.2 + 0.7 * sstep(WATER, WATER + 260, y) });
    // reflection of the deck: a darker wavy band right under the bridge position
    const tw = L.onTwos(t);
    const p = new Path2D();
    for (let r = 0; r < 6; r++) {
      const y = WATER + 30 + r * 12;
      for (let s = 0; s < 14; s++) {
        const x = lerp(XL, XR, (s + 0.5) / 14) + Math.sin(tw * 3 + r + s) * 6;
        const len = 22 + L.h3(r, s, 5) * 20;
        p.moveTo(x - len / 2, y);
        p.lineTo(x + len / 2, y + Math.sin(s + r) * 1.5);
      }
    }
    ctx.save();
    ctx.strokeStyle = L.rgba(P.plankDeep, 0.5);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke(p);
    ctx.restore();
    // moving ripples
    for (let i = 0; i < 6; i++) {
      const y = WATER + 120 + i * 48;
      const off = (tw * 90 + i * 37) % 130;
      for (let s = 0; s < 7; s++) {
        const wx = x0 + off + s * 130 - 70;
        L.inkPath(ctx, [[wx, y], [wx + 16, y - 8], [wx + 32, y], [wx + 48, y - 8]], { width: 2.2, seed: 5420 + i * 7 + s, color: P.white, alpha: 0.9 });
      }
    }
    L.inkLine(ctx, x0, WATER, x1, WATER, { width: 2.8, seed: 5402, color: P.waterDeep });
  }

  // ---------------------------------------------------------------- the bridge
  function post(ctx, L, P, x, seed) {
    const w = 34;
    const pts = [[x - w / 2, DY + 40], [x - w / 2 + 2, POST_TOP], [x, POST_TOP - 10], [x + w / 2 - 2, POST_TOP], [x + w / 2, DY + 40]];
    L.inkPath(ctx, pts, { closed: true, fill: P.wood, width: 3, seed, smooth: false });
    L.hatch(ctx, pts, { angle: 1.52, spacing: 4.5, width: 1, seed: seed + 1, alpha: 0.85, density: (px) => sstep(x - 6, x + w / 2, px) * 0.9 + 0.1 });
    // growth rings at the top and rope wraps
    L.inkPath(ctx, L.ellipsePts(x, POST_TOP - 4, w / 2 - 2, 6, 20), { closed: true, fill: P.tan, width: 1.8, seed: seed + 2 });
    for (const wy of [POST_TOP + 22, DY - 54]) {
      for (let k = 0; k < 4; k++) L.inkPath(ctx, [[x - w / 2 - 3, wy + k * 6], [x, wy + k * 6 + 3], [x + w / 2 + 3, wy + k * 6]], { color: P.ink, width: 1.4, seed: seed + 10 + k + wy });
    }
  }

  function plank(ctx, L, P, i, seed) {
    const span = (XR - XL - 20) / NPL;
    const xa = XL + 10 + i * span + 3, xb = xa + span - 6;
    const ya = deckY(xa), yb = deckY(xb);
    const h = 34;
    const pts = [[xa, ya - 4], [xb, yb - 4], [xb + 1, yb + h - 4], [xa - 1, ya + h - 4]];
    L.inkPath(ctx, pts, { closed: true, fill: P.plank, width: 2.6, seed: seed, smooth: false });
    // grain: wavy lines along the plank, plus a knot
    for (let g = 0; g < 4; g++) {
      const gy = 6 + g * 7;
      const line = [];
      for (let k = 0; k <= 8; k++) {
        const u = k / 8;
        line.push([lerp(xa + 4, xb - 4, u), lerp(ya, yb, u) - 4 + gy + Math.sin(u * 7 + g * 2 + i) * 1.6]);
      }
      L.inkPath(ctx, line, { color: P.plankDeep, width: 1.1, seed: seed + 1 + g, alpha: 0.9 });
    }
    const kx = lerp(xa, xb, 0.3 + L.h3(i, 1, 7) * 0.4), ky = lerp(ya, yb, 0.5) + 12;
    L.inkPath(ctx, L.ellipsePts(kx, ky, 7, 3.5, 14), { closed: true, fill: P.plankDeep, width: 1.2, seed: seed + 8 });
    // underside shade and nails
    L.hatch(ctx, pts, { angle: 0.6, spacing: 4, width: 1, seed: seed + 9, alpha: 0.7, density: (x, y) => sstep(lerp(ya, yb, (x - xa) / (xb - xa)) + 16, lerp(ya, yb, (x - xa) / (xb - xa)) + 30, y) });
    for (const nx of [xa + 9, xb - 9]) {
      const ny = deckY(nx) + 9;
      L.inkCircle(ctx, nx, ny, 2.8, { fill: P.inkSoft, width: 1, seed: seed + 20 + Math.round(nx) });
    }
  }

  function bridge(ctx, L, P, T, glint) {
    // back hand rope (behind the deck)
    rope(ctx, L, P, sampleRope(POST_TOP + 30, 70, XL, XR, 60), 5500, { w: 6, fill: P.paperDeep });
    // stringer beam under the planks
    const beam = [];
    for (let k = 0; k <= 30; k++) { const x = lerp(XL, XR, k / 30); beam.push([x, deckY(x) + 28]); }
    for (let k = 30; k >= 0; k--) { const x = lerp(XL, XR, k / 30); beam.push([x, deckY(x) + 46]); }
    L.inkPath(ctx, beam, { closed: true, fill: P.plankDeep, width: 2.4, seed: 5510, smooth: false });
    L.hatch(ctx, beam, { angle: 0.2, spacing: 4, width: 1, seed: 5511, alpha: 0.8 });
    for (let i = 0; i < NPL; i++) plank(ctx, L, P, i, 5600 + i * 40);
    // footstep glints on planks already crossed
    glint();
    post(ctx, L, P, XL, 5700);
    post(ctx, L, P, XR, 5720);
  }

  function frontRopes(ctx, L, P) {
    const hand = sampleRope(POST_TOP + 20, 78, XL, XR, 60);
    // suspenders from the hand rope down to the deck
    for (let i = 0; i <= NPL; i++) {
      const x = lerp(XL + 10, XR - 10, i / NPL);
      const top = ropeY(x, POST_TOP + 20, 78);
      L.inkPath(ctx, [[x, top], [x + 1, deckY(x) + 4]], { color: P.inkSoft, width: 2.2, seed: 5800 + i, wobble: 0.6 });
      L.inkPath(ctx, [[x - 6, deckY(x) - 2], [x + 6, deckY(x) - 2]], { color: P.ink, width: 2, seed: 5820 + i });
    }
    rope(ctx, L, P, hand, 5840, { w: 8 });
  }

  // a limb as a closed outline: offset the centreline by a width that runs w0 -> w1, round ends
  function tube(pts, w0, w1) {
    const n = 24, cl = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n * (pts.length - 1);
      const k = Math.min(pts.length - 2, Math.floor(u)), f = u - k;
      cl.push([lerp(pts[k][0], pts[k + 1][0], f), lerp(pts[k][1], pts[k + 1][1], f)]);
    }
    const L1 = [], R1 = [];
    for (let i = 0; i <= n; i++) {
      const a = cl[Math.max(0, i - 1)], b = cl[Math.min(n, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
      const nx = -dy / d, ny = dx / d, w = lerp(w0, w1, i / n) / 2;
      L1.push([cl[i][0] + nx * w, cl[i][1] + ny * w]);
      R1.push([cl[i][0] - nx * w, cl[i][1] - ny * w]);
    }
    const end = (c, from, to, w) => {
      const out = [];
      const a0 = Math.atan2(from[1] - c[1], from[0] - c[0]);
      for (let k = 1; k < 6; k++) { const a = a0 - (k / 6) * Math.PI; out.push([c[0] + Math.cos(a) * w, c[1] + Math.sin(a) * w]); }
      return out;
    };
    const tail = end(cl[n], L1[n], R1[n], w1 / 2);
    const head = end(cl[0], R1[0], L1[0], w0 / 2);
    return L1.concat(tail, R1.reverse(), head);
  }

  // ---------------------------------------------------------------- detailed figure
  /**
   * kid(ctx, L, P, o) : a detailed child in three-quarter profile. Feet on (o.x, o.y), 560 px tall at
   * s = 1. o.dir 1 faces right. o.pose 'walk' (o.ph) | 'stand' | 'wave' (o.wt). Colours from o.c.
   * o.hair 'short' | 'ponytail'; o.headphones.
   */
  function kid(ctx, L, P, o) {
    const s = o.s || 1, dir = o.dir || 1, sd = o.seed || 6000;
    const c = o.c;
    const pose = o.pose || 'stand';
    const ph = o.ph || 0;
    const X = (u) => o.x + dir * u * s;           // local x (positive = facing side)
    const Y = (v) => o.y + v * s;                 // local y (negative = up)
    const bob = pose === 'walk' ? -Math.abs(Math.cos(ph)) * 7 : 0;
    const B = (v) => Y(v + bob);
    const shade = (sideFront) => (x) => {
      const u = (x - o.x) * dir / s;              // local x
      return sideFront ? sstep(-10, 40, u) : sstep(10, -40, u);
    };

    // ----- legs: hip at local (0,-230); thigh 112, shin 108
    const legs = [];
    const swing = pose === 'walk' ? 0.42 : 0.0;
    for (const k of [0, 1]) {
      const a = (k ? -1 : 1) * Math.sin(ph) * swing;                 // thigh angle from vertical
      const knee = Math.max(0, (k ? 1 : -1) * Math.cos(ph)) * 0.55 * (pose === 'walk' ? 1 : 0);
      const hx = (k ? 8 : -8), hy = -230;
      const kx = hx + Math.sin(a) * 112, ky = hy + Math.cos(a) * 112;
      const ax = kx + Math.sin(a - knee) * 108, ay = ky + Math.cos(a - knee) * 108;
      legs.push({ k, hx, hy, kx, ky, ax, ay: Math.min(ay, -2) });
    }
    const drawLeg = (g, far) => {
      const thick = 44, thin = 34;
      const col = far ? c.pantsFar : c.pants;
      const path = [[g.hx, g.hy], [g.kx, g.ky], [g.ax, g.ay]].map(([u, v]) => [X(u), B(v)]);
      const legPts = tube(path, thick * s, thin * s);
      L.inkPath(ctx, legPts, { closed: true, fill: col, width: 2.8, seed: sd + 10 + g.k, smooth: false });
      L.hatch(ctx, legPts, { angle: -1.1, spacing: 4.5, width: 1, color: P.ink, alpha: far ? 0.5 : 0.35, seed: sd + 12 + g.k, density: (x) => sstep(-4, 20, (x - lerp(path[0][0], path[2][0], 0.5)) * -dir) });
      // knee crease and hem
      L.inkPath(ctx, [[path[1][0] - 10 * s, path[1][1] - 4 * s], [path[1][0] + dir * 8 * s, path[1][1] + 2 * s]], { width: 1.4, seed: sd + 16 + g.k, alpha: 0.7 });
      // shoe: a sole and an upper, toe toward dir
      const fx = path[2][0], fy = path[2][1] + 4 * s;
      const shoe = [[fx - dir * 24 * s, fy - 22 * s], [fx + dir * 22 * s, fy - 24 * s], [fx + dir * 50 * s, fy - 12 * s], [fx + dir * 52 * s, fy], [fx - dir * 28 * s, fy], [fx - dir * 30 * s, fy - 12 * s]];
      L.inkPath(ctx, shoe, { closed: true, fill: far ? c.shoeFar : c.shoe, width: 2.6, seed: sd + 18 + g.k });
      L.inkPath(ctx, [[fx - dir * 30 * s, fy - 5 * s], [fx + dir * 52 * s, fy - 5 * s]], { color: P.white, width: 3 * s, seed: sd + 20 + g.k, alpha: 0.9 });
      L.inkPath(ctx, [[fx + dir * 4 * s, fy - 22 * s], [fx + dir * 16 * s, fy - 14 * s]], { width: 1.4, seed: sd + 22 + g.k });
    };
    const far = legs[pose === 'walk' && Math.sin(ph) > 0 ? 1 : 0], near = far === legs[0] ? legs[1] : legs[0];

    // ----- arms: shoulder (0,-380)
    const armSwing = pose === 'walk' ? Math.sin(ph) * 0.5 : 0;
    const arm = (k, wave) => {
      const sx = (k ? 6 : -4), sy = -378;
      let a1, a2;
      if (wave) {
        a1 = Math.PI - 0.75; // up and forward
        a2 = a1 - 0.35 + Math.sin((o.wt || 0) * 11) * 0.45;
      } else {
        a1 = (k ? 1 : -1) * armSwing + 0.08;
        a2 = a1 + 0.25 + (k ? Math.max(0, armSwing) : Math.max(0, -armSwing)) * 0.6;
      }
      const ex = sx + Math.sin(a1) * 96, ey = sy + Math.cos(a1) * 96;
      const wx = ex + Math.sin(a2) * 88, wy = ey + Math.cos(a2) * 88;
      return { sx, sy, ex, ey, wx, wy, k };
    };
    const drawArm = (g, farA) => {
      const path = [[g.sx, g.sy], [g.ex, g.ey], [g.wx, g.wy]].map(([u, v]) => [X(u), B(v)]);
      const col = farA ? c.shirtFar : c.shirt;
      const armPts = tube(path, 38 * s, 30 * s);
      L.inkPath(ctx, armPts, { closed: true, fill: col, width: 2.6, seed: sd + 30 + g.k, smooth: false });
      L.hatch(ctx, armPts, { angle: -1.0, spacing: 4.5, width: 1, color: P.ink, alpha: farA ? 0.5 : 0.3, seed: sd + 32 + g.k, density: (x, y) => sstep(-4, 16, y - lerp(path[0][1], path[2][1], 0.5)) * 0.7 });
      // cuff
      const cu = [lerp(path[1][0], path[2][0], 0.86), lerp(path[1][1], path[2][1], 0.86)];
      L.inkCircle(ctx, cu[0], cu[1], 15 * s, { fill: col, width: 2, seed: sd + 34 + g.k });
      // sleeve fold lines at the elbow
      for (let f = 0; f < 2; f++) L.inkPath(ctx, [[path[1][0] - 10 * s, path[1][1] - 8 * s + f * 9 * s], [path[1][0] + 8 * s, path[1][1] - 2 * s + f * 9 * s]], { width: 1.3, seed: sd + 36 + g.k * 3 + f, alpha: 0.75 });
      // hand: palm + thumb
      const hx = path[2][0], hy = path[2][1];
      L.inkPath(ctx, L.ellipsePts(hx, hy + 6 * s, 15 * s, 18 * s, 18), { closed: true, fill: c.skin, width: 2.2, seed: sd + 40 + g.k });
      L.inkPath(ctx, [[hx + dir * 10 * s, hy], [hx + dir * 19 * s, hy - 8 * s]], { width: 2, seed: sd + 42 + g.k });
    };
    const waving = pose === 'wave';
    const armFar = arm(0, false), armNear = arm(1, waving);

    // ----- draw order: far arm, far leg, backpack, torso, near leg, near arm, head
    drawArm(armFar, true);
    drawLeg(far, true);

    // backpack
    const bp = L.rrectPts(0, 0, 1, 1, 0.3, 1).map(([u, v]) => [X(-118 + u * 64), B(-372 + v * 168)]);
    const bpPts = [[-118, -360], [-60, -376], [-52, -210], [-70, -196], [-120, -204], [-128, -300]].map(([u, v]) => [X(u), B(v)]);
    L.inkPath(ctx, bpPts, { closed: true, fill: c.backpack, width: 3, seed: sd + 50 });
    L.crossHatch(ctx, bpPts, { spacing: 5, width: 1, seed: sd + 51, tone: 0.5, alpha: 0.75, density: shade(false) });
    const pocket = [[-120, -282], [-76, -290], [-72, -222], [-118, -218]].map(([u, v]) => [X(u), B(v)]);
    L.inkPath(ctx, pocket, { closed: true, fill: c.backpackDeep, width: 2.2, seed: sd + 52 });
    L.inkPath(ctx, [[-118, -268], [-74, -276]].map(([u, v]) => [X(u), B(v)]), { width: 1.6, seed: sd + 53, alpha: 0.9 });
    L.inkCircle(ctx, X(-96), B(-272), 4 * s, { fill: P.sun, width: 1.2, seed: sd + 54 });
    void bp;

    drawLeg(near, false);
    // torso (long-sleeve shirt) with hem
    const torso = [[-50, -392], [-12, -404], [40, -396], [58, -360], [56, -240], [52, -206], [-54, -202], [-58, -250], [-62, -350]].map(([u, v]) => [X(u), B(v)]);
    L.inkPath(ctx, torso, { closed: true, fill: c.shirt, width: 3.2, seed: sd + 60 });
    L.hatch(ctx, torso, { angle: -1.05, spacing: 5, width: 1.1, color: c.shirtDeep, seed: sd + 61, alpha: 0.95, density: (x, y) => 0.15 + 0.85 * shade(true)(x) * 0.6 + 0.3 * sstep(-300, -206, (y - o.y) / s) });
    // stripe across the chest (identity detail)
    const stripe = [[-60, -320], [57, -326], [57, -302], [-60, -296]].map(([u, v]) => [X(u), B(v)]);
    L.inkPath(ctx, stripe, { closed: true, fill: c.stripe, width: 1.8, seed: sd + 62 });
    // collar and hem lines, a fold at the waist
    L.inkPath(ctx, [[-14, -402], [6, -388], [30, -398]].map(([u, v]) => [X(u), B(v)]), { width: 2.2, seed: sd + 63 });
    L.inkPath(ctx, [[-52, -214], [0, -210], [52, -216]].map(([u, v]) => [X(u), B(v)]), { width: 1.6, seed: sd + 64, alpha: 0.8 });
    L.inkPath(ctx, [[-30, -250], [-10, -236], [18, -244]].map(([u, v]) => [X(u), B(v)]), { width: 1.3, seed: sd + 65, alpha: 0.7 });
    // backpack strap over the shoulder
    L.inkPath(ctx, [[-36, -398], [-22, -330], [-30, -250]].map(([u, v]) => [X(u), B(v)]), { color: P.ink, width: 13 * s, seed: sd + 66 });
    L.inkPath(ctx, [[-36, -398], [-22, -330], [-30, -250]].map(([u, v]) => [X(u), B(v)]), { color: c.backpackDeep, width: 9 * s, seed: sd + 67, boil: false });

    // belt line
    L.inkPath(ctx, [[-52, -206], [52, -210]].map(([u, v]) => [X(u), B(v)]), { width: 2.4, seed: sd + 68 });
    drawArm(armNear, false);

    // ----- neck and head: head centre (6,-472), radius 66
    const hcx = X(6), hcy = B(-472), R = 66 * s;
    L.inkPath(ctx, [[X(-6), B(-420)], [X(14), B(-420)], [X(16), B(-396)], [X(-10), B(-394)]], { closed: true, fill: c.skinDeep, width: 2.2, seed: sd + 70 });
    if (o.hair === 'ponytail') {
      // ponytail behind the head
      const pt = [[-58, -505], [-104, -470], [-118, -410], [-96, -398], [-80, -440], [-50, -470]].map(([u, v]) => [X(u), B(v + Math.sin((o.wt || 0) * 6) * 3)]);
      L.inkPath(ctx, pt, { closed: true, fill: c.hair, width: 2.6, seed: sd + 71 });
      L.hatch(ctx, pt, { angle: 1.2, spacing: 4, width: 1, color: P.ink, seed: sd + 72, alpha: 0.6 });
      L.inkCircle(ctx, X(-60), B(-492), 9 * s, { fill: c.tie, width: 2, seed: sd + 73 });
    }
    // head shape: slightly wider at the cheek, chin toward dir
    const head = [];
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * TAU;
      const cx = Math.cos(a), sy = Math.sin(a);
      const chin = sy > 0 && cx * dir > 0 ? 1 + 0.05 * sy : 1;
      head.push([hcx + cx * R * chin, hcy + sy * R * 1.04 * (sy > 0 ? 1.02 : 1)]);
    }
    L.inkPath(ctx, head, { closed: true, fill: c.skin, width: 3.2, seed: sd + 74 });
    L.hatch(ctx, head, { angle: -1.2, spacing: 5, width: 0.9, color: c.skinDeep, seed: sd + 75, alpha: 0.8, density: (x, y) => sstep(R * 0.2, R, Math.hypot(x - (hcx - dir * R * 0.35), y - (hcy - R * 0.35))) * 0.55 });
    // ear
    const ex = hcx - dir * R * 0.22, ey = hcy + R * 0.08;
    L.inkPath(ctx, L.ellipsePts(ex, ey, R * 0.16, R * 0.22, 18), { closed: true, fill: c.skin, width: 2.4, seed: sd + 76 });
    L.inkPath(ctx, [[ex + dir * R * 0.04, ey - R * 0.1], [ex - dir * R * 0.05, ey], [ex + dir * R * 0.03, ey + R * 0.1]], { width: 1.5, seed: sd + 77 });
    // hair mass and strands
    const hair = [];
    const order = [];
    for (let i = 0; i <= 22; i++) order.push(i);
    if (dir < 0) order.reverse();
    for (const i of order) {
      const a = Math.PI + (i / 22) * Math.PI;
      hair.push([hcx + Math.cos(a) * R * 1.08, hcy + Math.sin(a) * R * 1.1 - 3 * s]);
    }
    // fringe toward the face, then the back of the head down to the nape
    hair.push([hcx + dir * R * 0.98, hcy - R * 0.28], [hcx + dir * R * 0.7, hcy - R * 0.42], [hcx + dir * R * 0.5, hcy - R * 0.3], [hcx + dir * R * 0.28, hcy - R * 0.48], [hcx + dir * R * 0.02, hcy - R * 0.36], [hcx - dir * R * 0.16, hcy - R * 0.2], [hcx - dir * R * 0.5, hcy + R * 0.02], [hcx - dir * R * 0.7, hcy + R * 0.5], [hcx - dir * R * 1.04, hcy + R * 0.32]);
    L.inkPath(ctx, hair, { closed: true, fill: c.hair, width: 2.8, seed: sd + 78 });
    const hp = new Path2D();
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * 1.1 + (i / 8) * Math.PI * 0.8;
      const r0 = R * 0.55, r1 = R * 1.02;
      hp.moveTo(hcx + Math.cos(a) * r0, hcy + Math.sin(a) * r0 - R * 0.2);
      hp.quadraticCurveTo(hcx + Math.cos(a + 0.12) * R * 0.85, hcy + Math.sin(a + 0.12) * R * 0.85 - R * 0.1, hcx + Math.cos(a + 0.2) * r1, hcy + Math.sin(a + 0.2) * r1 - 2 * s);
    }
    ctx.save();
    ctx.strokeStyle = L.rgba(c.hairLight, 0.75);
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.stroke(hp);
    ctx.restore();
    // face: eye (white, iris, highlight), far eye, brow, nose, smile, blush
    const fx = (u) => hcx + dir * u * R, fy = (v) => hcy + v * R;
    const blink = o.blink ? 0.12 : 1;
    L.inkPath(ctx, L.ellipsePts(fx(0.5), fy(-0.02), R * 0.13, R * 0.16 * blink, 18), { closed: true, fill: P.white, width: 1.8, seed: sd + 80 });
    if (blink > 0.5) {
      L.inkCircle(ctx, fx(0.55), fy(0.0), R * 0.085, { fill: c.iris, color: P.ink, width: 1.2, seed: sd + 81 });
      L.inkCircle(ctx, fx(0.56), fy(0.01), R * 0.045, { fill: P.ink, color: P.ink, width: 0.6, seed: sd + 82 });
      L.inkCircle(ctx, fx(0.52), fy(-0.04), R * 0.025, { fill: P.white, color: P.white, width: 0.4, seed: sd + 83 });
    }
    L.inkPath(ctx, L.ellipsePts(fx(0.9), fy(-0.02), R * 0.05, R * 0.13 * blink, 12), { closed: true, fill: P.ink, width: 1, seed: sd + 84 });
    L.inkPath(ctx, [[fx(0.36), fy(-0.24)], [fx(0.52), fy(-0.3)], [fx(0.66), fy(-0.26)]], { width: 2.6, seed: sd + 85, color: c.hair });
    L.inkPath(ctx, [[fx(0.86), fy(0.05)], [fx(1.04), fy(0.2)], [fx(0.9), fy(0.26)]], { width: 2.2, seed: sd + 86 });
    const mouth = [[fx(0.46), fy(0.42)], [fx(0.62), fy(0.56)], [fx(0.82), fy(0.44)], [fx(0.64), fy(0.48)]];
    L.inkPath(ctx, mouth, { closed: true, fill: c.mouth, width: 2.2, seed: sd + 87 });
    ctx.save();
    ctx.fillStyle = L.rgba(P.blush, 0.55);
    ctx.beginPath();
    ctx.ellipse(fx(0.48), fy(0.26), R * 0.15, R * 0.08, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
    // headphones: band over the top, cup over the ear with a cushion ring
    if (o.headphones) {
      const band = [];
      for (let i = 0; i <= 18; i++) {
        const a = Math.PI * 1.08 + (i / 18) * Math.PI * 0.62;
        band.push([hcx - dir * R * 0.2 + Math.cos(a) * R * 1.14 * dir * -1 * -1, hcy + Math.sin(a) * R * 1.18]);
      }
      // band follows the skull from the ear up over the crown
      const bandPts = [[ex, ey - R * 0.2], [hcx - dir * R * 0.32, hcy - R * 0.95], [hcx + dir * R * 0.15, hcy - R * 1.18], [hcx + dir * R * 0.55, hcy - R * 1.05]];
      L.inkPath(ctx, bandPts, { color: P.ink, width: 15 * s, seed: sd + 90 });
      L.inkPath(ctx, bandPts, { color: c.phones, width: 10 * s, seed: sd + 91, boil: false });
      void band;
      const cup = L.rrectPts(ex - R * 0.24, ey - R * 0.34, R * 0.48, R * 0.66, R * 0.2, 10);
      L.inkPath(ctx, cup, { closed: true, fill: c.phones, width: 2.8, seed: sd + 92 });
      L.crossHatch(ctx, cup, { spacing: 4, width: 0.9, seed: sd + 93, tone: 0.45, alpha: 0.8, density: (x) => sstep(ex - dir * R * 0.2, ex + dir * R * 0.3, x) });
      L.inkPath(ctx, L.ellipsePts(ex + dir * R * 0.02, ey - R * 0.01, R * 0.12, R * 0.2, 16), { closed: true, fill: c.phonesDeep, width: 1.6, seed: sd + 94 });
    }
    return { head: [hcx, hcy], R };
  }

  // ---------------------------------------------------------------- scene
  FILM.scene({
    id: ID,
    draw(ctx, tIn, info) {
      const L = info.lib;
      const P = L.pal;
      const C = FILM.cast;
      const t = clamp(tIn, 0, info.dur);
      const T = info.shot.start + t;
      const tw = L.onTwos(t);

      const HERO = {
        skin: P.skin, skinDeep: P.skinDeep, hair: P.hair, hairLight: P.inkSoft, iris: P.wood, mouth: P.red,
        shirt: P.shirt, shirtFar: P.shirtDeep, shirtDeep: P.shirtDeep, stripe: P.white,
        pants: P.pants, pantsFar: P.night, shoe: P.red, shoeFar: P.roof,
        backpack: P.backpack, backpackDeep: P.orange, phones: P.aurumGold, phonesDeep: P.aurumBrown,
      };
      const FRIEND = {
        skin: P.skinDeep, skinDeep: P.wood, hair: P.ink, hairLight: P.inkSoft, iris: P.ink, mouth: P.red, tie: P.annMagenta,
        shirt: P.friendTop, shirtFar: P.ochre, shirtDeep: P.ochre, stripe: P.annMagenta,
        pants: P.tealDeep, pantsFar: P.night, shoe: P.teal, shoeFar: P.tealDeep,
        backpack: P.rose, backpackDeep: P.sunset,
      };

      // walking: position on twos, phase on twos
      const w = L.seg(tw, WALK[0], WALK[1], 'inOutSine');
      const x = lerp(230, 560, w);
      const walking = t > WALK[0] && t < WALK[1];

      // 1–3 background
      backdrop(ctx, L, P, t, T);
      hills(ctx, L, P, T);
      // 4–5 banks and river
      river(ctx, L, P, t);
      banks(ctx, L, P, t);
      // 6 bridge
      bridge(ctx, L, P, T, () => {
        const span = (XR - XL - 20) / NPL;
        for (let i = 0; i < NPL; i++) {
          const px = XL + 10 + (i + 0.5) * span;
          if (x < px + 10) continue;
          const age = clamp((x - px) / 260);
          L.glowDot(ctx, px, deckY(px) + 6, 7 + (1 - age) * 7, { color: P.sun, rays: 0, glow: 3 });
        }
      });

      // 7 the classmate at the far end, the child on the deck
      const fxp = 840;
      kid(ctx, L, P, { x: fxp, y: deckY(fxp) + 2, s: 0.9, dir: -1, pose: t >= 0.9 ? 'wave' : 'stand', wt: t, c: FRIEND, hair: 'ponytail', seed: 6500, blink: t > 0.5 && t < 0.62 });
      const slope = deckSlope(x);
      ctx.save();
      ctx.translate(x, deckY(x));
      ctx.rotate(Math.atan(slope) * 0.5);
      ctx.translate(-x, -deckY(x));
      kid(ctx, L, P, { x, y: deckY(x) + 2, s: 0.95, dir: 1, pose: walking ? 'walk' : t >= WALK[1] ? 'wave' : 'stand', ph: tw * 8.4, wt: t + 0.3, c: HERO, headphones: true, seed: 6000, blink: t > 2.5 && t < 2.62 });
      ctx.restore();
      frontRopes(ctx, L, P);

      // 8 step taps, sparkles, heart
      const st = L.seg(t, B_STEP - FR, B_STEP + 0.4, 'outExpo');
      if (st > 0 && st < 1) L.ticks(ctx, x + 30, deckY(x) - 2, { r: 16 + st * 22, n: 7, len: 9 + st * 16, start: -Math.PI * 0.95, span: Math.PI * 0.9, color: P.aurumGold, alpha: 1 - st, width: 3 });
      const sp = L.seg(t, B_WAVE - FR, B_WAVE + 0.6, 'outCubic');
      if (sp > 0) {
        for (let k = 0; k < 12; k++) {
          const a = (k / 12) * TAU + 0.3;
          const r = 170 + sp * 90 + L.h3(k, 2, 55) * 50;
          const sx = 725 + Math.cos(a) * r, sy = 900 + Math.sin(a) * r * 0.75;
          const tws = 0.5 + 0.5 * Math.sin(tw * 10 + k * 1.3);
          L.glowDot(ctx, sx, sy, 6 + tws * 6, { color: k % 2 ? P.sun : P.aurumGold, rays: 4, rayLen: 3, glow: 2, rot: k });
        }
        const hp = L.ease.outBack(sp);
        ctx.save();
        ctx.translate(722, 640 - sp * 24);
        ctx.scale(hp * 1.3, hp * 1.3);
        const h = new Path2D();
        h.moveTo(0, 30);
        h.bezierCurveTo(-46, 0, -34, -38, 0, -16);
        h.bezierCurveTo(34, -38, 46, 0, 0, 30);
        ctx.fillStyle = P.annMagenta;
        ctx.fill(h);
        ctx.strokeStyle = P.ink;
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.stroke(h);
        ctx.strokeStyle = L.rgba(P.white, 0.8);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(-14, -8, 9, Math.PI * 1.1, Math.PI * 1.6);
        ctx.stroke();
        ctx.restore();
      }

      // 9 card
      C.card(ctx, ['No es cambiar quién es:', 'es tender puentes'], { p: 0.75 + L.seg(t, 0, 0.25) * 0.25, size: 66, accent: L.seg(t, 1.2, 1.9, 'outCubic') });
    },
  });
})();
