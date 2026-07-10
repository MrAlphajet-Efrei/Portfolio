/* Le Circuit — continuous-dive circuit-neural engine (canvas 2d)
   2.5D top-down dive through copper strata; current flows, components glow,
   the visitor deflects traces, triggers surges, and powers the core chipset.

   Porté depuis le projet Claude Design « Site premium prompt » (circuit-engine.js) :
   code conservé verbatim, seul le wrapper IIFE/global a été converti en module ES. */

var TAU = Math.PI * 2;
var MAXD = 3.85;                       // deepest camera depth (core)
var ZS = [0.30, 1.15, 2.05, 2.95, 3.85]; // layer depths
var ZOOM = 2.3;                        // zoom base per depth unit

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }

// copper palette
var C_TRACE = [196, 128, 66];    // dim copper
var C_HOT = [255, 190, 120];     // powered copper
var C_SIG = [255, 232, 198];     // current
var C_SILK = [232, 222, 205];    // silkscreen text
var DIRS = [];
for (var di = 0; di < 8; di++) DIRS.push([Math.cos(di * TAU / 8), Math.sin(di * TAU / 8)]);

function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

function CircuitEngine(canvas, opts) {
  this.cv = canvas;
  this.ctx = canvas.getContext('2d');
  this.o = Object.assign({
    density: 1,
    reduced: false,
    labels: {},          // {eu:'…', llm:'…'}
    inspect: '[ inspect ]',
    coreName: 'Y.YANAT',
    coreSub: 'AI-CORE',
    onMajorClick: null,
    onCharge: null,      // (pct 0..100)
    onOnline: null,
    onDepth: null        // (d, activeLayerIndex)
  }, opts || {});
  this.layers = [];
  this.motes = [];
  this.pointer = { x: -9e3, y: -9e3, on: false, down: false };
  this.drag = null; this.down = null; this.holdTimer = null;
  this.surge = null;
  this.charge = 0; this.online = false; this.charging = false; this.flashT = 0;
  this.hoverMajor = null;
  this.paused = false;
  this.depth = 0; this.depthT = 0;
  this.t = 0;
  this.vw = 1; this.vh = 1; this.mn = 1; this.dpr = 1;
  this._dead = false;
  this._sprites = {};
  this.resize(true);
  this._bind();
  this._raf = requestAnimationFrame(this._loop.bind(this));
}

