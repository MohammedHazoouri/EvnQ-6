/* art.js — رسومات نباتية مولّدة بالكود (ورود، أوراق زيتون، فواصل) بدون أي صور خارجية */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';

  function rng(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  var PALETTES = {
    cream: ['#FFF6E8', '#F3E2CB', '#E4C9A6'],
    white: ['#FFFFFF', '#F4EEE6', '#DCD0C0'],
    blush: ['#F7DDD7', '#E9BDB5', '#D39A94'],
    rose:  ['#E7B5AE', '#D7A6A0', '#B97F7A'],
    peach: ['#FBDCC3', '#F0BE9B', '#DB9C78']
  };

  function defs(svg, id) {
    var d = el('defs', {}, svg);
    Object.keys(PALETTES).forEach(function (k) {
      var g = el('radialGradient', { id: id + k, cx: '50%', cy: '45%', r: '60%' }, d);
      el('stop', { offset: '0%', 'stop-color': PALETTES[k][0] }, g);
      el('stop', { offset: '70%', 'stop-color': PALETTES[k][1] }, g);
      el('stop', { offset: '100%', 'stop-color': PALETTES[k][2] }, g);
    });
    var l = el('linearGradient', { id: id + 'leaf', x1: '0', y1: '0', x2: '1', y2: '1' }, d);
    el('stop', { offset: '0%', 'stop-color': '#8E9A78' }, l);
    el('stop', { offset: '100%', 'stop-color': '#354D3C' }, l);
    var l2 = el('linearGradient', { id: id + 'leaf2', x1: '0', y1: '0', x2: '1', y2: '1' }, d);
    el('stop', { offset: '0%', 'stop-color': '#B6BEA3' }, l2);
    el('stop', { offset: '100%', 'stop-color': '#747B58' }, l2);
  }

  function leaf(parent, x, y, len, ang, fill, op) {
    var w = len * 0.32;
    var g = el('g', { transform: 'translate(' + x + ' ' + y + ') rotate(' + ang + ')', opacity: op || 1 }, parent);
    el('path', { d: 'M0 0 C ' + w + ' ' + (-len * 0.3) + ' ' + w + ' ' + (-len * 0.75) + ' 0 ' + (-len) + ' C ' + (-w) + ' ' + (-len * 0.75) + ' ' + (-w) + ' ' + (-len * 0.3) + ' 0 0 Z', fill: fill }, g);
    el('path', { d: 'M0 -2 L0 ' + (-len * 0.9), stroke: 'rgba(255,255,255,.28)', 'stroke-width': 0.8, fill: 'none' }, g);
  }

  function rose(parent, x, y, r, kind, id, rand) {
    var g = el('g', { transform: 'translate(' + x + ' ' + y + ') rotate(' + Math.round(rand() * 360) + ')' }, parent);
    el('circle', { r: r * 1.05, cx: 1, cy: 2, fill: 'rgba(53,77,60,.18)' }, g);
    var fill = 'url(#' + id + kind + ')';
    var stroke = PALETTES[kind][2];
    for (var i = 0; i < 6; i++) {
      var a = i * 60 + rand() * 20;
      el('ellipse', { cx: Math.cos(a * Math.PI / 180) * r * 0.45, cy: Math.sin(a * Math.PI / 180) * r * 0.45, rx: r * 0.62, ry: r * 0.5, fill: fill, stroke: stroke, 'stroke-width': 0.6, 'stroke-opacity': .5, transform: 'rotate(' + a + ' ' + (Math.cos(a * Math.PI / 180) * r * 0.45) + ' ' + (Math.sin(a * Math.PI / 180) * r * 0.45) + ')' }, g);
    }
    el('circle', { r: r * 0.5, fill: fill, stroke: stroke, 'stroke-width': 0.6, 'stroke-opacity': .6 }, g);
    el('path', { d: 'M' + (-r * .3) + ' 0 Q0 ' + (-r * .32) + ' ' + (r * .3) + ' 0 Q0 ' + (r * .3) + ' ' + (-r * .3) + ' 0', fill: 'none', stroke: stroke, 'stroke-width': .8, 'stroke-opacity': .7 }, g);
    el('circle', { r: r * 0.16, fill: PALETTES[kind][2], opacity: .55 }, g);
  }

  function bloomSmall(parent, x, y, r, rand) {
    var g = el('g', { transform: 'translate(' + x + ' ' + y + ')' }, parent);
    for (var i = 0; i < 5; i++) el('ellipse', { cx: 0, cy: -r * .6, rx: r * .35, ry: r * .6, fill: '#FFFDF8', stroke: '#E5D8C6', 'stroke-width': .4, transform: 'rotate(' + (i * 72 + rand() * 10) + ')' }, g);
    el('circle', { r: r * .22, fill: '#C5A36A' }, g);
  }

  /* ---------- عنقود ورود يُستخدم بالبوابة وبالمقدمة ---------- */
  function cluster(parent, cx, cy, scale, seed, id, opts) {
    var rand = rng(seed);
    var g = el('g', { transform: 'translate(' + cx + ' ' + cy + ') scale(' + scale + ')' }, parent);
    var n = (opts && opts.n) || 9;
    // أوراق
    for (var i = 0; i < n * 2; i++) {
      var a = rand() * 360;
      leaf(g, (rand() - .5) * 40, (rand() - .5) * 40, 38 + rand() * 40, a, 'url(#' + id + (rand() > .5 ? 'leaf' : 'leaf2') + ')', .95);
    }
    // أغصان زيتون رفيعة
    for (var j = 0; j < 3; j++) {
      var ang = rand() * 360, L = 60 + rand() * 50;
      var p = el('g', { transform: 'rotate(' + ang + ')' }, g);
      el('path', { d: 'M0 0 Q ' + (L * .3) + ' ' + (-L * .5) + ' ' + (L * .1) + ' ' + (-L), stroke: '#747B58', 'stroke-width': 1.4, fill: 'none' }, p);
      for (var k = 1; k < 6; k++) {
        leaf(p, L * .1 * k * .6, -L * k / 6, 14, (k % 2 ? 50 : -50), '#A4AD91', .95);
      }
    }
    var kinds = ['cream', 'white', 'blush', 'rose', 'peach', 'cream', 'white'];
    for (var m = 0; m < n; m++) {
      var rr = 15 + rand() * 14;
      rose(g, (rand() - .5) * 64, (rand() - .5) * 52, rr, kinds[Math.floor(rand() * kinds.length)], id, rand);
    }
    for (var q = 0; q < 7; q++) bloomSmall(g, (rand() - .5) * 96, (rand() - .5) * 80, 6 + rand() * 4, rand);
    return g;
  }

  /* ---------- 1. أزهار البوابة ---------- */
  function gateFlowers() {
    var svg = document.getElementById('gateFlowers');
    if (!svg) return;
    defs(svg, 'gf');
    var rand = rng(7);
    var back = el('g', {}, svg);
    // أوراق ممتدة على القوس والأعمدة
    var pts = [];
    for (var a = 180; a <= 360; a += 9) pts.push([300 + 285 * Math.cos(a * Math.PI / 180), 300 + 262 * Math.sin(a * Math.PI / 180), a]);
    for (var y = 310; y < 760; y += 34) { pts.push([14 + rand() * 18, y, 180]); pts.push([586 - rand() * 18, y, 0]); }
    pts.forEach(function (p) {
      leaf(back, p[0], p[1], 34 + rand() * 30, (p[2] - 270) + (rand() - .5) * 140, 'url(#gfleaf' + (rand() > .5 ? '' : '2') + ')', .95);
    });
    // ورود على القوس
    var kinds = ['cream', 'white', 'blush', 'peach', 'rose', 'cream'];
    for (var a2 = 184; a2 <= 356; a2 += 12) {
      var px = 300 + 285 * Math.cos(a2 * Math.PI / 180) + (rand() - .5) * 14;
      var py = 300 + 262 * Math.sin(a2 * Math.PI / 180) + (rand() - .5) * 14;
      rose(svg, px, py, 12 + rand() * 11, kinds[Math.floor(rand() * kinds.length)], 'gf', rand);
      if (rand() > .5) bloomSmall(svg, px + (rand() - .5) * 30, py + (rand() - .5) * 30, 6, rand);
    }
    // أعمدة
    for (var yy = 330; yy < 760; yy += 56) {
      rose(svg, 24 + rand() * 12, yy + rand() * 20, 10 + rand() * 8, kinds[Math.floor(rand() * kinds.length)], 'gf', rand);
      rose(svg, 576 - rand() * 12, yy + rand() * 20, 10 + rand() * 8, kinds[Math.floor(rand() * kinds.length)], 'gf', rand);
    }
    // عناقيد كبيرة: قمة القوس + الزوايا السفلية
    cluster(svg, 300, 46, 1.25, 11, 'gf', { n: 11 });
    cluster(svg, 40, 740, 1.15, 23, 'gf', { n: 9 });
    cluster(svg, 560, 744, 1.05, 31, 'gf', { n: 9 });
    cluster(svg, 36, 300, .8, 47, 'gf', { n: 6 });
    cluster(svg, 566, 296, .85, 53, 'gf', { n: 6 });
    // نباتات متدلّية
    for (var h = 0; h < 5; h++) {
      var hx = 120 + h * 90 + rand() * 30, hy = 90 + Math.abs(h - 2) * 18;
      el('path', { d: 'M' + hx + ' ' + hy + ' q ' + ((rand() - .5) * 20) + ' 40 ' + ((rand() - .5) * 16) + ' ' + (60 + rand() * 40), stroke: '#747B58', 'stroke-width': 1.6, fill: 'none', opacity: .8 }, svg);
    }
  }

  /* ---------- 2. زهور المقدمة (ضبابية) ---------- */
  function gateFore() {
    var svg = document.getElementById('gateFore');
    if (!svg) return;
    defs(svg, 'ff');
    var f = el('filter', { id: 'ffblur', x: '-20%', y: '-20%', width: '140%', height: '140%' }, svg.querySelector('defs'));
    el('feGaussianBlur', { stdDeviation: '2.4' }, f);
    var gl = el('g', { filter: 'url(#ffblur)' }, svg);
    cluster(gl, 90, 520, 2.5, 101, 'ff', { n: 10 });
    cluster(gl, 910, 540, 2.2, 202, 'ff', { n: 9 });
    var gl2 = el('g', { opacity: .95 }, svg);
    cluster(gl2, 270, 600, 1.4, 303, 'ff', { n: 6 });
    cluster(gl2, 760, 610, 1.3, 404, 'ff', { n: 6 });
  }

  /* ---------- 3. أضواء (بوكيه) ---------- */
  function lights() {
    var host = document.getElementById('gateLights');
    if (!host) return;
    var rand = rng(5), frag = document.createDocumentFragment();
    for (var i = 0; i < 26; i++) {
      var s = document.createElement('i');
      var size = 6 + rand() * 16;
      s.style.cssText = 'left:' + (rand() * 100) + '%;top:' + (6 + rand() * 46) + '%;width:' + size + 'px;height:' + size + 'px;animation-delay:' + (rand() * 4).toFixed(2) + 's;opacity:' + (.25 + rand() * .5).toFixed(2);
      frag.appendChild(s);
    }
    host.appendChild(frag);
  }

  /* ---------- 4. بتلات متساقطة ---------- */
  function petals() {
    var host = document.getElementById('petals');
    if (!host) return;
    var rand = rng(9), cols = ['#F0D7D1', '#D7A6A0', '#FFF6E8', '#F7DDD7'];
    for (var i = 0; i < 12; i++) {
      var p = document.createElement('i');
      p.style.cssText = 'left:' + (rand() * 100) + '%;background:' + cols[i % 4] + ';animation-duration:' + (10 + rand() * 9).toFixed(1) + 's;animation-delay:' + (-rand() * 14).toFixed(1) + 's;--sx:' + ((rand() - .5) * 160).toFixed(0) + 'px;transform:scale(' + (.6 + rand() * .7).toFixed(2) + ')';
      host.appendChild(p);
    }
  }

  /* ---------- 5. زخارف الأطراف + الفواصل ---------- */
  function ornament(host) {
    var svg = el('svg', { viewBox: '0 0 260 260', 'aria-hidden': 'true', focusable: 'false' });
    defs(svg, 'o' + Math.floor(Math.random() * 1e6));
    var id = svg.querySelector('linearGradient').id.replace('leaf', '');
    var rand = rng(host.className.length * 31 + 7);
    el('path', { d: 'M10 250 C 60 170 120 120 250 20', stroke: '#C5A36A', 'stroke-width': 1.2, fill: 'none' }, svg);
    for (var i = 0; i < 12; i++) {
      var t = i / 11, x = 10 + 240 * t, y = 250 - 230 * Math.pow(t, .9);
      leaf(svg, x, y, 30 + rand() * 18, (i % 2 ? 40 : -50) + 35, 'url(#' + id + (i % 2 ? 'leaf' : 'leaf2') + ')', .9);
      leaf(svg, x, y, 22, (i % 2 ? -60 : 70) + 35, '#A4AD91', .8);
    }
    rose(svg, 58, 196, 17, 'blush', id, rand);
    rose(svg, 112, 150, 14, 'cream', id, rand);
    bloomSmall(svg, 160, 100, 9, rand);
    rose(svg, 210, 56, 11, 'rose', id, rand);
    host.appendChild(svg);
  }

  function divider(host) {
    var svg = el('svg', { viewBox: '0 0 300 24', 'aria-hidden': 'true', focusable: 'false' });
    el('path', { d: 'M0 12 H110 M190 12 H300', stroke: 'currentColor', 'stroke-width': .8, opacity: .8 }, svg);
    el('path', { d: 'M130 12 q 10 -14 20 0 q 10 14 20 0', stroke: 'currentColor', 'stroke-width': 1, fill: 'none' }, svg);
    el('circle', { cx: 150, cy: 12, r: 2.6, fill: 'currentColor' }, svg);
    host.appendChild(svg);
  }

  function run() {
    gateFlowers(); gateFore(); lights(); petals();
    document.querySelectorAll('[data-ornament]').forEach(ornament);
    document.querySelectorAll('[data-divider]').forEach(divider);
    window.WeddingArt = { ready: true, el: el, defs: defs, cluster: cluster, rose: rose, leaf: leaf, bloomSmall: bloomSmall, rng: rng };
    document.dispatchEvent(new Event('wedding:artready'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
