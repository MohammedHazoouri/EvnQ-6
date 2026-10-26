/* app.js — منطق الموقع: اللغة، البوابة، العد التنازلي، المعرض، RSVP، الموسيقى ... */
(function () {
  'use strict';
  var CFG = window.WEDDING_CONFIG, I18N = window.WEDDING_I18N;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = (CFG.availableLanguages.indexOf(CFG.language) > -1) ? CFG.language : CFG.availableLanguages[0];
  try { var saved = localStorage.getItem('wedding-lang'); if (saved && CFG.availableLanguages.indexOf(saved) > -1) lang = saved; } catch (e) {}
  var opened = false, cdTimer = null;

  function T() { return I18N[lang]; }
  function get(obj, path) { return path.split('.').reduce(function (o, k) { return o ? o[k] : undefined; }, obj); }
  function L(v) { if (v == null) return ''; if (typeof v === 'string') return v; return v[lang] || v.ar || v.en || ''; }
  function ph() { return T().placeholder; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------------- التاريخ ---------------- */
  var when = CFG.date ? new Date(CFG.date) : null;
  if (when && isNaN(when.getTime())) { console.warn('[wedding] config.date غير صالح'); when = null; }
  function fmt(opts) { try { return new Intl.DateTimeFormat(T().locale + (lang === 'ar' ? '-u-nu-latn' : ''), Object.assign({ timeZone: CFG.timezone }, opts)).format(when); } catch (e) { return ''; } }
  function dateLong() { return when ? fmt({ day: 'numeric', month: 'long', year: 'numeric' }) : ''; }
  function dayName() { return when ? fmt({ weekday: 'long' }) : ''; }
  function timeStr() { return when ? fmt({ hour: 'numeric', minute: '2-digit' }) : ''; }

  /* ---------------- ملء النصوص ---------------- */
  function applyText() {
    var t = T(), root = document.documentElement;
    root.lang = lang; root.dir = t.dir;
    $$('[data-i18n]').forEach(function (n) { var v = get(t, n.getAttribute('data-i18n')); if (typeof v === 'string') n.textContent = v; });
    $$('[data-i18n-aria]').forEach(function (n) { var v = get(t, n.getAttribute('data-i18n-aria')); if (v) n.setAttribute('aria-label', v); });
    var bride = L(CFG.brideName), groom = L(CFG.groomName);
    $$('[data-name="bride"]').forEach(function (n) { n.textContent = bride; });
    $$('[data-name="groom"]').forEach(function (n) { n.textContent = groom; });
    $$('[data-initial]').forEach(function (n) { var s = (n.getAttribute('data-initial') === 'bride' ? bride : groom).replace(/[\[\]\s]/g, ''); n.textContent = s.charAt(0).toUpperCase() || '·'; });
    $$('[data-wedding-date]').forEach(function (n) { n.textContent = dateLong() || L({ ar: '[تاريخ الزفاف]', en: '[WEDDING DATE]' }); });
    $$('[data-big-date]').forEach(function (n) {
      n.textContent = when ? (dayName() + '\n' + dateLong()) : L({ ar: '[تاريخ الزفاف]', en: '[WEDDING DATE]' });
    });
    $$('[data-venue-name]').forEach(function (n) { n.textContent = L(CFG.venueName) || L({ ar: '[اسم المكان]', en: '[WEDDING VENUE]' }); });
    $$('[data-venue-city]').forEach(function (n) { n.textContent = L(CFG.venueCity) || L({ ar: '[المدينة]', en: '[VENUE CITY]' }); });
    $$('[data-venue-address]').forEach(function (n) { n.textContent = L(CFG.venueAddress) || L({ ar: '[عنوان المكان]', en: '[VENUE ADDRESS]' }); });
    document.title = (bride + ' & ' + groom).replace(/[\[\]]/g, '');
    $('#venueDesc').textContent = L(CFG.venueDescription) || t.venueDesc;
    renderCouple(); renderDetails(); renderTimeline(); renderDress(); renderGallery(); renderVenue(); renderMusicLabels(); renderRsvpTexts();
    var langs = CFG.availableLanguages.length > 1;
    [$('#langBtn'), $('#gateLang')].forEach(function (b) { if (b) { b.hidden = !langs; b.textContent = t.langToggle; b.setAttribute('lang', lang === 'ar' ? 'en' : 'ar'); } });
    $('#menuBtn').setAttribute('aria-label', t.menuOpen);
    updateCountdown();
    document.dispatchEvent(new CustomEvent('wedding:langchange', { detail: { lang: lang } }));
  }

  /* ---------------- الثنائي ---------------- */
  function portrait(fig, name, role, short, photo) {
    var t = T();
    var inner = photo ? '<img src="' + esc(photo) + '" alt="' + esc(t.alt.portrait + ' ' + name) + '" loading="lazy">'
      : '<div class="ph" aria-hidden="true"><div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="9" r="3.6"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/></svg><small>' + esc(t.galleryPh) + '</small></div></div>';
    fig.innerHTML = '<div class="frame">' + inner + '</div><figcaption><span class="pr">' + esc(role) + '</span><span class="pn">' + esc(name) + '</span>' + (short ? '<span class="pd">' + esc(short) + '</span>' : '') + '</figcaption>';
  }
  function renderCouple() {
    portrait($('#brideFig'), L(CFG.brideName), T().brideRole, L(CFG.brideShort), CFG.bridePhoto);
    portrait($('#groomFig'), L(CFG.groomName), T().groomRole, L(CFG.groomShort), CFG.groomPhoto);
  }

  /* ---------------- التفاصيل ---------------- */
  var ICONS = {
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    day: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>',
    rings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="M7.5 6.5 9 4l1.5 2.5L9 8.5z"/></svg>',
    bld: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M4 20h16M6 20V9l6-4 6 4v11M10 20v-5h4v5M9.5 11h5"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 0 0-13 0c0 5.4 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>',
    flower: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="2"/><path d="M12 10c-2-3-1-6 0-7 1 1 2 4 0 7zM14 12c3-2 6-1 7 0-1 1-4 2-7 0zM12 14c2 3 1 6 0 7-1-1-2-4 0-7zM10 12c-3 2-6 1-7 0 1-1 4-2 7 0z"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M6 3.5h9l3 3V20.5H6z"/><path d="M9 11h6M9 14.5h6"/></svg>'
  };
  function renderDetails() {
    var d = T().d, rows = [
      ['cal', d.date, dateLong()], ['day', d.day, dayName()],
      ['rings', d.ceremony, L(CFG.ceremonyTime) || (when ? timeStr() : '')], ['clock', d.reception, L(CFG.receptionTime)],
      ['bld', d.venue, L(CFG.venueName)], ['pin', d.address, L(CFG.venueAddress)], ['flower', d.city, L(CFG.venueCity)]
    ];
    if (L(CFG.notes)) rows.push(['note', d.notes, L(CFG.notes)]);
    $('#detailCards').innerHTML = rows.map(function (r) {
      return '<article class="dcard reveal">' + ICONS[r[0]] + '<h3>' + esc(r[1]) + '</h3><p' + (r[2] ? '' : ' class="empty"') + '>' + esc(r[2] || ph()) + '</p></article>';
    }).join('');
    observe();
  }

  /* ---------------- القصة ---------------- */
  function renderTimeline() {
    $('#timeline').innerHTML = CFG.timeline.map(function (m, i) {
      return '<li class="tl-item reveal" style="transition-delay:' + Math.min(i * 90, 270) + 'ms"><span class="tl-dot" aria-hidden="true"></span><div class="tl-body"><span class="tl-date">' + esc(L(m.date)) + '</span><h3 class="tl-title">' + esc(L(m.title)) + '</h3><p class="tl-text">' + esc(L(m.text)) + '</p>' + (m.photo ? '<img class="tl-photo" src="' + esc(m.photo) + '" alt="' + esc(L(m.title)) + '" loading="lazy">' : '') + '</div></li>';
    }).join('');
    observe();
  }

  /* ---------------- المكان + الخريطة ---------------- */
  function mapQuery() {
    var m = CFG.map || {};
    if (m.lat !== '' && m.lng !== '' && !isNaN(parseFloat(m.lat)) && !isNaN(parseFloat(m.lng))) return parseFloat(m.lat) + ',' + parseFloat(m.lng);
    if (m.query) return m.query;
    return '';
  }
  function renderVenue() {
    var q = mapQuery(), btn = $('#dirBtn'), hint = $('#dirHint'), box = $('#mapBox');
    var img = $('#venueImgTag'), phd = $('#venuePh');
    if (CFG.venueImage) { img.src = CFG.venueImage; img.alt = T().alt.venue; img.hidden = false; phd.hidden = true; img.onerror = function () { img.hidden = true; phd.hidden = false; }; }
    if (q) {
      btn.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
      btn.removeAttribute('aria-disabled'); hint.hidden = true;
      box.hidden = false;
      var src = 'https://maps.google.com/maps?q=' + encodeURIComponent(q) + '&hl=' + lang + '&z=15&output=embed';
      if (!box.firstChild || box.firstChild.getAttribute('data-src') !== src) box.innerHTML = '<iframe data-src="' + src + '" src="' + src + '" title="' + esc(T().mapTitle) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
    } else {
      btn.removeAttribute('href'); btn.setAttribute('aria-disabled', 'true');
      hint.hidden = false; hint.textContent = T().noLocation; box.hidden = true;
    }
  }

  /* ---------------- اللباس ---------------- */
  function renderDress() {
    var dc = CFG.dressCode, t = T(), sec = $('#dress');
    if (!L(dc.title)) { sec.hidden = true; return; }
    sec.hidden = false;
    $('#dressMain').textContent = L(dc.title);
    var items = ['colors', 'formality', 'setting', 'footwear'].filter(function (k) { return L(dc[k]); });
    $('#dressList').innerHTML = items.map(function (k) { return '<div><dt>' + esc(t.dress[k]) + '</dt><dd>' + esc(L(dc[k])) + '</dd></div>'; }).join('');
  }

  /* ---------------- العد التنازلي ---------------- */
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function updateCountdown() {
    var cd = $('#cd'), msg = $('#cdMsg'), t = T();
    clearTimeout(cdTimer);
    if (!when) { cd.classList.add('off'); $$('#cd b').forEach(function (b) { b.textContent = '--'; }); msg.textContent = t.cdNoDate; return; }
    cd.classList.remove('off');
    var diff = when.getTime() - Date.now();
    var end = when.getTime() + (CFG.durationHours || 5) * 3600e3;
    if (diff <= 0) {
      cd.hidden = true; $$('#cd b').forEach(function (b) { b.textContent = '00'; });
      msg.textContent = Date.now() < end ? t.cdToday : t.cdAfter; return;
    }
    cd.hidden = false; msg.textContent = '';
    var s = Math.floor(diff / 1000);
    $('#cdD').textContent = pad(Math.floor(s / 86400));
    $('#cdH').textContent = pad(Math.floor(s % 86400 / 3600));
    $('#cdM').textContent = pad(Math.floor(s % 3600 / 60));
    $('#cdS').textContent = pad(s % 60);
    cdTimer = setTimeout(updateCountdown, 1000 - (Date.now() % 1000));
  }

  /* ---------------- حفظ الموعد (ICS) ---------------- */
  function icsDate(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function icsEsc(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  function saveDate() {
    var hint = $('#saveHint');
    if (!when) { hint.hidden = false; hint.textContent = T().saveNeedsDate; return; }
    hint.hidden = true;
    var end = new Date(when.getTime() + (CFG.durationHours || 5) * 3600e3);
    var title = (L(CFG.brideName) + ' & ' + L(CFG.groomName)).replace(/[\[\]]/g, '');
    var loc = [L(CFG.venueName), L(CFG.venueAddress), L(CFG.venueCity)].filter(Boolean).join(', ');
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      'UID:' + when.getTime() + '@wedding-invitation', 'DTSTAMP:' + icsDate(new Date()), 'DTSTART:' + icsDate(when), 'DTEND:' + icsDate(end),
      'SUMMARY:' + icsEsc((lang === 'ar' ? 'حفل زفاف ' : 'Wedding of ') + title)];
    if (loc) lines.push('LOCATION:' + icsEsc(loc));
    lines.push('END:VEVENT', 'END:VCALENDAR');
    var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'wedding.ics';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  /* ---------------- المعرض + Lightbox ---------------- */
  var lbIndex = 0, lbOpener = null, lbEl = null;
  function renderGallery() {
    var sec = $('#gallery'), grid = $('#galleryGrid'), items = CFG.gallery || [];
    if (!CFG.galleryEnabled && CFG.galleryEnabled === false) { sec.hidden = true; return; }
    if (items.length) {
      grid.innerHTML = items.map(function (g, i) {
        return '<button type="button" class="g reveal" data-i="' + i + '" aria-label="' + esc(T().photoOf + ' ' + (i + 1)) + '"><img src="' + esc(g.src) + '" alt="' + esc(L(g.alt) || T().alt.gallery) + '" ' + (i < 2 ? '' : 'loading="lazy" ') + 'decoding="async"></button>';
      }).join('');
      $$('.g', grid).forEach(function (b) { b.addEventListener('click', function () { openLb(+b.getAttribute('data-i'), b); }); });
    } else {
      var f = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="1.8"/><path d="M12 10c-2-3-1-6 0-7 1 1 2 4 0 7zM14 12c3-2 6-1 7 0-1 1-4 2-7 0zM12 14c2 3 1 6 0 7-1-1-2-4 0-7zM10 12c-3 2-6 1-7 0 1-1 4-2 7 0z"/></svg>';
      grid.innerHTML = [0, 1, 2, 3, 4, 5].map(function () { return '<div class="g ph reveal" aria-hidden="true"><div>' + f + '<small>' + esc(T().galleryPh) + '</small></div></div>'; }).join('');
    }
    observe();
  }
  function openLb(i, opener) {
    lbIndex = i; lbOpener = opener;
    lbEl = document.createElement('div'); lbEl.className = 'lb'; lbEl.setAttribute('role', 'dialog'); lbEl.setAttribute('aria-modal', 'true'); lbEl.setAttribute('aria-label', T().galleryTitle);
    lbEl.innerHTML = '<button type="button" class="x" aria-label="' + esc(T().close) + '">&times;</button><button type="button" class="pv" aria-label="' + esc(T().prev) + '">&#8249;</button><img alt=""><button type="button" class="nx" aria-label="' + esc(T().next) + '">&#8250;</button><div class="ct" aria-live="polite"></div>';
    document.body.appendChild(lbEl); document.body.style.overflow = 'hidden';
    lbEl.addEventListener('click', function (e) { if (e.target === lbEl) closeLb(); });
    $('.x', lbEl).onclick = closeLb; $('.pv', lbEl).onclick = function () { stepLb(-1); }; $('.nx', lbEl).onclick = function () { stepLb(1); };
    var sx = null;
    lbEl.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lbEl.addEventListener('touchend', function (e) { if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) stepLb(dx < 0 ? 1 : -1); sx = null; });
    showLb(); requestAnimationFrame(function () { lbEl.classList.add('open'); $('.x', lbEl).focus(); });
    document.addEventListener('keydown', lbKey);
  }
  function showLb() { var g = CFG.gallery[lbIndex], im = $('img', lbEl); im.src = g.src; im.alt = L(g.alt) || T().alt.gallery; $('.ct', lbEl).textContent = (lbIndex + 1) + ' ' + T().of + ' ' + CFG.gallery.length; }
  function stepLb(d) { lbIndex = (lbIndex + d + CFG.gallery.length) % CFG.gallery.length; showLb(); }
  function lbKey(e) {
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') stepLb(-1); else if (e.key === 'ArrowRight') stepLb(1);
    else if (e.key === 'Tab') { var f = $$('button', lbEl), i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
  }
  function closeLb() {
    if (!lbEl) return; document.removeEventListener('keydown', lbKey);
    var el = lbEl; lbEl = null; el.classList.remove('open'); document.body.style.overflow = '';
    setTimeout(function () { el.remove(); }, 300); if (lbOpener) lbOpener.focus();
  }

  /* ---------------- الموسيقى ---------------- */
  var audio = $('#audio');
  function renderMusicLabels() { var b = $('#musicBtn'); b.setAttribute('aria-label', b.getAttribute('aria-pressed') === 'true' ? T().musicPause : T().musicPlay); $('#musicVol').setAttribute('aria-label', T().volume); }
  function initMusic() {
    if (!CFG.musicSrc) return;
    audio.src = CFG.musicSrc;
    audio.addEventListener('error', function () { $('#music').hidden = true; });
    $('#music').hidden = false;
    audio.volume = 0.6;
    $('#musicBtn').addEventListener('click', function () {
      var b = this;
      if (audio.paused) { audio.play().then(function () { b.setAttribute('aria-pressed', 'true'); renderMusicLabels(); try { sessionStorage.setItem('wedding-music', '1'); } catch (e) {} }).catch(function () {}); }
      else { audio.pause(); b.setAttribute('aria-pressed', 'false'); renderMusicLabels(); try { sessionStorage.setItem('wedding-music', '0'); } catch (e) {} }
    });
    $('#musicVol').addEventListener('input', function () { audio.volume = +this.value; });
  }

  /* ---------------- RSVP ---------------- */
  function renderRsvpTexts() {
    var r = CFG.rsvp, sec = $('#rsvp'); sec.hidden = !r.enabled;
    $('#guestsField').hidden = !r.allowGuestCount; $('#rGuests').max = r.maxGuests || 6;
    $('#dietField').hidden = !r.askDietary; $('#contactField').hidden = !r.askContact;
    var dn = $('#demoNote'); dn.hidden = !!r.endpoint; dn.textContent = T().rsvpDemo;
    $$('a[href="#rsvp"]').forEach(function (a) { a.hidden = !r.enabled; });
  }
  function initRsvp() {
    var form = $('#rsvpForm'), r = CFG.rsvp;
    var sentKey = 'wedding-rsvp-sent';
    function fieldErr(id, msg, inputSel) { $('#' + id).textContent = msg || ''; var f = $('#' + id).closest('.field'); if (f) f.classList.toggle('invalid', !!msg); }
    $$('input[name=attendance]', form).forEach(function (i) { i.addEventListener('change', function () { var dec = i.value === 'decline' && i.checked; if (r.allowGuestCount) $('#guestsField').hidden = dec; fieldErr('eAtt', ''); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var t = T(); var ok = true;
      var name = $('#rName').value.trim(), att = ($('input[name=attendance]:checked', form) || {}).value;
      var guests = parseInt($('#rGuests').value, 10);
      fieldErr('eName', name.length < 2 ? t.err.name : ''); if (name.length < 2) ok = false;
      fieldErr('eAtt', att ? '' : t.err.attendance); if (!att) ok = false;
      if (r.allowGuestCount && att === 'accept' && !(guests >= 1 && guests <= (r.maxGuests || 6))) { fieldErr('eGuests', t.err.guests); ok = false; } else fieldErr('eGuests', '');
      $('#eForm').textContent = '';
      if (!ok) { var first = $('.invalid input, #eAtt:not(:empty)', form); if (first && first.scrollIntoView) first.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); return; }
      if ($('.hp', form).value) return; // روبوت
      try { if (localStorage.getItem(sentKey)) { $('#eForm').textContent = t.err.dup; return; } } catch (x) {}
      var payload = { name: name, attendance: att, guests: att === 'accept' && r.allowGuestCount ? guests : 0, message: $('#rMsg').value.trim(), dietary: r.askDietary ? $('#rDiet').value.trim() : '', contact: r.askContact ? $('#rContact').value.trim() : '', lang: lang, invitation: new URLSearchParams(location.search).get('g') || '' };
      var btn = $('#rSubmit'); btn.disabled = true; btn.textContent = t.f.sending;
      function done(real) {
        btn.disabled = false; btn.textContent = T().f.submit;
        form.hidden = true; var d = $('#rsvpDone'); d.hidden = false;
        $('#doneTitle').textContent = real ? T().rsvpOkTitle : T().rsvpOkTitle;
        $('#doneText').textContent = real ? T().rsvpOk : T().rsvpDemoDone;
        d.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
        if (real) { try { localStorage.setItem(sentKey, '1'); } catch (x) {} }
      }
      if (!r.endpoint) { setTimeout(function () { done(false); }, 400); return; }
      fetch(r.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
        .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); done(true); })
        .catch(function () { btn.disabled = false; btn.textContent = T().f.submit; $('#eForm').textContent = T().err.server; });
    });
  }

  /* ---------------- تحية شخصية (اختيارية) ---------------- */
  function initGreeting() {
    var p = CFG.personalization; if (!p || !p.enabled || !p.endpoint) return;
    var token = new URLSearchParams(location.search).get('g'); if (!token) return;
    fetch(p.endpoint + encodeURIComponent(token), { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) {
        if (!j || !j.name) return;
        var g = $('#greeting'); g.innerHTML = '<span>' + esc(T().dear) + '</span> <b>' + esc(String(j.name).slice(0, 80)) + '</b>' + esc(T().greetLine);
        g.hidden = false;
        if (!$('#rName').value) $('#rName').value = String(j.name).slice(0, 80);
      }).catch(function () {});
  }

  /* ---------------- التنقل ---------------- */
  function initNav() {
    var nav = $('#nav'), mb = $('#menuBtn'), mn = $('#mobileNav'), top = $('#toTop');
    function onScroll() { var y = window.scrollY; nav.classList.toggle('solid', y > 60); top.hidden = false; top.classList.toggle('show', y > 700); }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    function setMenu(open) {
      mb.setAttribute('aria-expanded', open); mb.setAttribute('aria-label', open ? T().menuClose : T().menuOpen); nav.classList.toggle('menu-open', open);
      if (open) { mn.hidden = false; requestAnimationFrame(function () { mn.classList.add('open'); }); document.body.style.overflow = 'hidden'; $('a', mn).focus(); }
      else { mn.classList.remove('open'); document.body.style.overflow = ''; setTimeout(function () { if (mb.getAttribute('aria-expanded') !== 'true') mn.hidden = true; }, 350); }
    }
    mb.addEventListener('click', function () { setMenu(mb.getAttribute('aria-expanded') !== 'true'); });
    $$('a', mn).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mb.getAttribute('aria-expanded') === 'true') { setMenu(false); mb.focus(); } });
    window.matchMedia('(min-width: 861px)').addEventListener && window.matchMedia('(min-width: 861px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
    if (!reduce) window.addEventListener('scroll', function () { var h = $('#heroBg'); if (h && window.scrollY < window.innerHeight) h.style.transform = 'translate3d(0,' + (window.scrollY * 0.18).toFixed(1) + 'px,0)'; }, { passive: true });
  }

  /* ---------------- ظهور تدريجي ---------------- */
  var io = null;
  function observe() {
    if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(function (n) { n.classList.add('in'); }); return; }
    if (!io) io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal:not(.in)').forEach(function (n) { io.observe(n); });
  }

  /* ---------------- البوابة ---------------- */
  var gate = $('#gate'), site = $('#site');
  function enterSite() {
    opened = true; site.hidden = false;
    document.body.classList.remove('is-gate');
    requestAnimationFrame(function () { requestAnimationFrame(function () { site.classList.add('show'); observe(); }); });
    window.scrollTo(0, 0);
    gate.classList.add('gone');
    setTimeout(function () { gate.hidden = true; }, 1400);
    var firstReveal = $('.hero-in'); if (firstReveal) setTimeout(function () { firstReveal.classList.add('in'); }, 120);
  }
  function openGate() {
    if (gate.classList.contains('opening')) return;
    try { sessionStorage.setItem('wedding-gate', '1'); } catch (e) {}
    if (reduce) { enterSite(); return; }
    gate.classList.add('opening');
    setTimeout(enterSite, 4300);
  }
  function initGate() {
    var already = false;
    try { already = sessionStorage.getItem('wedding-gate') === '1'; } catch (e) {}
    if (already) { gate.classList.add('instant'); enterSite(); gate.hidden = true; return; }
    $('#gateOpen').addEventListener('click', openGate);
    $('#gateStage').addEventListener('click', openGate);
    $('#gateStage').style.cursor = 'pointer';
    var gl = $('#gateLang'); if (gl) gl.addEventListener('click', function (e) { e.stopPropagation(); switchLang(); });
    // مهلة أمان: إذا ما اشتغلت الحركات بنوصل للزر مباشرة
    setTimeout(function () { var b = $('#gateOpen'); if (b && getComputedStyle(b).opacity === '0') { b.style.opacity = 1; b.style.animation = 'none'; } }, 6500);
  }
  function switchLang() {
    var list = CFG.availableLanguages; if (list.length < 2) return;
    lang = list[(list.indexOf(lang) + 1) % list.length];
    try { localStorage.setItem('wedding-lang', lang); } catch (e) {}
    applyText();
  }

  /* ---------------- تشغيل ---------------- */
  function boot() {
    applyText(); initNav(); initMusic(); initRsvp(); initGreeting(); initGate();
    $('#saveDate').addEventListener('click', saveDate);
    $('#langBtn').addEventListener('click', switchLang);
    if (CFG.heroImage) $('#heroBg').style.backgroundImage = 'linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0)), url("' + CFG.heroImage + '")';
    if (CFG.closingImage) $('#closingBg').style.backgroundImage = 'url("' + CFG.closingImage + '")';
    observe();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