// ============ build world ============
CircuitEngine.prototype._build = function () {
  var D = clamp(this.o.density, 0.4, 2);
  var vw = this.vw, vh = this.vh, mn = this.mn;
  var cx = vw / 2, cy = vh / 2;
  this.layers = [];

  var GENERIC = ['R47', 'C220', 'U09', 'X1', 'Q5', 'L33', 'U12', 'C88', 'R100', 'D4', 'U27', 'X8'];
  var specs = [
    { z: ZS[0], pw: 0.22, seed: 11, traces: Math.round(46 * D), comps: 8,  busW: 0, labels: [] },
    { z: ZS[1], pw: 0.38, seed: 23, traces: Math.round(34 * D), comps: 9,
      labels: ['EFREI', 'ALLIANZ', 'UHDP', 'SOC-GEN', 'BNP-AM'], busW: 0 },
    { z: ZS[2], pw: 0.66, seed: 37, traces: Math.round(30 * D), comps: 7,
      labels: ['JAVA', 'CI-CD', 'PY-3'], busW: 3,
      major: { key: 'eu', ref: 'U-204', x: cx - vw * 0.235, y: cy - vh * 0.02, w: mn * 0.17, h: mn * 0.125 } },
    { z: ZS[3], pw: 0.92, seed: 53, traces: Math.round(30 * D), comps: 7,
      labels: ['AZURE', 'K8S', 'LCHAIN', 'TSX'], busW: 4,
      major: { key: 'llm', ref: 'U-401', x: cx + vw * 0.235, y: cy - vh * 0.01, w: mn * 0.19, h: mn * 0.14 } },
    { z: ZS[4], pw: 1.0, seed: 71, traces: 0, comps: 0, busW: 0, core: true }
  ];

  for (var li = 0; li < specs.length; li++) {
    var sp = specs[li];
    var rand = mulberry32(sp.seed);
    var L = { z: sp.z, pw: sp.pw, traces: [], comps: [], vias: [], core: !!sp.core, major: null, exc: 0 };

    if (sp.core) {
      // ---- the chipset ----
      var side = mn * 0.36;
      L.chip = { x: cx, y: cy, side: side };
      var pinsPer = 8;
      for (var s4 = 0; s4 < 4; s4++) {
        for (var pi = 0; pi < pinsPer; pi++) {
          var f = (pi + 1) / (pinsPer + 1) - 0.5;
          var px, py, dx, dy;
          if (s4 === 0) { px = cx + f * side; py = cy - side / 2; dx = 0; dy = -1; }
          else if (s4 === 1) { px = cx + side / 2; py = cy + f * side; dx = 1; dy = 0; }
          else if (s4 === 2) { px = cx + f * side; py = cy + side / 2; dx = 0; dy = 1; }
          else { px = cx - side / 2; py = cy + f * side; dx = -1; dy = 0; }
          // converging trace from screen edge to the pin
          var pts = [];
          var reach = mn * (0.55 + rand() * 0.5);
          var ex = px + dx * reach + (rand() - 0.5) * mn * 0.3 * Math.abs(dy);
          var ey = py + dy * reach + (rand() - 0.5) * mn * 0.3 * Math.abs(dx);
          pts.push({ x: ex, y: ey });
          var mx = px + dx * reach * (0.35 + rand() * 0.3);
          var my = py + dy * reach * (0.35 + rand() * 0.3);
          if (dx === 0) { mx = ex + (px - ex) * 0.4; my = py + dy * reach * 0.45; pts.push({ x: mx, y: my }); pts.push({ x: px, y: my - dy * 0 }); }
          else { my = ey + (py - ey) * 0.4; mx = px + dx * reach * 0.45; pts.push({ x: mx, y: my }); pts.push({ x: mx, y: py }); }
          pts.push({ x: px + dx * side * 0.06, y: py + dy * side * 0.06 });
          L.traces.push(this._mkTrace(pts, 1.6 + rand() * 1.4, rand));
        }
      }
    } else {
      // ---- regular stratum: random-walk copper traces ----
      var cell = mn * 0.052;
      for (var ti = 0; ti < sp.traces; ti++) {
        var isBus = sp.busW > 0 && ti < 5;
        var a0 = rand() * TAU;
        var rad = mn * (0.35 + rand() * 0.55);
        var sx = cx + Math.cos(a0) * rad * 1.15;
        var sy = cy + Math.sin(a0) * rad * 0.8;
        var dir = Math.floor(rand() * 8);
        var pts2 = [{ x: sx, y: sy }];
        var nseg = 3 + Math.floor(rand() * 5);
        for (var sg = 0; sg < nseg; sg++) {
          var len = (1 + Math.floor(rand() * 3)) * cell * (isBus ? 1.7 : 1);
          var d2 = DIRS[dir];
          var last = pts2[pts2.length - 1];
          pts2.push({ x: last.x + d2[0] * len, y: last.y + d2[1] * len });
          dir = (dir + (rand() < 0.7 ? (rand() < 0.5 ? 1 : 7) : (rand() < 0.5 ? 2 : 6))) % 8;
        }
        var tr = this._mkTrace(pts2, isBus ? sp.busW : 0.8 + rand() * 1.6, rand);
        tr.endCap = rand() < 0.35 ? 'via' : (rand() < 0.5 ? 'pad' : null);
        L.traces.push(tr);
      }
      // ---- components ----
      var nlab = sp.labels.length;
      for (var ci = 0; ci < sp.comps + nlab; ci++) {
        var named = ci < nlab;
        var w = mn * (named ? 0.085 + rand() * 0.03 : 0.03 + rand() * 0.035);
        var h = w * (0.55 + rand() * 0.5);
        var aa = rand() * TAU;
        var rr = mn * (named ? 0.16 + rand() * 0.28 : 0.3 + rand() * 0.42);
        var comp = {
          x: cx + Math.cos(aa) * rr * 1.25,
          y: cy + Math.sin(aa) * rr * 0.85,
          w: w, h: h,
          label: named ? sp.labels[ci] : GENERIC[Math.floor(rand() * GENERIC.length)],
          named: named, exc: 0, major: null
        };
        L.comps.push(comp);
        this._stub(L, comp, rand);
      }
      if (sp.major) {
        var M = { x: sp.major.x, y: sp.major.y, w: sp.major.w, h: sp.major.h, ref: sp.major.ref, label: '', named: true, exc: 0, major: sp.major.key };
        L.comps.push(M);
        L.major = M;
        this._stub(L, M, rand, true);
      }
    }
    this.layers.push(L);
  }

  // ambient motes (screen space)
  this.motes = [];
  var rnd = mulberry32(5);
  for (var mi = 0; mi < Math.round(46 * D); mi++) {
    this.motes.push({ x: rnd(), y: rnd(), r: 0.5 + rnd() * 1.2, ph: rnd() * TAU, sp: 0.3 + rnd() * 0.7 });
  }
};

CircuitEngine.prototype._stub = function (L, comp, rand, major) {
  // short traces leaving the component (pins with wire stubs)
  var n = major ? 6 : 2 + Math.floor(rand() * 2);
  for (var i = 0; i < n; i++) {
    var side = Math.floor(rand() * 4);
    var f = rand() - 0.5;
    var px, py, dx, dy;
    if (side === 0) { px = comp.x + f * comp.w; py = comp.y - comp.h / 2; dx = 0; dy = -1; }
    else if (side === 1) { px = comp.x + comp.w / 2; py = comp.y + f * comp.h; dx = 1; dy = 0; }
    else if (side === 2) { px = comp.x + f * comp.w; py = comp.y + comp.h / 2; dx = 0; dy = 1; }
    else { px = comp.x - comp.w / 2; py = comp.y + f * comp.h; dx = -1; dy = 0; }
    var l1 = this.mn * (0.03 + rand() * 0.06) * (major ? 1.8 : 1);
    var pts = [{ x: px, y: py }, { x: px + dx * l1, y: py + dy * l1 }];
    if (rand() < 0.6) {
      var turn = rand() < 0.5 ? 1 : -1;
      var l2 = this.mn * (0.03 + rand() * 0.07) * (major ? 1.6 : 1);
      pts.push({ x: pts[1].x + (dx === 0 ? turn * l2 : dx * l2 * 0.7), y: pts[1].y + (dy === 0 ? turn * l2 : dy * l2 * 0.7) });
    }
    var tr = this._mkTrace(pts, major ? 1.8 : 1, rand);
    tr.endCap = 'via';
    tr.comp = comp;
    L.traces.push(tr);
  }
};

