/*
 * cast.js : the recurring set and characters of "Puentes al colegio".
 * Loaded after src/props.js and before the scenes. Every scene draws the set and the people through
 * these functions, so the bridge, the cliffs and the child land on the same pixels in every shot.
 *
 *   FILM.cast.G            shared geometry (art bible 10, storyboard G1)
 *   FILM.cast.card         the on-screen text card (cream label, dark ink, >= 56 px)
 *   FILM.cast.sky/cliffs/river/school/plank/bridge   the set, paper or schematic (o.schem)
 *   FILM.cast.child        the hero (about 300 px tall at s = 1, feet on y)
 *   FILM.cast.adult        parent / teacher (about 400 px tall at s = 1)
 *   FILM.cast.friend       the classmate on the far side
 */
(function () {
  'use strict';
  const FILM = window.FILM;
  const L = FILM.lib;
  const P = L.pal;
  const TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  // ---------------------------------------------------------------- shared geometry (G1)
  const G = {
    deckY: 1100,          // top of both cliffs and of the bridge deck
    leftEdge: 320,        // left cliff lip
    rightEdge: 760,       // right cliff lip
    plankW: 88,           // five planks fill 320..760
    plankH: 30,
    waterY: 1430,         // river surface inside the gap
    childX: 200,          // the child on the near bank
    schoolX: 925,         // centre of the school on the far bank
    cardX: 520,           // text card centre (keeps clear of the right 120 px)
    cardY: 400,
    labels: ['Comunicación', 'Anticipar rutinas', 'Calma', 'Familia', 'Colegio'],
  };
  G.plankX = (i) => G.leftEdge + i * G.plankW;

  // ---------------------------------------------------------------- small helpers
  function shape(ctx, pts, o, fill, seed, width, smooth) {
    const sm = smooth !== false;
    if (o.schem) {
      L.inkPath(ctx, pts, { closed: true, fill: P.navy, color: o.line || P.lavender, width: (width || 3) * 0.75, seed, wobble: 1, smooth: sm, alpha: o.alpha != null ? o.alpha : 1 });
    } else {
      L.inkPath(ctx, pts, { closed: true, fill, color: P.ink, width: width || 3, seed, smooth: sm, alpha: o.alpha != null ? o.alpha : 1 });
    }
  }
  function line(ctx, pts, o, seed, width, color) {
    if (o.schem && (width || 0) > 8) {
      // a thick limb in line art: an outlined tube, not a solid white bar
      L.inkPath(ctx, pts, { color: o.line || P.lavender, width: width * 0.8, seed, wobble: 0.6, taper: 2 });
      L.inkPath(ctx, pts, { color: P.navy, width: width * 0.8 - 5, seed: seed + 1, wobble: 0.6, taper: 2, boil: false });
      return;
    }
    L.inkPath(ctx, pts, { color: o.schem ? (o.line || P.lavender) : color || P.ink, width: (width || 2.6) * (o.schem ? 0.8 : 1), seed, alpha: o.alpha != null ? o.alpha : 1 });
  }
  const poly = (cx, cy, s, arr) => arr.map(([x, y]) => [cx + x * s, cy + y * s]);

  // ---------------------------------------------------------------- the text card
  /**
   * card(ctx, lines, o) : a cream paper label with dark ink type, centred on (o.x, o.y).
   *   size 66 (never below 56), color aurumGray, p 1 (pop-in 0..1), accent (gold underline).
   */
  function card(ctx, lines, o = {}) {
    const x = o.x != null ? o.x : G.cardX;
    const y = o.y != null ? o.y : G.cardY;
    const p = o.p != null ? clamp(o.p) : 1;
    if (p <= 0) return;
    let size = o.size || 66;
    const maxW = o.maxW || 760;
    const font = (sz) => `700 ${sz}px "SF Pro Rounded", ui-rounded, "Helvetica Neue", system-ui, Arial, sans-serif`;
    ctx.save();
    ctx.font = font(size);
    let w = Math.max(...lines.map((s) => ctx.measureText(s).width));
    while (w > maxW && size > 56) {
      size -= 2;
      ctx.font = font(size);
      w = Math.max(...lines.map((s) => ctx.measureText(s).width));
    }
    ctx.restore();
    const lh = size * 1.22;
    const bw = w + 90, bh = lines.length * lh + 70;
    const sc = lerp(0.9, 1, L.ease.outBack(p));
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sc, sc);
    ctx.rotate(o.rot || -0.012);
    ctx.globalAlpha *= clamp(p * 2);
    // shadow sheet
    const sh = L.rrectPts(-bw / 2 + 12, -bh / 2 + 14, bw, bh, 26, 20);
    L.inkPath(ctx, sh, { closed: true, fill: o.schem ? P.navyDeep : P.paperDeep, color: o.schem ? P.navyDeep : P.paperDeep, width: 1, seed: 801, alpha: 0.9 });
    const box = L.rrectPts(-bw / 2, -bh / 2, bw, bh, 26, 20);
    L.inkPath(ctx, box, { closed: true, fill: P.cardPaper, color: P.ink, width: 3.4, seed: o.seed || 802, double: { offset: 6, alpha: 0.45, width: 0.5, from: 0.05, to: 0.9 } });
    // gold tape corners
    for (const s of [-1, 1]) {
      const tx = s * (bw / 2 - 30), ty = -bh / 2 + 2;
      const tape = poly(tx, ty, 1, [[-34, -12], [34, -16], [36, 12], [-32, 16]]);
      L.inkPath(ctx, tape, { closed: true, fill: L.rgba(P.aurumGold, 0.55), color: L.rgba(P.aurumGold, 0.7), width: 1, seed: 803 + s });
    }
    lines.forEach((s, i) => {
      const ty = -bh / 2 + 35 + lh * (i + 0.5);
      L.text(ctx, s, 0, ty, { size, weight: 700, color: o.color || P.aurumGray, align: 'center', baseline: 'middle' });
    });
    if (o.accent) {
      const uy = bh / 2 - 22;
      L.inkPath(ctx, [[-w * 0.3, uy], [0, uy + 4], [w * 0.3, uy - 2]], { color: P.aurumGold, width: 5, seed: 805, draw: o.accent });
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- set: sky, cliffs, river
  function sky(ctx, t, o = {}) {
    if (o.schem) return;
    L.stripes(ctx, { bounds: [0, 0, 1080, 1920], colors: [P.stripeCream, P.stripeSky], width: 150, angle: -0.5, offset: L.onTwos(t) * 8, seed: 31 });
    // sun and clouds
    L.glowDot(ctx, 170, 640, 52, { color: P.sun, core: P.glow, additive: false, rays: 14, rayLen: 2.1, rayWidth: 0.12, twinkle: 0.05, glow: 2.5, rot: t * 0.15 });
    const clouds = [[700, 640, 1], [360, 760, 0.7], [960, 230, 0.8]];
    clouds.forEach(([cx, cy, s], k) => {
      const dx = L.onTwos(t) * 6 * (k + 1);
      const pts = [];
      for (let i = 0; i <= 40; i++) {
        const a = (i / 40) * TAU;
        const r = 1 + 0.18 * Math.sin(a * 5 + k);
        pts.push([cx + dx + Math.cos(a) * 95 * s * r, cy + Math.sin(a) * 34 * s * (a > Math.PI ? 1.3 : 0.6)]);
      }
      L.inkPath(ctx, pts, { closed: true, fill: P.white, color: P.inkSoft, width: 2, seed: 40 + k, alpha: 0.9 });
    });
  }

  function leftCliffPts() {
    return [[-30, G.deckY], [G.leftEdge, G.deckY], [G.leftEdge + 6, G.deckY + 60], [G.leftEdge - 18, G.deckY + 150], [G.leftEdge - 4, G.deckY + 260], [G.leftEdge - 36, G.deckY + 380], [G.leftEdge - 20, 1950], [-30, 1950]];
  }
  function rightCliffPts() {
    return [[1110, G.deckY], [G.rightEdge, G.deckY], [G.rightEdge - 8, G.deckY + 70], [G.rightEdge + 14, G.deckY + 170], [G.rightEdge + 2, G.deckY + 290], [G.rightEdge + 30, G.deckY + 400], [G.rightEdge + 18, 1950], [1110, 1950]];
  }

  function cliffs(ctx, t, o = {}) {
    const sides = [leftCliffPts(), rightCliffPts()];
    sides.forEach((pts, k) => {
      shape(ctx, pts, o, P.cliff, 60 + k, 3.4, false);
      if (o.schem) {
        L.hatch(ctx, pts, { angle: 0.9, spacing: 14, width: 0.9, color: P.lavender, alpha: 0.35, seed: 64 + k, density: (x, y) => clamp((y - G.deckY - 30) / 200) });
        return;
      }
      L.hatch(ctx, pts, { angle: 0.95, spacing: 7, width: 1.1, seed: 62 + k, alpha: 0.75, density: (x, y) => 0.25 + 0.6 * clamp((y - G.deckY - 40) / 600) });
      // strata lines
      for (let s = 0; s < 6; s++) {
        const y = G.deckY + 70 + s * 120;
        const x0 = k ? G.rightEdge + 20 : -20, x1 = k ? 1100 : G.leftEdge - 30;
        L.inkPath(ctx, [[x0, y], [(x0 + x1) / 2, y + 10 * Math.sin(s + k)], [x1, y - 6]], { width: 1.6, alpha: 0.55, seed: 70 + s + k * 10, color: P.inkSoft });
      }
      // grass lip
      const gx0 = k ? G.rightEdge : -30, gx1 = k ? 1110 : G.leftEdge;
      const grass = [[gx0, G.deckY + 2], [gx1, G.deckY + 2], [gx1 + (k ? 0 : -4), G.deckY + 26], [gx0, G.deckY + 30]];
      L.inkPath(ctx, grass, { closed: true, fill: P.grass, color: P.ink, width: 2.4, seed: 80 + k });
      for (let i = 0; i < 26; i++) {
        const gx = lerp(gx0 + 10, gx1 - 10, i / 25);
        const sw = Math.sin(t * 3 + i) * 3;
        L.inkPath(ctx, [[gx, G.deckY + 4], [gx + 4 + sw, G.deckY - 14 - (i % 3) * 6]], { width: 1.6, seed: 90 + i + k * 30, taper: 4 });
      }
    });
  }

  function river(ctx, t, o = {}) {
    const x0 = G.leftEdge - 60, x1 = G.rightEdge + 60;
    const water = [[x0, G.waterY], [x1, G.waterY], [x1, 1950], [x0, 1950]];
    if (o.schem) {
      for (let i = 0; i < 7; i++) {
        const y = G.waterY + i * 60;
        const pts = [];
        for (let k = 0; k <= 30; k++) {
          const x = lerp(x0, x1, k / 30);
          pts.push([x, y + Math.sin(k * 0.8 - t * 4 + i) * 6]);
        }
        L.inkPath(ctx, pts, { color: P.paleBlue, width: 1.6, seed: 120 + i, alpha: 0.6 - i * 0.06 });
      }
      return;
    }
    L.inkPath(ctx, water, { closed: true, fill: P.water, color: P.ink, width: 0.1, seed: 110, alpha: 1, smooth: false });
    L.hatch(ctx, water, { angle: 0, spacing: 9, width: 1, color: P.waterDeep, seed: 111, alpha: 0.8, density: (x, y) => clamp((y - G.waterY) / 300) });
    const tw = L.onTwos(t);
    for (let i = 0; i < 8; i++) {
      const y = G.waterY + 12 + i * 52;
      const off = (tw * 90 + i * 37) % 120;
      for (let s = 0; s < 5; s++) {
        const wx = x0 + off + s * 120 - 60;
        L.inkPath(ctx, [[wx, y], [wx + 18, y - 9], [wx + 36, y], [wx + 54, y - 9]], { width: 2, seed: 130 + i * 7 + s, color: P.white, alpha: 0.85 });
      }
    }
    L.inkLine(ctx, x0, G.waterY, x1, G.waterY, { width: 2.6, seed: 112, color: P.waterDeep });
  }

  // ---------------------------------------------------------------- the school
  function school(ctx, t, o = {}) {
    const cx = o.x != null ? o.x : G.schoolX;
    const by = G.deckY;
    const body = [[cx - 135, by], [cx - 135, by - 210], [cx + 135, by - 210], [cx + 135, by]];
    const roof = [[cx - 160, by - 205], [cx, by - 320], [cx + 160, by - 205]];
    const tower = [[cx - 30, by - 300], [cx - 30, by - 380], [cx + 30, by - 380], [cx + 30, by - 290]];
    shape(ctx, body, o, P.brick, 200, 3.2, false);
    if (!o.schem) L.hatch(ctx, body, { angle: 0, spacing: 16, width: 1, seed: 201, alpha: 0.4, color: P.roof });
    shape(ctx, tower, o, P.white, 205, 2.6, false);
    shape(ctx, roof, o, P.roof, 202, 3.2, false);
    if (!o.schem) L.crossHatch(ctx, roof, { spacing: 6, width: 1, seed: 203, tone: 0.5, alpha: 0.7 });
    // bell
    L.inkCircle(ctx, cx, by - 345, 13, { fill: o.schem ? P.navy : P.ochre, color: o.schem ? P.lavender : P.ink, width: 2, seed: 206 });
    // flag on the tower
    const wave = Math.sin(L.onTwos(t) * 7) * 8;
    line(ctx, [[cx, by - 380], [cx, by - 450]], o, 207, 2.4);
    const flag = [[cx, by - 450], [cx + 50, by - 442 + wave], [cx + 48, by - 418 + wave], [cx, by - 422]];
    shape(ctx, flag, o, P.aurumGold, 208, 2.2, false);
    // door and windows
    const door = L.rrectPts(cx - 28, by - 92, 56, 92, 22, 14);
    shape(ctx, door, o, P.roof, 209, 2.6);
    for (const s of [-1, 1]) {
      const win = L.rectPts(cx + s * 82 - 30, by - 175, 60, 52, 14);
      shape(ctx, win, o, P.paleBlue, 210 + s, 2.4);
      line(ctx, [[cx + s * 82, by - 175], [cx + s * 82, by - 123]], o, 213 + s, 1.6);
      line(ctx, [[cx + s * 82 - 30, by - 149], [cx + s * 82 + 30, by - 149]], o, 215 + s, 1.6);
    }
    const tri = L.ellipsePts(cx, by - 250, 28, 28, 28);
    shape(ctx, tri, o, P.white, 217, 2);
    line(ctx, [[cx, by - 250], [cx, by - 268]], o, 218, 1.6);
    line(ctx, [[cx, by - 250], [cx + 14, by - 250]], o, 219, 1.6);
  }

  // ---------------------------------------------------------------- planks and the bridge
  /** plank(ctx, i, o) : plank i of the deck. o.drop 0..1 lowers it in from above; o.ghost draws a dashed slot. */
  function plank(ctx, i, o = {}) {
    const x = G.plankX(i) + 3, w = G.plankW - 6, h = G.plankH;
    if (o.ghost) {
      ctx.save();
      ctx.setLineDash([10, 9]);
      ctx.strokeStyle = o.schem ? L.rgba(P.lavender, 0.55) : L.rgba(P.inkSoft, 0.55);
      ctx.lineWidth = 2;
      ctx.strokeRect(x, G.deckY, w, h);
      ctx.restore();
      return;
    }
    const drop = o.drop != null ? clamp(o.drop) : 1;
    if (drop <= 0) return;
    const yOff = -(1 - L.ease.outBack(drop)) * 260;
    const rot = (1 - drop) * (i % 2 ? 0.25 : -0.25);
    ctx.save();
    ctx.translate(x + w / 2, G.deckY + h / 2 + yOff);
    ctx.rotate(rot);
    const pts = L.rectPts(-w / 2, -h / 2, w, h, 10);
    if (o.schem) {
      L.inkPath(ctx, pts, { closed: true, fill: P.navyLight, color: o.line || P.lineWhite, width: 2.6, seed: 300 + i, wobble: 0.8 });
      for (let g = 1; g < 3; g++) L.inkLine(ctx, -w / 2 + 8, -h / 2 + g * 10, w / 2 - 8, -h / 2 + g * 10, { color: o.line || P.lavender, width: 1, alpha: 0.6, seed: 310 + i * 3 + g });
    } else {
      L.inkPath(ctx, pts, { closed: true, fill: P.plank, color: P.ink, width: 2.8, seed: 300 + i });
      for (let g = 0; g < 3; g++) L.inkPath(ctx, [[-w / 2 + 6, -h / 2 + 8 + g * 7], [0, -h / 2 + 6 + g * 8], [w / 2 - 6, -h / 2 + 9 + g * 7]], { color: P.plankDeep, width: 1.1, seed: 320 + i * 3 + g, alpha: 0.9 });
      L.inkCircle(ctx, -w / 2 + 12, 0, 3, { fill: P.inkSoft, width: 1, seed: 330 + i });
      L.inkCircle(ctx, w / 2 - 12, 0, 3, { fill: P.inkSoft, width: 1, seed: 340 + i });
    }
    ctx.restore();
  }

  /** bridge(ctx, n, o) : n planks laid (fractional n drops the last one), ropes when o.ropes > 0. */
  function bridge(ctx, n, o = {}) {
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(n)) plank(ctx, i, o);
      else if (i < n) plank(ctx, i, Object.assign({}, o, { drop: n - i }));
      else if (o.ghosts) plank(ctx, i, Object.assign({}, o, { ghost: true }));
    }
    const rp = o.ropes != null ? clamp(o.ropes) : 0;
    if (rp > 0) {
      for (const px of [G.leftEdge - 14, G.rightEdge + 14]) {
        line(ctx, [[px, G.deckY + 4], [px, G.deckY - 96]], o, 350 + px, 4.2, P.plankDeep);
      }
      for (const dy of [96, 50]) {
        const pts = [];
        for (let k = 0; k <= 24; k++) {
          const u = k / 24;
          pts.push([lerp(G.leftEdge - 14, G.rightEdge + 14, u), G.deckY - dy + Math.sin(u * Math.PI) * 26]);
        }
        L.inkPath(ctx, pts, { color: o.schem ? P.lavender : P.inkSoft, width: 2.6, seed: 360 + dy, draw: rp });
      }
      if (rp >= 1) {
        for (let i = 0; i <= 5; i++) {
          const x = G.plankX(i), sag = Math.sin((i / 5) * Math.PI) * 26;
          L.inkLine(ctx, x, G.deckY - 96 + sag, x, G.deckY, { color: o.schem ? P.lavender : P.inkSoft, width: 1.4, seed: 370 + i, alpha: 0.8 });
        }
      }
    }
  }

  // ---------------------------------------------------------------- characters
  function face(ctx, hx, hy, r, o, mood, seed, dir) {
    const ink = o.schem ? (o.line || P.lineWhite) : P.ink;
    const ex = hx + dir * r * 0.38, ey = hy - r * 0.05;
    const blink = o.blink ? 0.15 : 1;
    ctx.save();
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.ellipse(ex, ey, r * 0.075, r * 0.11 * blink, 0, 0, TAU);
    ctx.ellipse(ex - dir * r * 0.36, ey, r * 0.07, r * 0.1 * blink, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
    const brow = mood === 'worry' ? 0.12 : 0;
    L.inkPath(ctx, [[ex - r * 0.1, ey - r * 0.22 - brow * r * dir], [ex + r * 0.12, ey - r * 0.24 + brow * r * dir]], { color: ink, width: 2.2, seed: seed + 1 });
    const mx = hx + dir * r * 0.2, my = hy + r * 0.38;
    if (mood === 'worry') L.inkPath(ctx, [[mx - r * 0.18, my + 2], [mx, my - 3], [mx + r * 0.16, my + 2]], { color: ink, width: 2.4, seed: seed + 2 });
    else if (mood === 'calm') L.inkPath(ctx, [[mx - r * 0.14, my - 2], [mx, my + 2], [mx + r * 0.14, my - 2]], { color: ink, width: 2.4, seed: seed + 2 });
    else L.inkPath(ctx, [[mx - r * 0.22, my - 6], [mx - r * 0.05, my + r * 0.12], [mx + r * 0.2, my - 6]], { color: ink, width: 2.8, seed: seed + 2 });
    if (!o.schem && mood !== 'worry') {
      ctx.save();
      ctx.fillStyle = L.rgba(P.blush, 0.6);
      ctx.beginPath();
      ctx.ellipse(hx + dir * r * 0.5, hy + r * 0.28, r * 0.14, r * 0.08, 0, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  }

  /**
   * child(ctx, o) : the hero, facing right (o.dir -1 faces left). Feet on (o.x, o.y), 300 px at s = 1.
   *   pose 'stand' | 'walk' (o.phase, radians) | 'wave' | 'arms' (both arms up)
   *   mood 'smile' | 'worry' | 'calm';  headphones true;  schem true for the blueprint plate.
   */
  function child(ctx, o = {}) {
    const s = o.s || 1, x = o.x, y = o.y, dir = o.dir || 1;
    const sd = o.seed || 500;
    const SH = o.shirtColor || P.shirt;
    const pose = o.pose || 'stand';
    const ph = o.phase || 0;
    const bob = pose === 'walk' ? Math.abs(Math.sin(ph)) * 6 * s : 0;
    const hipY = y - 110 * s - bob, shY = y - 200 * s - bob;
    const headR = 52 * s, hx = x + dir * 6 * s, hy = shY - 62 * s;
    const legSw = pose === 'walk' ? Math.sin(ph) * 0.45 : 0;
    // legs
    [[-1, -legSw], [1, legSw]].forEach(([k, a], j) => {
      const lx = x + k * 14 * s;
      const fx = lx + Math.sin(a) * 110 * s, fy = y - (1 - Math.cos(a)) * 110 * s;
      const kx = lerp(lx, fx, 0.5) + dir * Math.max(0, a * k) * 20 * s, ky = lerp(hipY, fy, 0.5);
      line(ctx, [[lx, hipY], [kx, ky], [fx, fy]], o, sd + 10 + j, 22 * s, P.pants);
      if (!o.schem) L.inkPath(ctx, [[lx, hipY], [kx, ky], [fx, fy]], { color: P.pants, width: 17 * s, seed: sd + 12 + j, wobble: 0.5 });
      const shoe = L.ellipsePts(fx + dir * 12 * s, fy - 6 * s, 24 * s, 11 * s, 18);
      shape(ctx, shoe, o, P.inkSoft, sd + 14 + j, 2.2);
    });
    // backpack
    const bp = L.rrectPts(x - dir * 62 * s - (dir > 0 ? 0 : -0) - 28 * s, shY + 8 * s, 56 * s, 92 * s, 16 * s, 12);
    shape(ctx, bp, o, P.backpack, sd + 20, 2.8);
    if (!o.schem) L.hatch(ctx, bp, { angle: 0.8, spacing: 6, width: 1, seed: sd + 21, alpha: 0.5 });
    // torso
    const torso = L.rrectPts(x - 38 * s, shY, 76 * s, (hipY - shY) + 14 * s, 26 * s, 12);
    shape(ctx, torso, o, SH, sd + 22, 3);
    if (!o.schem) L.hatch(ctx, torso, { angle: -0.9, spacing: 6, width: 1, color: P.shirtDeep, seed: sd + 23, alpha: 0.8, density: (px) => clamp(((px - x) * -dir) / (40 * s) + 0.2) });
    line(ctx, [[x - dir * 30 * s, shY + 8 * s], [x - dir * 26 * s, shY + 70 * s]], o, sd + 24, 4 * s, P.inkSoft);
    // arms
    const armSw = pose === 'walk' ? -Math.sin(ph) * 0.5 : 0;
    const arms = [];
    if (pose === 'wave') arms.push([dir, -2.5 + Math.sin((o.t || 0) * 10) * 0.35], [-dir, 0.15]);
    else if (pose === 'arms') arms.push([1, -2.4], [-1, -2.4]);
    else arms.push([dir, 0.2 + armSw], [-dir, 0.15 - armSw]);
    arms.forEach(([k, a], j) => {
      const sx = x + k * 34 * s, sy = shY + 18 * s;
      const ang = Math.PI / 2 - k * a * (pose === 'wave' || pose === 'arms' ? -1 : 1) * 0.6;
      let ex, ey, hx2, hy2;
      if (pose === 'wave' && j === 0 || pose === 'arms') {
        ex = sx + k * 36 * s; ey = sy - 40 * s;
        hx2 = ex + k * 10 * s + Math.sin((o.t || 0) * 10) * 10 * s * (pose === 'wave' ? 1 : 0); hy2 = ey - 56 * s;
      } else {
        ex = sx + Math.cos(ang) * 0 + k * 6 * s + Math.sin(a) * 30 * s; ey = sy + 52 * s;
        hx2 = ex + Math.sin(a) * 34 * s; hy2 = ey + 46 * s;
      }
      line(ctx, [[sx, sy], [ex, ey], [hx2, hy2]], o, sd + 30 + j, 16 * s, SH);
      if (!o.schem) L.inkPath(ctx, [[sx, sy], [ex, ey], [hx2, hy2]], { color: SH, width: 11 * s, seed: sd + 32 + j, wobble: 0.5 });
      L.inkCircle(ctx, hx2, hy2, 10 * s, { fill: o.schem ? P.navy : P.skin, color: o.schem ? (o.line || P.lavender) : P.ink, width: 2, seed: sd + 34 + j });
    });
    // head
    L.inkCircle(ctx, hx - dir * headR * 0.9, hy + 4 * s, headR * 0.2, { fill: o.schem ? P.navy : P.skin, color: o.schem ? (o.line || P.lavender) : P.ink, width: 2, seed: sd + 39 });
    const head = L.ellipsePts(hx, hy, headR, headR * 1.02, 40);
    shape(ctx, head, o, P.skin, sd + 40, 3);
    // hair: a cap over the top and the back
    const hair = [];
    for (let i = 0; i <= 20; i++) {
      const a = Math.PI + ((dir > 0 ? i : 20 - i) / 20) * Math.PI;
      hair.push([hx + Math.cos(a) * headR * 1.06, hy + Math.sin(a) * headR * 1.08 - 2 * s]);
    }
    hair.push([hx + dir * headR * 0.9, hy - headR * 0.25]);
    for (let i = 0; i < 4; i++) hair.push([hx + dir * headR * (0.6 - i * 0.35), hy - headR * (0.42 + (i % 2) * 0.12)]);
    hair.push([hx - dir * headR * 1.02, hy + headR * 0.25]);
    shape(ctx, hair, o, P.hair, sd + 41, 2.6);
    face(ctx, hx, hy, headR, o, o.mood || 'smile', sd + 50, dir);
    if (o.headphones) {
      const band = [];
      for (let i = 0; i <= 16; i++) {
        const a = Math.PI * 1.05 + (i / 16) * Math.PI * 0.9;
        band.push([hx + Math.cos(a) * headR * 1.18, hy + Math.sin(a) * headR * 1.2]);
      }
      line(ctx, band, o, sd + 60, 9 * s, P.aurumBrown);
      const cup = L.rrectPts(hx - dir * headR * 0.72 - 17 * s, hy - 22 * s, 34 * s, 50 * s, 14 * s, 10);
      shape(ctx, cup, o, P.aurumGold, sd + 61, 2.8);
    }
    return { head: [hx, hy], headR, hand: [x + dir * 40 * s, shY + 110 * s], top: hy - headR };
  }

  /**
   * adult(ctx, o) : parent or teacher, facing o.dir (default -1, looking left across the gap).
   *   top colour o.top, o.hair 'short' | 'long' | 'bun', o.carry true holds a plank at chest height.
   */
  function adult(ctx, o = {}) {
    const s = o.s || 1, x = o.x, y = o.y, dir = o.dir || -1;
    const sd = o.seed || 600;
    const hipY = y - 160 * s, shY = y - 290 * s;
    const headR = 46 * s, hx = x + dir * 4 * s, hy = shY - 58 * s;
    for (const k of [-1, 1]) {
      const lx = x + k * 18 * s;
      line(ctx, [[lx, hipY], [lx + k * 4 * s, y - 80 * s], [lx + k * 2 * s, y]], o, sd + 10 + k, 26 * s, P.pants);
      if (!o.schem) L.inkPath(ctx, [[lx, hipY], [lx + k * 4 * s, y - 80 * s], [lx + k * 2 * s, y]], { color: P.pants, width: 20 * s, seed: sd + 12 + k, wobble: 0.5 });
      shape(ctx, L.ellipsePts(lx + dir * 12 * s, y - 6 * s, 26 * s, 10 * s, 18), o, P.inkSoft, sd + 14 + k, 2.2);
    }
    const torso = o.skirt
      ? [[x - 44 * s, shY + 6 * s], [x + 44 * s, shY + 6 * s], [x + 66 * s, hipY + 50 * s], [x - 66 * s, hipY + 50 * s]]
      : L.rrectPts(x - 46 * s, shY, 92 * s, hipY - shY + 16 * s, 28 * s, 12);
    shape(ctx, torso, o, o.top || P.parentTop, sd + 20, 3);
    if (!o.schem) L.hatch(ctx, torso, { angle: -0.9, spacing: 6, width: 1, seed: sd + 21, alpha: 0.45 });
    const carry = o.carry ? clamp(o.carry) : 0;
    for (const k of [-1, 1]) {
      const sx = x + k * 42 * s, sy = shY + 20 * s;
      const hx2 = carry ? x + dir * 70 * s + k * 26 * s : sx + k * 8 * s;
      const hy2 = carry ? shY + 70 * s : sy + 130 * s;
      const ex = lerp(sx, hx2, 0.5) + k * 10 * s, ey = lerp(sy, hy2, 0.5) + 16 * s;
      line(ctx, [[sx, sy], [ex, ey], [hx2, hy2]], o, sd + 30 + k, 18 * s, o.top || P.parentTop);
      if (!o.schem) L.inkPath(ctx, [[sx, sy], [ex, ey], [hx2, hy2]], { color: o.top || P.parentTop, width: 13 * s, seed: sd + 32 + k, wobble: 0.5 });
      L.inkCircle(ctx, hx2, hy2, 10 * s, { fill: o.schem ? P.navy : P.skin, color: o.schem ? (o.line || P.lavender) : P.ink, width: 2, seed: sd + 34 + k });
    }
    if (o.long) {
      const back = [[hx - dir * headR * 1.0, hy - headR * 0.4], [hx - dir * headR * 1.2, hy + headR * 1.4], [hx - dir * headR * 0.2, hy + headR * 1.2]];
      shape(ctx, back, o, P.hair, sd + 38, 2.4);
    }
    shape(ctx, L.ellipsePts(hx, hy, headR, headR * 1.08, 40), o, P.skin, sd + 40, 3);
    const hair = [];
    for (let i = 0; i <= 20; i++) {
      const a = Math.PI + ((dir > 0 ? i : 20 - i) / 20) * Math.PI;
      hair.push([hx + Math.cos(a) * headR * 1.05, hy + Math.sin(a) * headR * 1.1 - 2 * s]);
    }
    hair.push([hx + dir * headR * 0.8, hy - headR * 0.35], [hx - dir * headR * 0.2, hy - headR * 0.55], [hx - dir * headR * 1.02, hy + headR * 0.2]);
    shape(ctx, hair, o, o.hairColor || P.hair, sd + 41, 2.6);
    if (o.bun) shape(ctx, L.ellipsePts(hx - dir * headR * 0.7, hy - headR * 0.95, headR * 0.35, headR * 0.3, 20), o, o.hairColor || P.hair, sd + 42, 2.4);
    if (o.glasses) {
      const gx = hx + dir * headR * 0.35;
      L.inkCircle(ctx, gx, hy - 2 * s, 11 * s, { color: o.schem ? P.lineWhite : P.ink, width: 2, seed: sd + 43 });
    }
    face(ctx, hx, hy, headR, o, o.mood || 'smile', sd + 50, dir);
    return { head: [hx, hy], hand: [x + dir * 70 * s, shY + 70 * s], top: hy - headR };
  }

  /** friend(ctx, o) : the classmate, a little shorter than the hero, facing left, waving. */
  function friend(ctx, o = {}) {
    return child(ctx, Object.assign({ dir: -1, seed: 700, shirtColor: P.friendTop }, o, { s: (o.s || 1) * 0.95 }));
  }


  /** tree(ctx, t, x, y, s, seed) : the round tree behind the child on the near bank. */
  function tree(ctx, t, x, y, s, seed, o = {}) {
    const trunk = [[x - 14 * s, y], [x - 10 * s, y - 150 * s], [x + 10 * s, y - 150 * s], [x + 16 * s, y]];
    shape(ctx, trunk, o, P.wood, seed, 2.6);
    if (!o.schem) L.hatch(ctx, trunk, { angle: 1.4, spacing: 5, width: 1, seed: seed + 1, alpha: 0.7 });
    const sway = Math.sin(L.onTwos(t) * 2.4) * 4 * s;
    const blobs = [[0, -210, 88], [-62, -170, 62], [62, -165, 64], [0, -275, 60]];
    blobs.forEach(([dx, dy, r], k) => {
      const pts = [];
      for (let i = 0; i <= 36; i++) {
        const a = (i / 36) * TAU;
        const rr = r * s * (1 + 0.08 * Math.sin(a * 7 + k * 2));
        pts.push([x + dx * s + sway + Math.cos(a) * rr, y + dy * s + Math.sin(a) * rr * 0.9]);
      }
      shape(ctx, pts, o, P.leaf, seed + 10 + k, 2.6);
      if (!o.schem) L.hatch(ctx, pts, { angle: -0.8, spacing: 6, width: 1, seed: seed + 20 + k, alpha: 0.6, density: (px, py) => clamp((py - (y + dy * s)) / (r * s) + 0.3) });
    });
  }

  /** tag(ctx, str, x, y, p, o) : a small label on a pill (paper: cream + ink; schem: navy + white). */
  function tag(ctx, str, x, y, p, o = {}) {
    if (p <= 0) return;
    const size = o.size || 56;
    ctx.save();
    ctx.font = `700 ${size}px "SF Pro Rounded", ui-rounded, "Helvetica Neue", system-ui, Arial, sans-serif`;
    const w = ctx.measureText(str).width;
    ctx.restore();
    ctx.save();
    ctx.globalAlpha *= clamp(p * 1.5);
    const box = L.rrectPts(x - w / 2 - 22, y - size * 0.78, w + 44, size * 1.56, 20, 16);
    if (o.schem) L.inkPath(ctx, box, { closed: true, fill: P.navyDeep, color: P.schemGold, width: 2.6, seed: o.seed || 870, wobble: 0.8 });
    else L.inkPath(ctx, box, { closed: true, fill: P.cardPaper, color: P.aurumGold, width: 3, seed: o.seed || 870 });
    L.text(ctx, str, x, y + 2, { size, weight: 700, color: o.schem ? P.lineWhite : P.aurumBrown, align: 'center', baseline: 'middle', p: L.ease.outCubic(clamp(p * 1.4)) });
    ctx.restore();
  }

  FILM.cast = { G, card, tree, tag, sky, cliffs, river, school, plank, bridge, child, adult, friend };
})();
