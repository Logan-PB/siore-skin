/* SIORÉ 상담 링크 (2026-11-03)
   1) 1단계 '얼굴 부위로 고르기' — 사진 위 부위를 누르고 고민을 고르면 기존 고민 카드(data-concern)를 그대로 눌러
      선택 순서·최대 3개 규칙·추천 로직을 그대로 사용한다.
   2) 결과 '아침은 가볍게, 집중 케어는 밤에' — 코어 추천을 아침 기본(메이크업 전) + 밤 나이트 케어 추가로 나눠 보여준다.
   추천 로직(script.js, products.json)은 건드리지 않는다. */
(function () {
  'use strict';
  var Q = function (ko, en, zh, ja) { return { ko: ko, en: en, zh: zh, ja: ja }; };
  function lang() { try { return languageMode || 'ko'; } catch (e) { return 'ko'; } }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function T(m) { try { if (typeof bilingual === 'function') return bilingual(m); } catch (e) {} return esc(m[lang()] || m.ko); }
  function P(m) { return esc(m[lang()] || m.ko); }
  function selected() { try { return selectedConcerns.slice(); } catch (e) { return []; } }
  function $(s, r) { return (r || document).querySelector(s); }

  /* ---------- 1. 얼굴 부위로 고르기 ---------- */
  var C = {
    sebum: { v: '피지', l: Q('번들거림', 'Oiliness', '出油', 'テカリ') },
    blemish: { v: '트러블', l: Q('뾰루지', 'Breakouts', '痘痘', 'ニキビ') },
    firm: { v: '안티에이징', l: Q('잔주름·탄력', 'Fine lines · firmness', '细纹·弹力', '小じわ・ハリ') },
    firm2: { v: '안티에이징', l: Q('탄력 저하', 'Loss of firmness', '弹力下降', 'ハリ不足') },
    texture: { v: '각질', l: Q('각질·피부결', 'Flakes · texture', '角质·肤质', '角質・キメ') },
    dry: { v: '건조', l: Q('당김·건조', 'Tight · dry', '紧绷·干燥', 'つっぱり・乾燥') },
    red: { v: '열감홍조', l: Q('붉은기·열감', 'Redness · heat', '泛红·发热', '赤み・火照り') },
    dull: { v: '광채톤업', l: Q('칙칙함·톤', 'Dullness · tone', '暗沉·肤色', 'くすみ・トーン') },
    sens: { v: '민감', l: Q('예민·따가움', 'Sensitive · stinging', '敏感·刺痛', '敏感・ヒリつき') },
    barrier: { v: '장벽회복', l: Q('외부 자극에 불편', 'Easily irritated', '易受刺激', '刺激に弱い') }
  };
  var ZONES = [
    { id: 'forehead', l: Q('이마', 'Forehead', '额头', 'おでこ'), pins: [[49, 24]], ring: null, chips: ['sebum', 'blemish', 'firm', 'texture'] },
    { id: 'eyes', l: Q('눈가', 'Eye area', '眼周', '目元'), pins: [[17.5, 40.5], [81.5, 40.5]], ring: null, chips: ['firm', 'dry'] },
    { id: 'nose', l: Q('코·T존', 'Nose · T-zone', '鼻子·T区', '鼻・Tゾーン'), pins: [[48.5, 53]], ring: null, chips: ['sebum', 'blemish', 'texture'] },
    { id: 'cheek', l: Q('볼', 'Cheeks', '脸颊', '頬'), pins: [[29, 58], [68.5, 58]], ring: null, chips: ['dry', 'red', 'dull', 'sens'] },
    { id: 'mouth', l: Q('입가·턱', 'Mouth · jaw', '嘴角·下巴', '口元・あご'), pins: [[48.5, 75]], ring: null, chips: ['firm2', 'dry', 'blemish'] },
    { id: 'whole', l: Q('얼굴 전체', 'Whole face', '全脸', '顔全体'), pins: [], ring: null, chips: ['dull', 'sens', 'barrier', 'dry'] }
  ];

  /* 얼굴 부위 안내 — 선 일러스트 (viewBox 300×400, 부위 영역을 실제 위치에 맞춤) */
  function FACE_SVG(zcls) {
    var Z = function (id, d) { return '<path class="' + zcls(id) + '" data-zone="' + id + '" d="' + d + '"/>'; };
    return '<svg viewBox="0 0 300 400" aria-hidden="true">' +
      '<defs><radialGradient id="zpBg" cx="50%" cy="42%" r="70%"><stop offset="0" stop-color="#fffaf6"/><stop offset=".65" stop-color="#f6ece5"/><stop offset="1" stop-color="#eee0d6"/></radialGradient>' +
      '<linearGradient id="zpSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdf3ec"/><stop offset="1" stop-color="#f6e4d9"/></linearGradient></defs>' +
      '<rect width="300" height="400" fill="url(#zpBg)"/>' +
      '<circle cx="150" cy="190" r="168" fill="none" stroke="#d9c2b3" stroke-width=".5" opacity=".55"/><circle cx="150" cy="190" r="150" fill="none" stroke="#d9c2b3" stroke-width=".4" stroke-dasharray="1 5" opacity=".7"/>' +
      '<path d="M118 324 C119 346 112 362 74 376 C48 384 30 392 22 400 L278 400 C270 392 252 384 230 376 C188 362 181 346 182 324" fill="url(#zpSkin)" stroke="#c9a896" stroke-width="1"/>' +
      '<path d="M50 172 C42 168 38 186 44 204 C48 216 54 220 58 214" fill="url(#zpSkin)" stroke="#c9a896" stroke-width="1"/><path d="M250 172 C258 168 262 186 256 204 C252 216 246 220 242 214" fill="url(#zpSkin)" stroke="#c9a896" stroke-width="1"/>' +
      '<path d="M150 58 C215 58 250 108 250 172 C250 236 228 290 190 318 C174 330 162 336 150 336 C138 336 126 330 110 318 C72 290 50 236 50 172 C50 108 85 58 150 58 Z" fill="url(#zpSkin)" stroke="#b98f7b" stroke-width="1.2"/>' +
      '<path d="M54 150 C50 74 104 30 150 30 C196 30 250 74 246 150 C240 104 206 70 150 66 C94 70 60 104 54 150 Z" fill="#4a332b" opacity=".82"/>' +
      Z('forehead', 'M88 126 C86 96 114 80 150 80 C186 80 214 96 212 126 C186 134 114 134 88 126 Z') +
      Z('eyes', 'M84 170 C92 154 136 152 142 168 C136 186 92 188 84 170 Z M158 168 C164 152 208 154 216 170 C208 188 164 186 158 168 Z') +
      Z('nose', 'M139 144 L161 144 L166 230 C160 242 140 242 134 230 Z') +
      Z('cheek', 'M70 192 C78 186 112 194 126 206 C132 226 128 250 112 262 C92 266 76 252 70 234 C66 220 66 202 70 192 Z M230 192 C222 186 188 194 174 206 C168 226 172 250 188 262 C208 266 224 252 230 234 C234 220 234 202 230 192 Z') +
      Z('mouth', 'M110 256 C124 248 176 248 190 256 C196 282 180 314 150 324 C120 314 104 282 110 256 Z') +
      '<g fill="none" stroke="#8c6555" stroke-width="1.5" stroke-linecap="round">' +
        '<path d="M92 150 C104 140 124 140 136 148"/><path d="M164 148 C176 140 196 140 208 150"/>' +
        '<path d="M96 172 C106 162 124 162 132 172 C124 178 106 178 96 172 Z"/><path d="M168 172 C176 162 194 162 204 172 C194 178 176 178 168 172 Z"/>' +
        '<path d="M151 176 C149 196 146 214 142 224 C146 232 156 232 160 226" stroke-width="1.2"/>' +
        '<path d="M126 268 C138 262 146 264 150 266 C154 264 162 262 174 268 C164 282 136 282 126 268 Z" stroke="#b4796b" stroke-width="1.3"/><path d="M128 268 C140 271 160 271 172 268" stroke="#b4796b" stroke-width="1"/>' +
      '</g>' +
      '<circle cx="114" cy="171" r="4.6" fill="#5a3d33"/><circle cx="186" cy="171" r="4.6" fill="#5a3d33"/><circle cx="115.5" cy="169.5" r="1.3" fill="#fff"/><circle cx="187.5" cy="169.5" r="1.3" fill="#fff"/>' +
    '</svg>';
  }

  var MODE_KEY = 'siore-concern-pick-mode';
  var mode = 'zone', activeZone = 'cheek', picker = null;
  try { mode = localStorage.getItem(MODE_KEY) || 'zone'; } catch (e) {}

  var origin = {}; /* 고민 → 그 고민을 고른 부위 (부위 화면에서 고른 경우만) */
  function zoneHasSelection(z) {
    var s = selected();
    return Object.keys(origin).some(function (v) { return origin[v] === z.id && s.indexOf(v) > -1; });
  }
  function toggleConcern(value) {
    var card = document.querySelector('[data-concern="' + value + '"]');
    if (!card) return;
    var before = selected().length, was = selected().indexOf(value) > -1;
    card.click();
    var now = selected().indexOf(value) > -1;
    if (now && !was) origin[value] = activeZone; else if (!now) delete origin[value];
    render();
    if (!was && before >= 3 && selected().indexOf(value) < 0) flash();
  }
  function flash() {
    var n = picker && picker.querySelector('.zp-limit');
    if (!n) return;
    n.classList.add('show');
    clearTimeout(flash.t); flash.t = setTimeout(function () { n.classList.remove('show'); }, 2200);
  }
  function concernName(value) {
    try { var m = concernLabel(value); if (m && m.ko) return m; } catch (e) {}
    return Q(value, value, value, value);
  }
  function render() {
    if (!picker) return;
    var s = selected();
    var z = ZONES.filter(function (x) { return x.id === activeZone; })[0] || ZONES[0];
    var ring = function (r, on) { return '<span class="zp-ring' + (on ? ' on' : '') + '" aria-hidden="true" style="left:' + r[0] + '%;top:' + r[1] + '%;width:' + r[2] + '%;height:' + r[3] + '%"></span>'; };
    var zcls = function (id) { var x = ZONES.filter(function (q) { return q.id === id; })[0]; return 'zp-z' + (activeZone === id || activeZone === 'whole' ? ' on' : '') + (x && zoneHasSelection(x) ? ' picked' : ''); };
    var photo = '<div class="zp-photo zp-real"><img src="images/consult/zone-face.jpg?v=1" alt="' + P(Q('얼굴 부위 안내 모델 사진', 'Face area guide', '面部区域示意', '顔の部位ガイド')) + '">';
    ZONES.forEach(function (x) {
      x.pins.forEach(function (p) {
        var cls = 'zp-pin' + (x.id === activeZone ? ' active' : '') + (zoneHasSelection(x) ? ' picked' : '');
        photo += '<button type="button" class="' + cls + '" data-zone="' + x.id + '" aria-pressed="' + (x.id === activeZone) + '" style="left:' + p[0] + '%;top:' + p[1] + '%">' + P(x.l) + '</button>';
      });
    });
    photo += '</div>';
    var whole = ZONES[5];
    var chips = z.chips.map(function (k) {
      var on = s.indexOf(C[k].v) > -1, idx = s.indexOf(C[k].v);
      return '<button type="button" class="zp-chip' + (on ? ' on' : '') + '" data-zp-concern="' + C[k].v + '" aria-pressed="' + on + '">' + (on ? '<b>' + (idx + 1) + '</b>' : '') + '<span>' + T(C[k].l) + '</span></button>';
    }).join('');
    var list = s.length ? s.map(function (v, i) {
      return '<li><b>' + (i + 1) + '</b><span>' + T(concernName(v)) + '</span><button type="button" class="zp-x" data-zp-concern="' + esc(v) + '" aria-label="' + P(Q('선택 취소', 'Remove', '取消', '取り消し')) + '">×</button></li>';
    }).join('') : '<li class="zp-empty">' + T(Q('아직 선택한 고민이 없어요', 'No concerns selected yet', '尚未选择困扰', 'まだ選択していません')) + '</li>';
    picker.innerHTML =
      '<div class="zp-left">' + photo +
        '<button type="button" class="zp-whole' + (activeZone === 'whole' ? ' active' : '') + (zoneHasSelection(whole) ? ' picked' : '') + '" data-zone="whole">' + T(whole.l) + '</button>' +
      '</div>' +
      '<div class="zp-right">' +
        '<div class="zp-head"><span class="zp-kicker">' + P(Q('선택한 부위', 'Selected area', '已选部位', '選んだ部位')) + '</span><h3>' + T(z.l) + '</h3><p>' + T(Q('신경 쓰이는 고민을 눌러주세요. 전체 최대 3개까지 순서대로 반영돼요.', 'Tap what bothers you. Up to 3 in total, in order of priority.', '请选择困扰，共最多3个，按顺序反映。', '気になる悩みを選んでください。全体で最大3つ、順番に反映します。')) + '</p></div>' +
        '<div class="zp-chips">' + chips + '</div>' +
        '<p class="zp-limit" role="status">' + T(Q('고민은 최대 3개까지 고를 수 있어요. 아래에서 하나를 빼고 다시 눌러주세요.', 'Up to 3 concerns. Remove one below, then try again.', '最多选择3个，请先删除一个。', '最大3つまでです。下で1つ外してから選んでください。')) + '</p>' +
        '<div class="zp-picked"><span class="zp-kicker">' + P(Q('고른 고민 · 우선순위', 'Your concerns · priority', '已选困扰 · 优先顺序', '選んだ悩み・優先順位')) + '</span><ol>' + list + '</ol></div>' +
      '</div>';
  }
  function applyMode() {
    var layout = $('#step1 .concern-layout'), bar = $('#step1 .zp-mode');
    if (!layout || !picker) return;
    layout.classList.toggle('zone-mode', mode === 'zone');
    if (bar) [].forEach.call(bar.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', String(b.dataset.zpMode === mode)); });
    if (mode === 'zone') render();
  }
  function renderModeBar() {
    var bar = $('#step1 .zp-mode'); if (!bar) return;
    bar.innerHTML =
      '<button type="button" data-zp-mode="zone">' + T(Q('얼굴 부위로 고르기', 'Pick by face area', '按面部区域选择', '顔の部位で選ぶ')) + '</button>' +
      '<button type="button" data-zp-mode="list">' + T(Q('고민 목록으로 고르기', 'Pick from list', '从列表选择', 'リストから選ぶ')) + '</button>';
    applyMode();
  }
  function initZonePicker() {
    var layout = $('#step1 .concern-layout');
    if (!layout || $('#step1 .zone-picker')) return;
    var bar = document.createElement('div'); bar.className = 'zp-mode'; bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', '고민 선택 방식');
    layout.parentNode.insertBefore(bar, layout);
    picker = document.createElement('div'); picker.className = 'zone-picker';
    layout.insertBefore(picker, layout.firstChild);
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-zp-mode]'); if (!b) return;
      mode = b.dataset.zpMode; try { localStorage.setItem(MODE_KEY, mode); } catch (er) {}
      applyMode();
    });
    picker.addEventListener('click', function (e) {
      var zb = e.target.closest('[data-zone]');
      if (zb) { activeZone = zb.dataset.zone; render(); return; }
      var cb = e.target.closest('[data-zp-concern]');
      if (cb) toggleConcern(cb.dataset.zpConcern);
    });
    layout.addEventListener('click', function (e) { if (e.target.closest('.concern-card')) setTimeout(render, 0); });
    renderModeBar();
  }

  /* ---------- 2. 아침 기본 + 밤 나이트 케어 ---------- */
  var TIP = {
    cleansing: Q('메이크업·선크림을 부드럽게 지워요', 'Gently removes makeup and sunscreen', '温和卸除彩妆与防晒', 'メイクと日焼け止めをやさしく落とします'),
    bubbleToner: Q('거품을 손바닥에 덜어 가볍게 눌러 흡수', 'Press the foam in gently with your palms', '取适量泡沫，用掌心轻压吸收', '泡を手のひらで軽く押さえてなじませます'),
    essenceToner: Q('손바닥으로 가볍게 눌러 흡수', 'Press in gently with your palms', '用掌心轻压吸收', '手のひらで軽く押さえてなじませます'),
    serum: Q('신경 쓰이는 부위 위주로 2~3방울', '2–3 drops on your focus areas', '在在意部位使用2~3滴', '気になる部分を中心に2〜3滴'),
    repairAmpoule: Q('불편한 부위 위주로 2~3방울', '2–3 drops where skin feels uneasy', '在不适部位使用2~3滴', '気になる部分に2〜3滴'),
    soothingCream: Q('얇게 펴 바르고 1분 뒤 선크림', 'Apply thinly, sunscreen after a minute', '薄涂一层，1分钟后涂防晒', '薄くのばし、1分後に日焼け止め'),
    soothingGel: Q('얇게 펴 발라 산뜻하게 마무리', 'Apply thinly for a fresh finish', '薄涂，清爽收尾', '薄くのばしてさっぱり仕上げ'),
    richCream: Q('마지막에 넉넉하게 덮어 마무리', 'Finish with a generous layer', '最后厚涂收尾', '最後にたっぷり重ねて仕上げ'),
    comfortCream: Q('마지막에 넉넉하게 덮어 마무리', 'Finish with a generous layer', '最后厚涂收尾', '最後にたっぷり重ねて仕上げ')
  };
  function products() { return window.SIORE_PRODUCTS || {}; }
  function pName(key) {
    var p = products()[key] || {}; var l = lang();
    var n = (l !== 'ko' && p.i18n && p.i18n[l] && p.i18n[l].name) || p.name || key;
    return n;
  }
  function pImg(key) {
    try { if (typeof solutionAssets !== 'undefined' && solutionAssets[key]) return 'product-guide/products/' + solutionAssets[key] + '.png'; } catch (e) {}
    return (products()[key] || {}).image || '';
  }
  function coreKeys() {
    var panel = $('.solution-sheet [data-rx-panel="core"]');
    if (!panel) return [];
    var seen = {};
    return [].map.call(panel.querySelectorAll('.rx-products [data-ref-product]'), function (b) { return b.dataset.refProduct; })
      .filter(function (k) { if (seen[k]) return false; seen[k] = 1; return !!products()[k]; });
  }
  function plan() {
    var ps = products(), core = coreKeys(); if (!core.length) return null;
    var g = function (k) { return (ps[k] || {}).routineGroup; };
    var toner = core.filter(function (k) { return g(k) === 'toner'; })[0] || 'bubbleToner';
    var treat = core.filter(function (k) { return g(k) === 'treatment'; })[0] || null;
    var creams = core.filter(function (k) { return g(k) === 'moisturizer'; });
    var isLight = function (k) { return k === 'soothingCream' || k === 'soothingGel'; };
    var light = creams.filter(isLight)[0] || 'soothingCream';
    var heavy = creams.filter(function (k) { return !isLight(k); })[0] || null;
    var morning = [toner, light];
    var night = [{ k: 'cleansing', add: true }, { k: toner, same: true }];
    if (treat) night.push({ k: treat, add: true });
    if (heavy) night.push({ k: heavy, add: true }); else night.push({ k: light, same: true });
    var keys = {}; morning.concat(night.map(function (x) { return x.k; })).forEach(function (k) { keys[k] = 1; });
    return { morning: morning, night: night, adds: night.filter(function (x) { return x.add; }).length, total: Object.keys(keys).length };
  }
  function row(key, step, tag, tone) {
    return '<li class="dn-row' + (tag ? ' is-add' : '') + '"><img src="' + esc(pImg(key)) + '" alt="" loading="lazy">' +
      '<div><small class="' + tone + '">' + step + '</small><b>' + esc(pName(key)) + '</b><span>' + P(TIP[key] || Q('', '', '', '')) + '</span></div>' +
      (tag ? '<em>' + P(tag) + '</em>' : '') + '</li>';
  }
  function renderDayNight() {
    var sheet = $('.solution-sheet'); if (!sheet) return;
    var anchor = sheet.querySelector('.rx-overview .why-card') || sheet.querySelector('.rx-overview .rx-matrix');
    if (!anchor) return;
    var pl = plan(); if (!pl) return;
    var old = sheet.querySelector('.dn-routine'); if (old) old.remove();
    var STEP = function (n) { return 'STEP ' + n; };
    var SAME = Q('아침과 같아요', 'Same as morning', '与早晨相同', '朝と同じ');
    var ADD = Q('추가', 'Add', '追加', '追加');
    var m = pl.morning.map(function (k, i) { return row(k, STEP(i + 1), null, 'am'); }).join('');
    var n = pl.night.map(function (x, i) { return row(x.k, STEP(i + 1) + (x.same ? ' · ' + P(SAME) : ''), x.add ? ADD : null, 'pm'); }).join('');
    var total = pl.total;
    var el = document.createElement('section'); el.className = 'dn-routine';
    el.innerHTML =
      '<header><div><span class="dn-kicker">DAY &amp; NIGHT</span><h4>' + T(Q('아침은 가볍게, 집중 케어는 밤에', 'Light mornings, focused care at night', '早晨轻盈，夜间重点护理', '朝は軽く、集中ケアは夜に')) + '</h4></div>' +
      '<p>' + T(Q('아침엔 메이크업 전 기본 단계만, 탄력·장벽 같은 집중 케어는 시간 여유 있는 밤에 더해요.', 'Keep mornings to the basics before makeup; add focused care at night.', '早晨上妆前只做基础步骤，重点护理放在晚上。', '朝はメイク前の基本だけ、集中ケアは夜に加えます。')) + '</p></header>' +
      '<div class="dn-cols">' +
        '<div class="dn-col am"><div class="dn-col-head"><span class="dn-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></span><div><b>' + T(Q('아침 · 메이크업 전 기본 ' + pl.morning.length + '단계', 'Morning · ' + pl.morning.length + ' basics before makeup', '早晨 · 上妆前基础' + pl.morning.length + '步', '朝・メイク前の基本' + pl.morning.length + 'ステップ')) + '</b><span>' + T(Q('가볍게 흡수시키고 선크림 · 메이크업으로', 'Absorb lightly, then sunscreen and makeup', '轻薄吸收后涂防晒、上妆', '軽くなじませて日焼け止め・メイクへ')) + '</span></div></div><ol>' + m + '</ol></div>' +
        '<div class="dn-col pm"><div class="dn-col-head"><span class="dn-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg></span><div><b>' + T(Q('밤 · 나이트 케어 +' + pl.adds, 'Night · night care +' + pl.adds, '夜间 · 夜间护理 +' + pl.adds, '夜・ナイトケア +' + pl.adds)) + '</b><span>' + T(Q('시간 여유 있는 밤에 집중 케어', 'Focused care when you have time', '在时间充裕的夜晚重点护理', '時間のある夜に集中ケア')) + '</span></div></div><ol>' + n + '</ol></div>' +
      '</div>' +
      '<footer><b>' + T(Q('총 ' + total + '종 루틴 · 아침 기본 ' + pl.morning.length + '종 + 밤 추가 ' + pl.adds + '종', total + '-product routine · ' + pl.morning.length + ' morning + ' + pl.adds + ' night add-ons', '共' + total + '件 · 早晨' + pl.morning.length + '件 + 夜间追加' + pl.adds + '件', '計' + total + '品 · 朝' + pl.morning.length + '品 + 夜追加' + pl.adds + '品')) + '</b><span>' + T(Q('처음엔 아침 단계만, 익숙해지면 밤 단계를 하나씩 더해도 좋아요.', 'Start with mornings, then add night steps one at a time.', '可先从早晨开始，熟悉后逐步加入夜间步骤。', '最初は朝だけ、慣れたら夜を1つずつ加えてもOK。')) + '</span></footer>';
    anchor.insertAdjacentElement('afterend', el);
  }
  function ensureDayNight() {
    var st3 = document.getElementById('step3');
    if (!st3 || !st3.classList.contains('active')) return;
    renderDayNight();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initZonePicker, 0);
    if (typeof paperRender === 'function') {
      var prev = paperRender;
      paperRender = function () { prev.apply(this, arguments); setTimeout(ensureDayNight, 0); setTimeout(ensureDayNight, 350); };
    }
    if (typeof setLanguage === 'function') {
      var prevL = setLanguage;
      setLanguage = function (l) { prevL(l); renderModeBar(); render(); setTimeout(ensureDayNight, 0); };
    }
    if (typeof resetAll === 'function') {
      var prevR = resetAll;
      resetAll = function () { prevR.apply(this, arguments); activeZone = 'cheek'; origin = {}; setTimeout(render, 0); };
    }
  });
})();