CircuitEngine.prototype._mkTrace = function (pts, w, rand) {
  var vs = [];
  for (var i = 0; i < pts.length; i++) {
    vs.push({ x: pts[i].x, y: pts[i].y, offx: 0, offy: 0, vx: 0, vy: 0 });
  }
  var segLens = [], len = 0;
  for (var j = 1; j < vs.length; j++) {
    var dx = vs[j].x - vs[j - 1].x, dy = vs[j].y - vs[j - 1].y;
    var l = Math.sqrt(dx * dx + dy * dy);
    segLens.push(l); len += l;
  }
  var sigs = [];
  var n = Math.max(1, Math.round(len / (this.mn * 0.55)));
  for (var k = 0; k < n; k++) sigs.push({ t: rand ? rand() : Math.random(), sp: 0.0016 + (rand ? rand() : Math.random()) * 0.0022 });
  return { v: vs, w: w, len: len, segLens: segLens, sigs: sigs, exc: 0, comp: null, endCap: null };
};

function polyPoint(tr, t, out) {
  var target = t * tr.len, acc = 0;
  for (var i = 0; i < tr.segLens.length; i++) {
    if (acc + tr.segLens[i] >= target || i === tr.segLens.length - 1) {
      var f = tr.segLens[i] > 0 ? (target - acc) / tr.segLens[i] : 0;
      var a = tr.v[i], b = tr.v[i + 1];
      out.x = a.x + a.offx + (b.x + b.offx - a.x - a.offx) * f;
      out.y = a.y + a.offy + (b.y + b.offy - a.y - a.offy) * f;
      return;
    }
    acc += tr.segLens[i];
  }
}
var _pp = { x: 0, y: 0 };

// ============ events ============
CircuitEngine.prototype._bind = function () {
  var self = this;
  this._onMove = function (e) {
    self.pointer.x = e.clientX; self.pointer.y = e.clientY; self.pointer.on = true;
    if (self.down && !self.drag) {
      var dx = e.clientX - self.down.x, dy = e.clientY - self.down.y;
      if (dx * dx + dy * dy > 120) { self.down.moved = true; self._clearHold(); }
    }
  };
  this._onDown = function (e) {
    if (e.button !== undefined && e.button !== 0) return;
    self.pointer.x = e.clientX; self.pointer.y = e.clientY; self.pointer.on = true; self.pointer.down = true;
    var mj = self._majorAt(e.clientX, e.clientY) || self.hoverMajor;
    self.down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false, major: mj };
    if (self.depth > 3.3 && !self.online) { self.charging = true; return; }
    if (!mj) {
      var hit = self._vertexAt(e.clientX, e.clientY);
      if (hit) { self.drag = hit; return; }
      self._clearHold();
      self.holdTimer = setTimeout(function () {
        if (self.down && !self.down.moved && !self.paused) { self.down.held = true; self._surge(self.down.x, self.down.y); }
      }, 430);
    }
  };
  this._onUp = function (e) {
    self._clearHold();
    self.pointer.down = false;
    self.charging = false;
    if (self.drag) {
      var d = self.drag.vert;
      d.vx += d.offx * -0.1; d.vy += d.offy * -0.1;
      self.drag = null;
    }
    if (self.down && !self.down.moved && !self.down.held) {
      if (self.down.major && self.o.onMajorClick) self.o.onMajorClick(self.down.major);
      else if (self.depth <= 3.3 && performance.now() - self.down.t < 450) self._tapPulse(e.clientX, e.clientY);
    }
    self.down = null;
  };
  this._onLeave = function () { self.pointer.x = -9e3; self.pointer.y = -9e3; self.pointer.on = false; self.charging = false; };
  this._onResize = function () {
    clearTimeout(self._rzT);
    self._rzT = setTimeout(function () { self.resize(true); }, 250);
    self.resize(false);
  };
  this.cv.addEventListener('pointerdown', this._onDown);
  window.addEventListener('pointermove', this._onMove, { passive: true });
  window.addEventListener('pointerup', this._onUp);
  window.addEventListener('pointercancel', this._onUp);
  document.addEventListener('mouseleave', this._onLeave);
  window.addEventListener('resize', this._onResize);
};
CircuitEngine.prototype._clearHold = function () {
  if (this.holdTimer) { clearTimeout(this.holdTimer); this.holdTimer = null; }
};

// layer-space transform helpers
CircuitEngine.prototype._layerXf = function (L) {
  var s = Math.pow(ZOOM, this.depth - L.z);
  var par = 14 * (L.z - this.depth);
  var ox = this.pointer.on ? (this.pointer.x - this.vw / 2) / this.vw * par : 0;
  var oy = this.pointer.on ? (this.pointer.y - this.vh / 2) / this.vh * par : 0;
  return { s: s, ox: ox, oy: oy };
};
CircuitEngine.prototype._toLayer = function (L, px, py, xf) {
  var f = xf || this._layerXf(L);
  return { x: (px - this.vw / 2 - f.ox) / f.s + this.vw / 2, y: (py - this.vh / 2 - f.oy) / f.s + this.vh / 2 };
};
CircuitEngine.prototype._activeLayer = function () {
  var best = null, bd = 1e9;
  for (var i = 0; i < this.layers.length; i++) {
    var s = Math.pow(ZOOM, this.depth - this.layers[i].z);
    var d = Math.abs(Math.log(s));
    if (s > 0.45 && s < 2.1 && d < bd) { bd = d; best = this.layers[i]; }
  }
  return best;
};

