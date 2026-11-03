/* SIORÉ 결과화면 개편 (2026-11-02)
   1) SKIN BALANCE 점수(/100) 제거 → 수분×유분 4분면 + 고민 프로필 레이더 (숫자 비노출, 자가 문진 기반 '경향' 표기)
   2) 결론부 → 처방전 컨셉 PET 상자 디자인을 옮긴 '루틴 카드' (추천 제품 자동 체크)
   추천 로직(script.js, products.json)은 건드리지 않고 화면 표현만 바꾼다. */
(function(){
  'use strict';
  var BLUE='#1f5ad6';
  var Q=function(ko,en,zh,ja){return {ko:ko,en:en,zh:zh,ja:ja};};
  function lang(){try{return languageMode||'ko'}catch(e){return 'ko'}}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function T(map){try{if(typeof bilingual==='function')return bilingual(map);}catch(e){}return esc(map[lang()]||map.ko);}
  function P(map){return esc(map[lang()]||map.ko);}
  function has(arr,v){try{return (arr||[]).indexOf(v)>-1}catch(e){return false}}
  function st(){
    var s={concerns:[],types:[],age:'',sens:'',a:{},priority:''};
    try{s.concerns=selectedConcerns.slice()}catch(e){}
    try{s.types=selectedSkinTypes.slice()}catch(e){}
    try{s.age=selectedAge||''}catch(e){}
    try{s.sens=selectedSensitivity||''}catch(e){}
    try{s.a=assessmentAnswers||{}}catch(e){}
    try{s.priority=priorityConcern||s.concerns[0]||''}catch(e){s.priority=s.concerns[0]||''}
    return s;
  }
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}

  /* ---------- 1. 수분×유분 4분면 ---------- */
  function quadrant(s){
    var h=0,o=0,a=s.a;
    if(a.balance==='dry'){h-=1.1;o-=0.7}else if(a.balance==='oily'){o+=1.1;h+=0.2}
    if(a.zone==='dry'){h-=0.9;o-=0.7}else if(a.zone==='oily'){o+=1.1}else if(a.zone==='combination'){o+=0.6}
    if(has(s.concerns,'건조'))h-=1;
    if(has(s.concerns,'장벽회복'))h-=0.4;
    if(has(s.concerns,'피지'))o+=0.8;
    if(has(s.concerns,'트러블'))o+=0.4;
    if(has(s.types,'건성')){h-=0.8;o-=0.8}
    if(has(s.types,'지성')){o+=1;h+=0.2}
    if(has(s.types,'복합성'))o+=0.5;
    if(has(s.types,'트러블성'))o+=0.4;
    h=clamp(h,-2,2);o=clamp(o,-2,2);
    var label;
    if(Math.abs(h)<0.5&&Math.abs(o)<0.5)label=Q('균형 경향','Balanced','平衡倾向','バランス傾向');
    else if(h<0&&o<0.3)label=Q('건성 경향','Dry-leaning','偏干性倾向','乾燥肌傾向');
    else if(h<0)label=Q('수분 부족 지성 경향','Oily but dehydrated','外油内干倾向','インナードライ傾向');
    else if(o>=0.3)label=Q('지성 경향','Oily-leaning','偏油性倾向','脂性肌傾向');
    else label=Q('산뜻한 균형 경향','Light & balanced','清爽平衡倾向','さっぱりバランス傾向');
    var x=60+o*24,y=56-h*22;
    var qn=function(m){return P(m)};
    var svg='<svg viewBox="0 0 120 112" role="img" aria-label="'+P(Q('수분 유분 위치','Hydration and oil position','水油定位','水分・油分の位置'))+'">'
      +'<defs><radialGradient id="smQf" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="#fffaf6"/><stop offset="1" stop-color="#f4e6dd"/></radialGradient>'
      +'<radialGradient id="smDot"><stop offset="0" stop-color="#d79a86"/><stop offset="1" stop-color="#9c5a47"/></radialGradient></defs>'
      +'<rect x="12" y="12" width="96" height="88" rx="6" fill="url(#smQf)" stroke="#d8c2b3" stroke-width=".5"/>'
      +'<line x1="60" y1="16" x2="60" y2="96" stroke="#cfb3a1" stroke-width=".4" stroke-dasharray="1.2 1.6"/><line x1="16" y1="56" x2="104" y2="56" stroke="#cfb3a1" stroke-width=".4" stroke-dasharray="1.2 1.6"/>'
      +'<text x="18" y="21" class="sm-qn">'+qn(Q('산뜻','Light','清爽','さっぱり'))+'</text>'
      +'<text x="102" y="21" text-anchor="end" class="sm-qn">'+qn(Q('지성','Oily','油性','脂性'))+'</text>'
      +'<text x="18" y="94" class="sm-qn">'+qn(Q('건성','Dry','干性','乾燥'))+'</text>'
      +'<text x="102" y="94" text-anchor="end" class="sm-qn">'+qn(Q('수분부족 지성','Dehydrated oily','外油内干','インナードライ'))+'</text>'
      +'<text x="60" y="8" text-anchor="middle" class="sm-ax">'+P(Q('수분 충분','Hydrated','水分充足','うるおい十分'))+'</text>'
      +'<text x="60" y="109" text-anchor="middle" class="sm-ax">'+P(Q('수분 부족','Dehydrated','水分不足','うるおい不足'))+'</text>'
      +'<text x="12" y="109" text-anchor="start" class="sm-ax sm-ax-o">'+P(Q('← 유분 적음','← Less oil','← 油少','← 油分少'))+'</text>'
      +'<text x="108" y="109" text-anchor="end" class="sm-ax sm-ax-o">'+P(Q('유분 많음 →','More oil →','油多 →','油分多 →'))+'</text>'
      +'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="11" fill="none" stroke="#b77a66" stroke-opacity=".22" stroke-width=".6"/>'
      +'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="7.5" fill="#c58a76" fill-opacity=".16"/>'
      +'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="4" fill="url(#smDot)" stroke="#fff" stroke-width="1.3"/>'
      +'</svg>';
    return {svg:svg,label:label};
  }

  /* ---------- 2. 고민 프로필 레이더 (6축, 수치 비노출) ---------- */
  var AXES=[
    {k:'hyd',n:Q('수분','Hydration','保湿','うるおい')},
    {k:'calm',n:Q('진정','Soothing','舒缓','すこやか')},
    {k:'bar',n:Q('장벽','Barrier','屏障','バリア')},
    {k:'firm',n:Q('탄력','Firmness','弹润','ハリ')},
    {k:'glow',n:Q('톤·광채','Radiance','光泽','ツヤ')},
    {k:'tex',n:Q('결·피지','Texture','肤质·油脂','キメ・皮脂')}
  ];
  var CONCERN_AXIS={'건조':'hyd','민감':'calm','열감홍조':'calm','장벽회복':'bar','안티에이징':'firm','광채톤업':'glow','트러블':'tex','피지':'tex','각질':'tex'};
  function radar(s){
    var v={hyd:1.6,calm:1.6,bar:1.6,firm:1.6,glow:1.6,tex:1.6},a=s.a;
    s.concerns.forEach(function(c){var k=CONCERN_AXIS[c];if(k)v[k]+=2.4;});
    if(CONCERN_AXIS[s.priority])v[CONCERN_AXIS[s.priority]]+=0.8;
    if(a.balance==='dry'||a.zone==='dry')v.hyd+=0.8;
    if(a.reactivity==='high'){v.calm+=0.9;v.bar+=0.5}else if(a.reactivity==='medium')v.calm+=0.4;
    if(s.sens==='high'){v.calm+=0.5;v.bar+=0.4}
    if(has(s.types,'민감성'))v.bar+=0.6;
    if(a.firmness==='high')v.firm+=0.9;else if(a.firmness==='medium')v.firm+=0.4;
    if(/40|50|60|70/.test(s.age))v.firm+=0.4;
    if(a.tone==='pigment'||a.tone==='dull')v.glow+=0.8;
    if(a.balance==='oily'||a.zone==='oily')v.tex+=0.7;
    AXES.forEach(function(x){v[x.k]=clamp(v[x.k],0.6,5)});
    var order=AXES.map(function(x){return x.k}).sort(function(p,q){return v[q]-v[p]});
    var focus=order.filter(function(k){return v[k]>=2.2}).slice(0,2);
    if(!focus.length)focus=[order[0]];
    var cx=60,cy=58,R=40,pt=function(i,r){var ang=-Math.PI/2+i*Math.PI/3;return [cx+Math.cos(ang)*r,cy+Math.sin(ang)*r];};
    var ring=function(r){return AXES.map(function(_,i){return pt(i,r).map(function(n){return n.toFixed(1)}).join(',')}).join(' ')};
    var shape=AXES.map(function(x,i){return pt(i,R*v[x.k]/5).map(function(n){return n.toFixed(1)}).join(',')}).join(' ');
    var svg='<svg viewBox="0 0 120 116" role="img" aria-label="'+P(Q('고민 프로필','Concern profile','肌肤困扰概况','お悩みプロフィール'))+'">'
      +'<defs><linearGradient id="smRf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ecc4b5"/><stop offset="1" stop-color="#b9786a"/></linearGradient></defs>'
      +'<polygon points="'+ring(R)+'" fill="#fbf3ee" stroke="#d8c2b3" stroke-width=".5"/>'
      +'<polygon points="'+ring(R*0.66)+'" fill="none" stroke="#e4d3c7" stroke-width=".4"/>'
      +'<polygon points="'+ring(R*0.33)+'" fill="none" stroke="#ecdfd6" stroke-width=".4"/>'
      +AXES.map(function(_,i){var p=pt(i,R);return '<line x1="'+cx+'" y1="'+cy+'" x2="'+p[0].toFixed(1)+'" y2="'+p[1].toFixed(1)+'" stroke="#e6d6cb" stroke-width=".35"/>'}).join('')
      +'<polygon points="'+shape+'" fill="url(#smRf)" fill-opacity=".38" stroke="#a86a58" stroke-width=".9" stroke-linejoin="round"/>'
      +AXES.map(function(x,i){var p=pt(i,R*v[x.k]/5),lp=pt(i,R+9),f=focus.indexOf(x.k)>-1;
        return (f?'<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="2.8" fill="#a86a58" stroke="#fff" stroke-width="1.1"/>':'')
        +'<text x="'+lp[0].toFixed(1)+'" y="'+(lp[1]+2.5).toFixed(1)+'" text-anchor="middle" class="sm-rl'+(f?' is-focus':'')+'">'+P(x.n)+'</text>';}).join('')
      +'</svg>';
    return {svg:svg,focus:focus.map(function(k){return AXES.filter(function(x){return x.k===k})[0].n})};
  }

  function skinMap(){
    var s=st(),q=quadrant(s),r=radar(s);
    var focusTxt=r.focus.map(function(n){return P(n)}).join(' · ');
    return '<section class="sm-skinmap" aria-label="'+P(Q('피부 경향 요약','Skin tendency summary','肌肤倾向概要','肌傾向のまとめ'))+'">'
      +'<div class="sm-card"><div class="sm-head"><span class="sm-eye">01 · SKIN POSITION</span><b>'+T(Q('내 피부 위치','Where your skin sits','我的肌肤定位','わたしの肌ポジション'))+'</b></div>'+q.svg
      +'<p class="sm-result"><span class="sm-tag">MY TYPE</span>'+T(q.label)+'</p></div>'
      +'<div class="sm-card"><div class="sm-head"><span class="sm-eye">02 · CONCERN PROFILE</span><b>'+T(Q('고민 프로필','Concern profile','肌肤困扰概况','お悩みプロフィール'))+'</b></div>'+r.svg
      +'<p class="sm-result"><span class="sm-tag">FOCUS CARE</span>'+focusTxt+'</p></div>'
      +'<p class="sm-note">'+T(Q('선택하신 답변을 바탕으로 한 경향이며, 측정·진단 결과가 아닙니다.','A tendency based on your answers, not a measurement or diagnosis.','基于您的回答得出的倾向，并非测量或诊断结果。','回答に基づく傾向であり、測定・診断結果ではありません。'))+'</p>'
      +'</section>';
  }

  /* ---------- 3. 처방전 컨셉 상자 → 루틴 카드 ---------- */
  var NMN=[['cleansing','Hydro Capsule Cleansing Milk'],['bubbleToner','Fresh Bubble Toner'],['serum','Intensive Serum'],['soothingCream','Hydrating Soothing Cream'],['richCream','Deep Glow Rich Cream']];
  var REL=[['essenceToner','Essence Toner'],['repairAmpoule','Repair Ampoule'],['comfortCream','Comfort Cream'],['soothingGel','Daily Balance Calming Soothing Gel']];
  function localName(key){
    try{var p=(Array.isArray(products)?products.filter(function(x){return x.key===key})[0]:products[key]);if(!p)return '';
      var l=lang(),n=(l!=='en'&&l!=='ko'&&p.i18n&&p.i18n[l]&&p.i18n[l].name)||(l==='ko'?p.name:'')||'';
      return n.replace(/^(NMN\s*|데일리\s*릴리프\s*(\(밸런스\))?\s*|デイリーリリーフ\s*|每日舒缓\s*|日常舒缓\s*|Daily Relief\s*)/,'').trim();}catch(e){return ''}
  }
  function picked(){
    var panel=document.querySelector('.solution-sheet .rx-tier-panel:not([hidden])')||document.querySelector('.solution-sheet .rx-tier-panel');
    var keys=[];if(panel)panel.querySelectorAll('[data-ref-product]').forEach(function(b){keys.push(b.getAttribute('data-ref-product'))});
    var tierBtn=document.querySelector('.solution-sheet [data-rx-tier][aria-selected="true"] span');
    var main=tierBtn&&(tierBtn.querySelector('.i18n-main')||tierBtn);
    return {keys:keys,tier:main?main.textContent.trim():''};
  }
  function box(i,on){return '<span class="bx-box'+(on?' is-on':'')+'" aria-hidden="true">'+(on?'<svg viewBox="0 0 12 12"><path d="M2.4 6.3 5 8.8 9.8 3.4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>':'')+'</span>';}
  function item(pair,keys){var on=keys.indexOf(pair[0])>-1,ln=localName(pair[0]);
    return '<li class="'+(on?'is-on':'')+'">'+box(0,on)+'<span><b>'+esc(pair[1])+'</b>'+(ln?'<small>'+esc(ln)+'</small>':'')+'</span>'+(on?'<em class="sr">'+P(Q('추천','recommended','推荐','おすすめ'))+'</em>':'')+'</li>';}
  function boxCard(){
    var pk=picked(),keys=pk.keys;
    var nmnOn=NMN.some(function(p){return keys.indexOf(p[0])>-1}),relOn=REL.some(function(p){return keys.indexOf(p[0])>-1});
    var d=new Date(),date=d.getFullYear()+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+String(d.getDate()).padStart(2,'0');
    var logo='images/brand/siore-logo-official-black.png';
    return '<section class="bx-wrap" aria-label="'+P(Q('나의 시오레 루틴 카드','My SIORÉ routine card','我的SIORÉ护理卡','わたしのSIORÉルーティンカード'))+'">'
      +'<div class="bx-kicker"><span>'+T(Q('나의 시오레 루틴 카드','My SIORÉ routine card','我的SIORÉ护理卡','わたしのSIORÉルーティンカード'))+'</span>'+(pk.tier?'<em>'+esc(pk.tier)+'</em>':'')+'</div>'
      +'<div class="bx-card">'
        +'<div class="bx-top">'
          +'<div class="bx-cell bx-brand"><small>Prescription.</small><img src="'+logo+'" alt="SIORÉ"></div>'
          +'<div class="bx-cell bx-profile"><small>Skin Profile.</small><ul>'
            +'<li class="bx-nmn'+(nmnOn?' is-on':'')+'">'+box(0,nmnOn)+'<b>ANTI-AGING LINE</b></li>'
            +'<li class="bx-rel'+(relOn?' is-on':'')+'">'+box(0,relOn)+'<b>BALANCE(RELIEF) LINE</b></li></ul></div>'
          +'<div class="bx-cell bx-by"><small>Prescribed by.</small><strong>SIORÉ PHARMACIST LAB.</strong></div>'
        +'</div>'
        +'<div class="bx-lines">'
          +'<div class="bx-line bx-nmn"><div class="bx-tab">NMN Anti-Aging Line</div><ul class="bx-list">'+NMN.map(function(p){return item(p,keys)}).join('')+'</ul></div>'
          +'<div class="bx-line bx-rel"><div class="bx-tab">Balance(Relief) Line</div><ul class="bx-list">'+REL.map(function(p){return item(p,keys)}).join('')+'</ul></div>'
        +'</div>'
        +'<div class="bx-foot"><span>'+T(Q('이 카드를 약사·판매직원에게 보여주세요','Show this card to the pharmacy staff','请向药师或店员出示此卡','このカードを薬剤師・スタッフにお見せください'))+'</span><time>'+date+'</time></div>'
      +'</div></section>';
  }

  function apply(){
    var sheet=document.querySelector('.solution-sheet');if(!sheet)return;
    sheet.querySelectorAll('.rx-balance-score').forEach(function(n){n.remove()});
    var diag=sheet.querySelector('.rx-diagnosis');
    if(diag){diag.classList.add('sm-one');var old=sheet.querySelector('.sm-skinmap');if(old)old.remove();diag.insertAdjacentHTML('afterend',skinMap());}
    var oldBox=sheet.querySelector('.bx-wrap');if(oldBox)oldBox.remove();
    sheet.insertAdjacentHTML('beforeend',boxCard());
  }
  function syncBox(){var w=document.querySelector('.solution-sheet .bx-wrap');if(!w)return;w.outerHTML=boxCard();}

  if(typeof paperRender==='function'){
    var prev=paperRender;
    paperRender=function(){var r=prev.apply(this,arguments);try{apply()}catch(e){console.warn('skinmap',e)}return r;};
  }
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-rx-tier]'))setTimeout(syncBox,30);});
  window.__sioreResultUpgrade={apply:apply};
})();
