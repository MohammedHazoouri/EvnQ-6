/* badge.js — يضيف دائرة اللوغو العائمة (أسفل اليمين) لأي صفحة تحمّل هذا الملف.
   لإضافتها لصفحة جديدة: أضيفوا فقط
   <link rel="stylesheet" href="css/badge.css"> و <script src="js/badge.js" defer></script> */
(function () {
  'use strict';
  if (document.querySelector('.evnq-badge')) return;

  var cfg = (window.WEDDING_CONFIG && window.WEDDING_CONFIG.badge) || {};
  var logo = cfg.logo || 'assets/logo.png';
  var url = cfg.url || 'https://www.instagram.com/invites/contact/?utm_content=10y5v4es&srtk=2od0mn8c877b';
  var lang = (document.documentElement.lang || 'ar').slice(0, 2);
  var label = (cfg.label && (cfg.label[lang] || cfg.label.ar)) || 'EvnQ';

  var a = document.createElement('a');
  a.className = 'evnq-badge';
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.setAttribute('aria-label', label);
  a.title = 'EvnQ';

  var img = document.createElement('img');
  img.src = logo;
  img.alt = '';
  img.width = 62;
  img.height = 62;
  img.decoding = 'async';
  a.appendChild(img);

  function mount() { document.body.appendChild(a); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  // يتبع تغيير اللغة
  document.addEventListener('wedding:langchange', function (e) {
    var l = e.detail && e.detail.lang;
    if (l && cfg.label && cfg.label[l]) a.setAttribute('aria-label', cfg.label[l]);
  });
})();