CircuitEngine.prototype._vertexAt = function (px, py) {
  var L = this._activeLayer();
  if (!L || L.core) return null;
  var xf = this._layerXf(L);
  var lp = this._toLayer(L, px, py, xf);
  var rad = 30 / xf.s, best = null, bd = rad * rad;
  for (var t = 0; t < L.traces.length; t++) {
    var tr = L.traces[t];
    for (var v = 0; v < tr.v.length; v++) {
      var vv = tr.v[v];
      var dx = vv.x + vv.offx - lp.x, dy = vv.y + vv.offy - lp.y;
      var d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = { vert: vv, trace: tr, layer: L }; }
    }
  }
  return best;
};

// screen-space hit test for the two inspectable majors — usable at tap time
// (touch has no hover) and over the full zoom range where the label is visible
CircuitEngine.prototype._majorAt = function (px, py) {
  for (var li = 0; li < this.layers.length; li++) {
    var L = this.layers[li];
    if (!L.major) continue;
    var xf = this._layerXf(L);
    var s = xf.s;
    var la = smooth((s - 0.24) / 0.45) * (1 - smooth((s - 1.35) / 1.3));
    if (s < 0.5 || s > 2.4 || la < 0.2) continue;
    var comp = L.major;
    var sxc = (comp.x - this.vw / 2) * s + this.vw / 2 + xf.ox;
    var syc = (comp.y - this.vh / 2) * s + this.vh / 2 + xf.oy;
    var hw = comp.w * s / 2 + 26, hh = comp.h * s / 2 + 26;
    // include the "[ inspect ]" caption zone under the chip
    if (Math.abs(px - sxc) < hw && py > syc - hh && py < syc + hh + 34 * Math.min(1.6, s)) return comp.major;
  }
  return null;
};

CircuitEngine.prototype._surge = function (px, py) {
  var L = this._activeLayer();
  if (!L) return;
  var lp = this._toLayer(L, px, py);
  this.surge = { x: lp.x, y: lp.y, t0: this.t, layer: L };
};
CircuitEngine.prototype._tapPulse = function (px, py) {
  var L = this._activeLayer();
  if (!L) return;
  var xf = this._layerXf(L);
  var lp = this._toLayer(L, px, py, xf);
  var rad = 130 / xf.s;
  for (var t = 0; t < L.traces.length; t++) {
    var tr = L.traces[t];
    for (var v = 0; v < tr.v.length; v++) {
      var dx = tr.v[v].x - lp.x, dy = tr.v[v].y - lp.y;
      if (dx * dx + dy * dy < rad * rad) { tr.exc = Math.max(tr.exc, 1); break; }
    }
  }
};

// ============ public API ============
CircuitEngine.prototype.setLabels = function (l) { this.o.labels = l || {}; };
CircuitEngine.prototype.setInspect = function (s) { this.o.inspect = s; };
CircuitEngine.prototype.setDensity = function (d) { this.o.density = d; this._build(); };
// "YY" monogram drawn in the board's own vocabulary:
// two Y-traces with 45-degree PCB bends, via rings at the arm tips,
// a junction via and a square pad at the stem. Back Y = dim copper echo,
// front Y = silkscreen that heats up with the charge.
CircuitEngine.prototype._drawLogo = function (ctx, x, y, s, q, a, breath) {
  var u = s / 10;
  var strokeY = function (ox, oy, w) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x + ox, y + oy + 4.4 * u);
    ctx.lineTo(x + ox, y + oy + 0.4 * u);
    ctx.lineTo(x + ox - 2.3 * u, y + oy - 1.9 * u);
    ctx.lineTo(x + ox - 2.3 * u, y + oy - 4.1 * u);
    ctx.moveTo(x + ox, y + oy + 0.4 * u);
    ctx.lineTo(x + ox + 2.3 * u, y + oy - 1.9 * u);
    ctx.lineTo(x + ox + 2.3 * u, y + oy - 4.1 * u);
    ctx.stroke();
  };
  var lw = Math.max(1.8, u * 0.95);
  // back Y — dim copper echo, offset like a bus line
  ctx.globalAlpha = (0.28 + 0.35 * q) * a;
  ctx.strokeStyle = rgba(C_TRACE, 1);
  strokeY(1.7 * u, 0.5 * u, lw);
  // front Y — wide hot halo, hot under-glow, then silkscreen body
  ctx.globalAlpha = (0.10 + 0.30 * q + breath * 0.10) * a;
  ctx.strokeStyle = rgba(C_HOT, 1);
  strokeY(-0.9 * u, 0, lw * 4.2);
  ctx.globalAlpha = (0.26 + 0.60 * q + breath * 0.14) * a;
  ctx.strokeStyle = rgba(C_HOT, 1);
  strokeY(-0.9 * u, 0, lw * 2.1);
  ctx.globalAlpha = (0.60 + 0.40 * q) * a;
  ctx.strokeStyle = rgba(C_SILK, 1);
  strokeY(-0.9 * u, 0, lw);
  // via rings at the front Y's arm tips + junction
  var vr = Math.max(1.6, u * 0.78);
  var pts = [[-0.9 - 2.3, -4.1], [-0.9 + 2.3, -4.1], [-0.9, 0.4]];
  for (var vi = 0; vi < pts.length; vi++) {
    var px2 = x + pts[vi][0] * u, py2 = y + pts[vi][1] * u;
    // glow dot behind the via
    ctx.globalAlpha = (0.18 + 0.35 * q + breath * 0.10) * a;
    ctx.fillStyle = rgba(C_HOT, 1);
    ctx.beginPath(); ctx.arc(px2, py2, vr * 2.4, 0, TAU); ctx.fill();
    ctx.globalAlpha = (0.90 + breath * 0.10) * (0.55 + 0.45 * q) * a;
    ctx.fillStyle = '#14100A';
    ctx.beginPath(); ctx.arc(px2, py2, vr, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(vi === 2 ? C_HOT : C_SILK, 1);
    ctx.lineWidth = Math.max(1.1, lw * 0.6);
    ctx.beginPath(); ctx.arc(px2, py2, vr, 0, TAU); ctx.stroke();
  }
  // square pad at the stem foot
  var pr2 = vr * 1.15;
  ctx.globalAlpha = (0.50 + 0.50 * q) * a;
  ctx.fillStyle = rgba(C_TRACE, 1);
  ctx.fillRect(x - 0.9 * u - pr2, y + 4.4 * u - pr2, pr2 * 2, pr2 * 2);
  ctx.globalAlpha = (0.70 + 0.30 * q) * a;
  ctx.strokeStyle = rgba(C_SILK, 1);
  ctx.lineWidth = Math.max(1.1, lw * 0.6);
  ctx.strokeRect(x - 0.9 * u - pr2, y + 4.4 * u - pr2, pr2 * 2, pr2 * 2);
};

CircuitEngine.prototype.setPaused = function (b) { this.paused = !!b; };
CircuitEngine.prototype.setReduced = function (b) { this.o.reduced = !!b; };
CircuitEngine.prototype.powerCoreAnim = function () {
  // accessible fallback: ramp the charge automatically
  if (this.online) return;
  this._autoCharge = true;
};
CircuitEngine.prototype.resize = function (rebuild) {
  this.vw = window.innerWidth; this.vh = window.innerHeight;
  this.mn = Math.min(this.vw, this.vh);
  this.dpr = clamp(window.devicePixelRatio || 1, 1, this.vw < 768 ? 1.25 : 1.75);
  this.cv.width = Math.round(this.vw * this.dpr);
  this.cv.height = Math.round(this.vh * this.dpr);
  this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  if (rebuild) this._build();
};
CircuitEngine.prototype.destroy = function () {
  this._dead = true;
  cancelAnimationFrame(this._raf);
  this._clearHold();
  clearTimeout(this._rzT);
  this.cv.removeEventListener('pointerdown', this._onDown);
  window.removeEventListener('pointermove', this._onMove);
  window.removeEventListener('pointerup', this._onUp);
  window.removeEventListener('pointercancel', this._onUp);
  document.removeEventListener('mouseleave', this._onLeave);
  window.removeEventListener('resize', this._onResize);
};

// ============ frame ============
CircuitEngine.prototype._loop = function () {
  if (this._dead) return;
  this._raf = requestAnimationFrame(this._loop.bind(this));
  var red = this.o.reduced;
  if (!this.paused && !red) this.t += 1 / 60;

  // depth from scroll
  var spacer = document.getElementById('lc-spacer');
  var target = 0;
  if (spacer) {
    var span = Math.max(1, spacer.offsetHeight - this.vh);
    target = clamp((window.scrollY || 0) / span, 0, 1) * MAXD;
  }
  if (red) this.depthT = target;
  else this.depthT += (target - this.depthT) * 0.085;
  this.depth = this.depthT;
  if (this.o.onDepth) this.o.onDepth(this.depth, this.online);

  // charging
  if (!this.online && !this.paused) {
    if (this.charging && this.depth > 3.3) this.charge = Math.min(1, this.charge + 0.011);
    else if (this._autoCharge) this.charge = Math.min(1, this.charge + 0.016);
    else if (this.charge > 0 && this.charge < 1) this.charge = Math.max(0, this.charge - 0.0022);
    if (this.o.onCharge) this.o.onCharge(Math.round(this.charge * 100));
    if (this.charge >= 1) {
      this.online = true; this.flashT = 1; this._autoCharge = false;
      if (this.o.onOnline) this.o.onOnline();
    }
  }
  if (this.flashT > 0) this.flashT = Math.max(0, this.flashT - 0.012);

  if (!red && !this.paused) this._physics();
  this._render(red);
};

CircuitEngine.prototype._physics = function () {
  var L = this._activeLayer();
  if (this.surge && this.t - this.surge.t0 > 1.6) this.surge = null;
  if (!L || L.core) { if (this.drag) this.drag = null; return; }
  var xf = this._layerXf(L);
  var lp = this._toLayer(L, this.pointer.x, this.pointer.y, xf);
  var k0 = 0.05, kC = 0.12, damp = 0.88;
  var dragV = this.drag ? this.drag.vert : null;
  if (dragV) {
    var tx = lp.x - dragV.x, ty = lp.y - dragV.y;
    var len = Math.sqrt(tx * tx + ty * ty);
    var maxL = 120 / xf.s;
    if (len > maxL) { var sc = (maxL + (len - maxL) * 0.3) / len; tx *= sc; ty *= sc; }
    dragV.offx += (tx - dragV.offx) * 0.4;
    dragV.offy += (ty - dragV.offy) * 0.4;
    dragV.vx = 0; dragV.vy = 0;
  }
  var surge = this.surge && this.surge.layer === L ? this.surge : null;
  var sR = surge ? (this.t - surge.t0) * this.mn * 1.05 : 0;
  for (var t = 0; t < L.traces.length; t++) {
    var tr = L.traces[t];
    var vs = tr.v;
    for (var i = 0; i < vs.length; i++) {
      var v = vs[i];
      if (v === dragV) continue;
      // neighbour coupling along the trace
      if (i > 0) { v.vx += (vs[i - 1].offx - v.offx) * kC; v.vy += (vs[i - 1].offy - v.offy) * kC; }
      if (i < vs.length - 1) { v.vx += (vs[i + 1].offx - v.offx) * kC; v.vy += (vs[i + 1].offy - v.offy) * kC; }
      v.vx += -v.offx * k0; v.vy += -v.offy * k0;
      // surge wavefront kick
      if (surge) {
        var dx = v.x - surge.x, dy = v.y - surge.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (Math.abs(d - sR) < this.mn * 0.06 && d > 1) {
          var kk = 2.2 / Math.max(60, d);
          v.vx += dx * kk; v.vy += dy * kk;
          tr.exc = Math.max(tr.exc, 0.9);
        }
      }
      v.vx *= damp; v.vy *= damp;
      v.offx += v.vx; v.offy += v.vy;
    }
    tr.exc *= 0.957;
  }
  for (var c = 0; c < L.comps.length; c++) L.comps[c].exc *= 0.955;
};

// ============ render ============
CircuitEngine.prototype._render = function (red) {
  var ctx = this.ctx, vw = this.vw, vh = this.vh, mn = this.mn;
  ctx.clearRect(0, 0, vw, vh);
  var dim = this.paused ? 0.22 : 1;
  var hoverMajor = null;

  // ambient motes (screen space, warm dust)
  for (var mi = 0; mi < this.motes.length; mi++) {
    var m = this.motes[mi];
    var mx = m.x * vw + (red ? 0 : Math.sin(this.t * 0.1 * m.sp + m.ph) * 22);
    var my = (m.y * vh + (red ? 0 : this.t * 3 * m.sp)) % vh;
    ctx.globalAlpha = (0.03 + 0.05 * (0.5 + 0.5 * Math.sin(this.t * 0.7 + m.ph * 4))) * dim;
    ctx.fillStyle = rgba(C_HOT, 1);
    ctx.beginPath(); ctx.arc(mx, my, m.r, 0, TAU); ctx.fill();
  }

  // layers, deepest first
  for (var li = this.layers.length - 1; li >= 0; li--) {
    var L = this.layers[li];
    var xf = this._layerXf(L);
    var s = xf.s;
    if (s < 0.22 || s > 3.2) continue;
    var la = smooth((s - 0.24) / 0.45) * (1 - smooth((s - 1.35) / 1.3));
    if (la <= 0.01) continue;
    var pw = L.pw * (0.3 + 0.7 * smooth((s - 0.35) / 0.6));
    if (L.core) pw = 0.25 + 0.75 * this.charge;
    var boost = this.flashT * 0.6;

    ctx.save();
    ctx.translate(vw / 2 + xf.ox, vh / 2 + xf.oy);
    ctx.scale(s, s);
    ctx.translate(-vw / 2, -vh / 2);

    var lp = null, hoverR = 0;
    if (this.pointer.on && s > 0.5 && s < 2.1 && !this.paused) {
      lp = this._toLayer(L, this.pointer.x, this.pointer.y, xf);
      hoverR = 100 / s;
    }
    var surge = this.surge && this.surge.layer === L ? this.surge : null;
    var sR = surge ? (this.t - surge.t0) * mn * 1.05 : 0;
    var sBand = mn * 0.08;

    // -- traces --
    for (var t = 0; t < L.traces.length; t++) {
      var tr = L.traces[t];
      var vs = tr.v;
      // brightness per trace: base power + excitement + hover/surge sampled at midpoint
      var glow = tr.exc;
      if (lp || surge) {
        var mid = vs[Math.floor(vs.length / 2)];
        if (lp) {
          var hdx = mid.x + mid.offx - lp.x, hdy = mid.y + mid.offy - lp.y;
          var hd = Math.sqrt(hdx * hdx + hdy * hdy);
          if (hd < hoverR * 1.6) glow = Math.max(glow, (1 - hd / (hoverR * 1.6)) * 0.85);
        }
        if (surge) {
          var sdx = mid.x - surge.x, sdy = mid.y - surge.y;
          var sd = Math.sqrt(sdx * sdx + sdy * sdy);
          if (Math.abs(sd - sR) < sBand * 2.2) glow = Math.max(glow, 1 - Math.abs(sd - sR) / (sBand * 2.2));
        }
      }
      var bright = clamp(pw * 0.55 + glow + boost, 0, 1.4);
      ctx.beginPath();
      ctx.moveTo(vs[0].x + vs[0].offx, vs[0].y + vs[0].offy);
      for (var v2 = 1; v2 < vs.length; v2++) ctx.lineTo(vs[v2].x + vs[v2].offx, vs[v2].y + vs[v2].offy);
      // dim copper base
      ctx.globalAlpha = (0.16 + 0.26 * bright) * la * dim;
      ctx.strokeStyle = rgba(C_TRACE, 1);
      ctx.lineWidth = tr.w;
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.stroke();
      // hot overlay
      if (bright > 0.35) {
        ctx.globalAlpha = (bright - 0.35) * 0.5 * la * dim;
        ctx.strokeStyle = rgba(C_HOT, 1);
        ctx.lineWidth = tr.w * 0.75;
        ctx.stroke();
      }
      // end caps
      var last = vs[vs.length - 1];
      if (tr.endCap === 'via') {
        ctx.globalAlpha = (0.35 + 0.4 * bright) * la * dim;
        ctx.fillStyle = rgba(C_TRACE, 1);
        ctx.beginPath(); ctx.arc(last.x + last.offx, last.y + last.offy, tr.w + 2.2, 0, TAU); ctx.fill();
        ctx.globalAlpha = 0.9 * la * dim;
        ctx.fillStyle = '#0B0A08';
        ctx.beginPath(); ctx.arc(last.x + last.offx, last.y + last.offy, tr.w * 0.6 + 0.5, 0, TAU); ctx.fill();
      } else if (tr.endCap === 'pad') {
        ctx.globalAlpha = (0.3 + 0.4 * bright) * la * dim;
        ctx.fillStyle = rgba(C_TRACE, 1);
        var pr = tr.w + 2.6;
        ctx.fillRect(last.x + last.offx - pr, last.y + last.offy - pr, pr * 2, pr * 2);
      }
      // -- current particles --
      if (!red && !this.paused && s > 0.45 && la > 0.12) {
        var nsig = Math.max(1, Math.round(tr.sigs.length * clamp(pw + boost, 0.15, 1)));
        for (var si = 0; si < nsig; si++) {
          var sig = tr.sigs[si];
          sig.t += sig.sp * (0.5 + pw * 1.6 + glow * 1.4) * (60 * (1 / 60)) * (this.mn / tr.len) * 2.2;
          if (sig.t > 1) sig.t -= 1;
          polyPoint(tr, sig.t, _pp);
          var sa = (0.25 + 0.6 * bright) * la * dim;
          ctx.globalAlpha = Math.min(1, sa);
          ctx.fillStyle = rgba(C_SIG, 1);
          ctx.beginPath(); ctx.arc(_pp.x, _pp.y, Math.max(0.9, tr.w * 0.55) + glow, 0, TAU); ctx.fill();
          if (glow > 0.25 || pw > 0.7) {
            ctx.globalAlpha = sa * 0.35;
            ctx.beginPath(); ctx.arc(_pp.x, _pp.y, (Math.max(0.9, tr.w * 0.55) + glow) * 2.6, 0, TAU); ctx.fill();
          }
        }
      }
    }

    // -- components --
    for (var c = 0; c < L.comps.length; c++) {
      var comp = L.comps[c];
      var cbr = clamp(pw * 0.6 + comp.exc + boost, 0, 1.2);
      // hover proximity lights components
      if (lp) {
        var cdx = comp.x - lp.x, cdy = comp.y - lp.y;
        var cd = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cd < hoverR * 2) { comp.exc = Math.max(comp.exc, (1 - cd / (hoverR * 2)) * 0.8); cbr = clamp(pw * 0.6 + comp.exc, 0, 1.2); }
      }
      var isMajor = !!comp.major;
      // body
      ctx.globalAlpha = la * dim;
      ctx.fillStyle = isMajor ? '#131009' : '#100E0A';
      ctx.fillRect(comp.x - comp.w / 2, comp.y - comp.h / 2, comp.w, comp.h);
      ctx.globalAlpha = (0.4 + 0.5 * cbr) * la * dim;
      ctx.strokeStyle = rgba(isMajor ? C_HOT : C_TRACE, 1);
      ctx.lineWidth = isMajor ? 1.4 : 1;
      ctx.strokeRect(comp.x - comp.w / 2, comp.y - comp.h / 2, comp.w, comp.h);
      // pulsing beacon ring on interactive majors — signals "clickable"
      if (isMajor && !red && s > 0.55) {
        var bp = (this.t * 0.55) % 1;
        var bw2 = comp.w * (0.58 + bp * 0.45), bh2 = comp.h * (0.58 + bp * 0.45);
        ctx.globalAlpha = (1 - bp) * (1 - bp) * 0.55 * la * dim;
        ctx.strokeStyle = rgba(C_HOT, 1);
        ctx.lineWidth = 1.2;
        ctx.strokeRect(comp.x - bw2, comp.y - bh2, bw2 * 2, bh2 * 2);
      }
      // inner die
      if (isMajor || comp.named) {
        ctx.globalAlpha = (0.12 + 0.4 * cbr) * la * dim;
        ctx.fillStyle = rgba(C_HOT, 1);
        var iw = comp.w * 0.42, ih = comp.h * 0.42;
        ctx.fillRect(comp.x - iw / 2, comp.y - ih / 2, iw, ih);
      }
      // silkscreen label
      if (s > 0.62 && la > 0.3) {
        var fs = isMajor ? Math.max(10, comp.w * 0.1) : Math.max(7, comp.w * 0.2);
        ctx.font = '500 ' + fs + 'px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.globalAlpha = (comp.named ? 0.85 : 0.4) * la * smooth((s - 0.62) / 0.3) * dim;
        ctx.fillStyle = rgba(C_SILK, 1);
        if (isMajor) {
          var lbl = this.o.labels[comp.major] || comp.ref;
          ctx.fillText(comp.ref + ' · ' + lbl, comp.x, comp.y - comp.h / 2 - fs * 1.1);
          ctx.globalAlpha = (0.55 + 0.45 * cbr) * la * dim;
          ctx.fillStyle = rgba(C_HOT, 1);
          ctx.fillText(this.o.inspect, comp.x, comp.y + comp.h / 2 + fs * 1.6);
        } else {
          ctx.fillText(comp.label, comp.x, comp.y - comp.h / 2 - fs * 0.7);
        }
      }
      // major hit test (screen space)
      if (isMajor && s > 0.5 && s < 2.4 && la > 0.2 && this.pointer.on) {
        var sxc = (comp.x - vw / 2) * s + vw / 2 + xf.ox;
        var syc = (comp.y - vh / 2) * s + vh / 2 + xf.oy;
        var hw = comp.w * s / 2 + 18, hh = comp.h * s / 2 + 18;
        if (Math.abs(this.pointer.x - sxc) < hw && Math.abs(this.pointer.y - syc) < hh) {
          hoverMajor = comp.major;
          comp.exc = Math.max(comp.exc, 0.7);
        }
      }
    }

    // -- the core chipset --
    if (L.core && L.chip) {
      var ch = L.chip, half = ch.side / 2;
      var q = this.charge, on = this.online;
      var breath = red ? 0 : Math.sin(this.t * 1.6) * 0.5 + 0.5;
      // substrate
      ctx.globalAlpha = la * dim;
      var grd = ctx.createLinearGradient(ch.x - half, ch.y - half, ch.x + half, ch.y + half);
      grd.addColorStop(0, '#16120B');
      grd.addColorStop(0.5, '#1D1710');
      grd.addColorStop(1, '#120F0A');
      ctx.fillStyle = grd;
      ctx.fillRect(ch.x - half, ch.y - half, ch.side, ch.side);
      // die window
      var dw = ch.side * 0.72;
      ctx.globalAlpha = (0.25 + 0.75 * q) * la * dim;
      var grd2 = ctx.createRadialGradient(ch.x, ch.y, 0, ch.x, ch.y, dw / 2);
      grd2.addColorStop(0, rgba(C_HOT, 0.34 + 0.4 * q + (on ? breath * 0.12 : 0)));
      grd2.addColorStop(0.7, rgba(C_TRACE, 0.12 + 0.2 * q));
      grd2.addColorStop(1, 'rgba(20,16,10,0)');
      ctx.fillStyle = grd2;
      ctx.fillRect(ch.x - dw / 2, ch.y - dw / 2, dw, dw);
      // frame
      ctx.globalAlpha = (0.5 + 0.5 * q) * la * dim;
      ctx.strokeStyle = rgba(C_HOT, 0.7 + 0.3 * q);
      ctx.lineWidth = 1.6;
      ctx.strokeRect(ch.x - half, ch.y - half, ch.side, ch.side);
      ctx.globalAlpha = (0.25 + 0.45 * q) * la * dim;
      ctx.strokeStyle = rgba(C_TRACE, 1);
      ctx.lineWidth = 1;
      ctx.strokeRect(ch.x - dw / 2, ch.y - dw / 2, dw, dw);
      // pins
      var pinsPer = 8, pl = ch.side * 0.055;
      for (var s5 = 0; s5 < 4; s5++) {
        for (var pi2 = 0; pi2 < pinsPer; pi2++) {
          var f2 = (pi2 + 1) / (pinsPer + 1) - 0.5;
          ctx.globalAlpha = (0.4 + 0.6 * q) * la * dim;
          ctx.strokeStyle = rgba(C_TRACE, 1);
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          if (s5 === 0) { ctx.moveTo(ch.x + f2 * ch.side, ch.y - half); ctx.lineTo(ch.x + f2 * ch.side, ch.y - half - pl); }
          else if (s5 === 1) { ctx.moveTo(ch.x + half, ch.y + f2 * ch.side); ctx.lineTo(ch.x + half + pl, ch.y + f2 * ch.side); }
          else if (s5 === 2) { ctx.moveTo(ch.x + f2 * ch.side, ch.y + half); ctx.lineTo(ch.x + f2 * ch.side, ch.y + half + pl); }
          else { ctx.moveTo(ch.x - half, ch.y + f2 * ch.side); ctx.lineTo(ch.x - half - pl, ch.y + f2 * ch.side); }
          ctx.stroke();
        }
      }
      // engraving — YY trace monogram (silkscreen logo)
      var nfs = ch.side * 0.105;
      this._drawLogo(ctx, ch.x, ch.y - ch.side * 0.075, ch.side * 0.42, q, la * dim, on ? breath : 0);
      ctx.textAlign = 'center';
      ctx.font = '500 ' + (nfs * 0.34) + 'px "JetBrains Mono", monospace';
      ctx.globalAlpha = (0.18 + 0.72 * q) * la * dim;
      ctx.fillStyle = rgba(C_HOT, 1);
      ctx.fillText(this.o.coreSub, ch.x, ch.y + ch.side * 0.235);
      // charge ring
      if (!on && q > 0.01) {
        ctx.globalAlpha = 0.9 * la * dim;
        ctx.strokeStyle = rgba(C_HOT, 1);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ch.x, ch.y, half * 1.28, -Math.PI / 2, -Math.PI / 2 + q * TAU);
        ctx.stroke();
        ctx.globalAlpha = 0.18 * la * dim;
        ctx.beginPath(); ctx.arc(ch.x, ch.y, half * 1.28, 0, TAU); ctx.stroke();
      }
      if (on) {
        ctx.globalAlpha = (0.25 + breath * 0.2) * la * dim;
        ctx.strokeStyle = rgba(C_HOT, 1);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(ch.x, ch.y, half * (1.24 + breath * 0.05), 0, TAU); ctx.stroke();
      }
    }

    ctx.restore();
  }

  // online flash
  if (this.flashT > 0.6) {
    ctx.globalAlpha = (this.flashT - 0.6) * 0.5;
    ctx.fillStyle = rgba(C_HOT, 1);
    ctx.fillRect(0, 0, vw, vh);
  }
  ctx.globalAlpha = 1;
  this.hoverMajor = hoverMajor;
};

export default CircuitEngine;
