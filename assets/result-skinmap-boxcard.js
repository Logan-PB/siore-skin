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
  var REL=[['essenceToner','Essence Toner'],['repairAmpoule','Care Ampoule'],['comfortCream','Comfort Cream'],['soothingGel','Daily Balance Calming Soothing Gel']];
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

  function rxInfo(){
    var ci=codeInfo(),sg=ci.sg,f=ci.focus.map(function(n){return P(n)}).join(' · ');
    var sig=sg.on.length?P(Q(sg.on.length+'가지 · 자주 '+sg.often.length,sg.on.length+' · often '+sg.often.length,sg.on.length+'项 · 经常'+sg.often.length,sg.on.length+'つ・よく'+sg.often.length)):P(Q('없음','None','没有','なし'));
    return '<div class="bx-info">'
      +'<div class="bx-i bx-code"><small>Skin Code.</small><b>'+ci.code.split('').join(' ')+'</b><span>'+P(ci.name)+'</span></div>'
      +'<div class="bx-i"><small>Skin Type.</small><b class="sm">'+P(ci.type)+'</b></div>'
      +'<div class="bx-i"><small>Focus Care.</small><b class="sm">'+f+'</b></div>'
      +'<div class="bx-i"><small>Last 3 Days.</small><b class="sm">'+sig+'</b></div>'
      +'</div>';
  }
  function rxDirections(){
    var items=whyItems(),ci=codeInfo(),sg=ci.sg;if(!items.length)return '';
    var many=sg.often.length>=3;
    var note=many?Q('최근 예민 신호가 많아요. 약사님과 먼저 상담한 뒤 순한 단계부터 시작해 주세요.','Many recent sensitivity signals. Talk to the pharmacist first, then start gently.','近期敏感信号较多，请先咨询药师，再从温和步骤开始。','最近の敏感サインが多めです。まず薬剤師に相談し、やさしいステップから始めてください。')
      :ci.S?Q('첫 1주는 순한 단계 위주로, 크림은 소량부터 시작해 주세요.','For the first week, focus on gentle steps and start with a small amount of cream.','第一周以温和步骤为主，面霜从少量开始。','最初の1週間はやさしいステップ中心に、クリームは少量から。')
      :Q('아침·저녁 같은 순서로 꾸준히 사용해 주세요.','Use in the same order morning and night.','早晚按相同顺序坚持使用。','朝晩同じ順番で続けてお使いください。');
    return '<div class="bx-dir"><div class="bx-dir-h"><small>Directions.</small><span>'+P(Q('사용 순서와 이유','Order of use & reason','使用顺序与理由','使う順番と理由'))+'</span></div><ol>'
      +items.map(function(w){return '<li class="'+(w.nmn?'nm':'bl')+'"><i>'+(w.i+1)+'</i><div><b>'+esc(w.name)+'</b><span>'+w.lead+w.sig+w.reason+'</span></div></li>'}).join('')+'</ol>'
      +'<div class="bx-note"><small>Notes.</small><p>'+P(note)+'</p><p class="bx-disc">'+P(Q('자가 문진 기반 화장품 상담 결과이며, 측정·진단이 아닙니다.','Cosmetic consultation based on your answers — not a measurement or diagnosis.','基于自我问答的化妆品咨询结果，并非测量或诊断。','回答に基づく化粧品相談の結果であり、測定・診断ではありません。'))+'</p></div></div>';
  }

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
        +rxInfo()
        +'<div class="bx-lines">'
          +'<div class="bx-line bx-nmn"><div class="bx-tab">NMN Anti-Aging Line</div><ul class="bx-list">'+NMN.map(function(p){return item(p,keys)}).join('')+'</ul></div>'
          +'<div class="bx-line bx-rel"><div class="bx-tab">Balance(Relief) Line</div><ul class="bx-list">'+REL.map(function(p){return item(p,keys)}).join('')+'</ul></div>'
        +'</div>'
        +rxDirections()
        +'<div class="bx-foot"><span>'+T(Q('이 카드를 약사·판매직원에게 보여주세요','Show this card to the pharmacy staff','请向药师或店员出示此卡','このカードを薬剤師・スタッフにお見せください'))+'</span><time>'+date+'</time></div>'
      +'</div></section>';
  }


  /* ---------- 4. 최근 3일 민감 신호 (문진 2단계) ---------- */
  var SIG=[
    {k:'sting',n:Q('따가움','Stinging','刺痛','ヒリヒリ'),d:Q('세안·바를 때 콕콕','When cleansing or applying','洁面或涂抹时','洗顔・塗布時に')},
    {k:'heat',n:Q('화끈거림','Heat','发热感','ほてり'),d:Q('열감이 올라와요','Feels warm','感觉发热','熱っぽい')},
    {k:'tight',n:Q('당김','Tightness','紧绷','つっぱり'),d:Q('건조하게 땅겨요','Feels dry and tight','干燥紧绷','乾いてつっぱる')},
    {k:'itch',n:Q('가려움','Itching','发痒','かゆみ'),d:Q('간지러워요','Feels itchy','觉得痒','かゆい')},
    {k:'red',n:Q('붉어짐','Redness','泛红','赤み'),d:Q('붉은기가 보여요','Visible redness','可见泛红','赤みが見える')}
  ];
  var LV=[Q('없음','None','没有','なし'),Q('가끔','Sometimes','偶尔','ときどき'),Q('자주','Often','经常','よく')];
  var signals={};SIG.forEach(function(x){signals[x.k]=0});
  window.__sioreSignals=signals;
  function signalHTML(){
    return '<fieldset class="sg-field"><legend>'+P(Q('최근 3일, 이런 느낌이 있었나요?','In the last 3 days, did you feel any of these?','最近3天，是否有以下感觉？','この3日間、こんな感覚はありましたか？'))+'<small>'+P(Q('지금 컨디션에 맞춰 순한 단계부터 안내해 드려요','We will start with gentle steps for your current condition','将根据当前状态从温和步骤开始推荐','今の肌状態に合わせて、やさしいステップからご案内します'))+'</small></legend>'
      +SIG.map(function(x){return '<div class="sg-row"><b>'+P(x.n)+'<small>'+P(x.d)+'</small></b><span class="sg-lv" role="radiogroup" aria-label="'+P(x.n)+'">'
        +LV.map(function(l,i){return '<button type="button" role="radio" aria-checked="'+(signals[x.k]===i)+'" data-sig="'+x.k+'" data-lv="'+i+'">'+P(l)+'</button>'}).join('')+'</span></div>'}).join('')
      +'<p class="sg-note">'+P(Q('증상이 계속되거나 심하면 약사님과 먼저 상담해 주세요','If symptoms persist or feel strong, please talk to the pharmacist first','如症状持续或较重，请先咨询药师','症状が続く・強い場合は、まず薬剤師にご相談ください'))+'</p></fieldset>';
  }
  function mountSignals(){
    var panel=document.querySelector('#step2 .habit-panel');if(!panel)return;
    var old=document.querySelector('#step2 .sg-card');
    var html='<section class="intake-card sg-card">'+signalHTML()+'</section>';
    if(old){old.outerHTML=html;return}
    panel.insertAdjacentHTML('beforebegin',html);
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-sig]');if(b){signals[b.getAttribute('data-sig')]=+b.getAttribute('data-lv');
      b.parentNode.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-checked',String(x===b))});return}
    if(e.target.closest&&e.target.closest('.language-option'))setTimeout(mountSignals,60);
  });
  function sigSummary(){
    var on=SIG.filter(function(x){return signals[x.k]>0}),often=SIG.filter(function(x){return signals[x.k]===2});
    return {on:on,often:often};
  }

  /* ---------- 5. 시오레 4축 피부 코드 ---------- */
  function axisScores(s){
    var a=s.a,sg=sigSummary(),o=0,se=0,t=0,f=0;
    if(a.balance==='oily')o+=1;else if(a.balance==='dry')o-=1;
    if(a.zone==='oily')o+=1;else if(a.zone==='combination')o+=.5;else if(a.zone==='dry')o-=1;
    if(has(s.types,'지성'))o+=1;if(has(s.types,'복합성'))o+=.5;if(has(s.types,'트러블성'))o+=.3;if(has(s.types,'건성'))o-=1;
    if(has(s.concerns,'피지'))o+=.7;if(has(s.concerns,'건조'))o-=.7;
    if(a.reactivity==='high')se+=1.2;else if(a.reactivity==='medium')se+=.4;else if(a.reactivity==='low')se-=1;
    if(s.sens==='high')se+=1;else if(s.sens==='low')se-=.7;
    if(has(s.types,'민감성'))se+=.8;['민감','열감홍조','장벽회복'].forEach(function(c){if(has(s.concerns,c))se+=.6});
    sg.on.forEach(function(x){se+=signals[x.k]===2?.5:.2});
    if(a.tone==='pigment')t+=1.2;else if(a.tone==='dull')t+=.8;else if(a.tone==='clear')t-=1;
    if(has(s.concerns,'광채톤업'))t+=.8;
    if(a.firmness==='high')f+=1.2;else if(a.firmness==='medium')f+=.4;else if(a.firmness==='low')f-=1;
    if(has(s.concerns,'안티에이징'))f+=.8;
    if(/50|60|70/.test(s.age))f+=.8;else if(/40/.test(s.age))f+=.5;else if(/20/.test(s.age))f-=.4;
    return {o:o,se:se,t:t,f:f,sg:sg};
  }
  function codeCard(){
    var s=st(),x=axisScores(s);
    var O=x.o>.3,S=x.se>.3,TN=x.t>.3,F=x.f>.3;
    var L1=O?['O',Q('유분','Oily','油性','皮脂')]:['D',Q('건조','Dry','干燥','乾燥')];
    var L2=S?['S',Q('예민','Sensitive','敏感','敏感')]:['C',Q('편안','Calm','稳定','すこやか')];
    var L3=TN?['T',Q('톤 케어','Tone care','提亮护理','トーンケア')]:['E',Q('균일','Even','均匀','均一')];
    var L4=F?['F',Q('탄력 케어','Firmness care','弹润护理','ハリケア')]:['L',Q('탄탄','Firm','紧致','ハリ十分')];
    var focus=TN&&F?Q('톤·탄력 집중형','Tone & firmness focus','光泽·弹润重点型','トーン・ハリ集中タイプ'):TN?Q('톤 집중형','Tone focus','光泽重点型','トーン集中タイプ'):F?Q('탄력 집중형','Firmness focus','弹润重点型','ハリ集中タイプ'):Q('밸런스 유지형','Balance keeper','平衡维持型','バランスキープタイプ');
    var nm={};['ko','en','zh','ja'].forEach(function(l){nm[l]=L1[1][l]+'·'+L2[1][l]+' · '+focus[l]});
    var base=S?Q('자극을 줄인 진정·보습 루틴을 기본으로','A gentle soothing and moisturizing routine as your base','以温和舒缓保湿护理为基础','刺激を抑えた鎮静・保湿ケアをベースに'):O?Q('산뜻한 수분·밸런스 루틴을 기본으로','A light hydration and balance routine as your base','以清爽补水平衡护理为基础','さっぱりした水分・バランスケアをベースに'):Q('수분과 보습막을 채우는 루틴을 기본으로','A routine that replenishes moisture and a protective layer as your base','以补水和保湿屏障护理为基础','うるおいと保湿膜を満たすケアをベースに');
    var add=TN&&F?Q('탄력·톤 케어를 더하면 좋은 타입이에요','adding firmness and tone care suits you','再加上弹润与提亮护理更合适','ハリ・トーンケアをプラスするのがおすすめです'):F?Q('탄력 케어를 더하면 좋은 타입이에요','adding firmness care suits you','再加上弹润护理更合适','ハリケアをプラスするのがおすすめです'):TN?Q('톤·광채 케어를 더하면 좋은 타입이에요','adding tone and radiance care suits you','再加上提亮光泽护理更合适','トーン・ツヤケアをプラスするのがおすすめです'):Q('지금 루틴을 꾸준히 유지하면 좋은 타입이에요','keeping your routine steady suits you','坚持当前护理即可','今のケアを続けるのがおすすめです');
    var desc={};['ko','en','zh','ja'].forEach(function(l){desc[l]=base[l]+(l==='en'?'; ':l==='ko'?' ':l==='zh'?'，':'、')+add[l]});
    var pos=function(v){return Math.round(50+clamp(v,-2.2,2.2)/2.2*42)};
    var poles=[[Q('건조','Dry','干燥','乾燥'),Q('유분','Oily','油性','皮脂'),x.o],[Q('예민','Sensitive','敏感','敏感'),Q('편안','Calm','稳定','すこやか'),-x.se],[Q('톤 케어','Tone care','提亮护理','トーンケア'),Q('균일','Even','均匀','均一'),-x.t],[Q('탄력 케어','Firmness care','弹润护理','ハリケア'),Q('탄탄','Firm','紧致','ハリ十分'),-x.f]];
    var sg=x.sg,sigBlock='';
    if(sg.on.length){
      var many=sg.often.length>=3;
      sigBlock='<div class="cd-sig"><div class="cd-sig-top"><small>LAST 3 DAYS SIGNAL</small><span class="cd-dots">'+SIG.map(function(z){return '<i class="'+(signals[z.k]===2?'on2':signals[z.k]===1?'on1':'')+'"></i>'}).join('')+'</span></div>'
        +'<b>'+T(Q('예민 신호 '+sg.on.length+'가지 · 그중 \'자주\' '+sg.often.length+'가지','Sensitivity signals: '+sg.on.length+' · often: '+sg.often.length,'敏感信号'+sg.on.length+'项 · 其中经常'+sg.often.length+'项','敏感サイン'+sg.on.length+'つ・うち「よく」'+sg.often.length+'つ'))+'</b>'
        +'<p>'+T(many?Q('지금은 약사님과 먼저 상담한 뒤, 순한 단계부터 시작해 주세요.','Please talk to the pharmacist first, then start with gentle steps.','请先咨询药师，再从温和步骤开始。','まず薬剤師にご相談のうえ、やさしいステップから始めてください。'):Q('지금은 자극을 줄인 진정·보습 단계부터 시작하는 것이 좋아요.','Start with gentle soothing and moisturizing steps for now.','现在建议从温和的舒缓保湿步骤开始。','今は刺激を抑えた鎮静・保湿ステップから始めるのがおすすめです。'))+'</p>'
        +'<div class="cd-tags">'+sg.on.map(function(z){return '<span>'+P(z.n)+' '+P(LV[signals[z.k]])+'</span>'}).join('')+'</div></div>';
    }
    return '<section class="cd-card" aria-label="'+P(Q('시오레 4축 피부 코드','SIORÉ 4-axis skin code','SIORÉ四轴肌肤代码','SIORÉ 4軸スキンコード'))+'">'
      +'<div class="cd-head"><span class="sm-eye">03 · SIORÉ 4-AXIS SKIN CODE</span><b>'+T(Q('나의 피부 코드','My skin code','我的肌肤代码','わたしのスキンコード'))+'</b></div>'
      +'<div class="cd-letters">'+[L1,L2,L3,L4].map(function(l){return '<span><b>'+l[0]+'</b><small>'+P(l[1])+'</small></span>'}).join('')+'</div>'
      +'<h4 class="cd-name">'+T(nm)+'</h4><p class="cd-desc">'+T(desc)+'</p>'
      +'<div class="cd-poles">'+poles.map(function(p){var v=pos(p[2]);return '<div><span class="'+(v<50?'on':'')+'">'+P(p[0])+'</span><i style="--x:'+v+'%"></i><span class="'+(v>=50?'on':'')+'">'+P(p[1])+'</span></div>'}).join('')+'</div>'
      +sigBlock
      +'<p class="cd-foot">'+T(Q('2주 뒤 다시 체크하면 코드 변화를 비교해 드려요','Check again in 2 weeks to compare your code','2周后再次检测可对比代码变化','2週間後にもう一度チェックすると変化を比べられます'))+'</p>'
      +'</section>';
  }


  /* ---------- 6. 4축 라벨 (빠른 피부 체크 문항) ---------- */
  var AXQ={balance:Q('AXIS 1 · 수분·유분','AXIS 1 · MOISTURE·OIL','AXIS 1 · 水油','AXIS 1 · 水分・油分'),zone:Q('AXIS 1 · 수분·유분','AXIS 1 · MOISTURE·OIL','AXIS 1 · 水油','AXIS 1 · 水分・油分'),
    reactivity:Q('AXIS 2 · 민감도','AXIS 2 · SENSITIVITY','AXIS 2 · 敏感度','AXIS 2 · 敏感度'),tone:Q('AXIS 3 · 톤','AXIS 3 · TONE','AXIS 3 · 肤色','AXIS 3 · トーン'),firmness:Q('AXIS 4 · 탄력','AXIS 4 · FIRMNESS','AXIS 4 · 弹润','AXIS 4 · ハリ')};
  function tagAxes(){
    document.querySelectorAll('#skin-assessment [data-assessment-question]').forEach(function(f){
      var k=f.getAttribute('data-assessment-question'),m=AXQ[k];if(!m)return;
      var lg=f.querySelector('legend');if(!lg)return;var t=lg.querySelector('.ax-tag');var txt=P(m);
      if(t){if(t.textContent!==txt)t.textContent=txt;return}
      lg.insertAdjacentHTML('afterbegin','<span class="ax-tag">'+txt+'</span>');
    });
  }
  /* ---------- 9. 현재 사용 습관 = 선택 입력 안내 ---------- */
  function optionalHabits(){
    var panel=document.querySelector('#step2 .habit-panel');if(!panel)return;
    var any=panel.querySelector('.habit-options button[aria-pressed="true"]');
    var st=panel.querySelector('.habit-guide-status');
    var msg=P(Q('선택 사항이에요 · 건너뛰어도 결과를 볼 수 있어요','Optional · you can skip this and still see results','可选填写 · 跳过也可查看结果','任意です・スキップしても結果を見られます'));
    if(st&&!any&&st.textContent!==msg)st.textContent=msg;
    panel.querySelectorAll('.habit-step-state').forEach(function(b){var t=P(Q('선택','Optional','可选','任意'));if(!any&&b.textContent!==t)b.textContent=t;});
  }
  try{new MutationObserver(function(){tagAxes();optionalHabits()}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}

  /* ---------- 7. 추천 이유 (WHY THIS ROUTINE) ---------- */
  var WHY={
    cleansing:Q('당김 없이 세안하는 첫 단계','A first step that cleanses without tightness','不紧绷的洁面第一步','つっぱらない洗顔の第一歩'),
    bubbleToner:Q('거품으로 각질 정돈·수분 첫 단계','Foam toner that refines texture and hydrates','泡沫爽肤水，整理角质并补水','泡でキメを整え、うるおいを与える'),
    essenceToner:Q('예민한 날 수분·진정 첫 단계','Hydrating, calming first step for sensitive days','敏感时的补水舒缓第一步','ゆらぎ肌の日の保湿・鎮静ステップ'),
    repairAmpoule:Q('장벽 보습을 집중으로 채우는 단계','Focused barrier-moisture step','集中补充屏障保湿','バリア保湿を集中ケア'),
    serum:Q('탄력·톤을 함께 챙기는 집중 단계','Focused step for firmness and tone','兼顾弹润与肤色的集中步骤','ハリ・トーンの集中ステップ'),
    soothingCream:Q('수분을 잠그는 산뜻한 수딩 크림','Light soothing cream that locks in moisture','锁水的清爽舒缓面霜','うるおいを閉じ込める軽やかなクリーム'),
    richCream:Q('리치한 보습막으로 마무리','Finish with a rich moisture layer','以丰润保湿膜收尾','リッチな保湿膜で仕上げ'),
    soothingGel:Q('열감·붉은기를 산뜻하게 진정','Cools heat and visible redness','清爽舒缓热感与泛红','ほてり・赤みをすっきり鎮静'),
    comfortCream:Q('장벽 보습막으로 편안하게 마무리','Finish comfortably with a barrier moisture layer','以屏障保湿膜舒适收尾','バリア保湿膜でやさしく仕上げ')
  };
  var NMNK=['cleansing','bubbleToner','serum','soothingCream','richCream'];
  function whyCard(){
    var items=whyItems();if(!items.length)return '';var ci=codeInfo(),sg=ci.sg;
    var rows=items.map(function(w){return '<li><img src="'+esc(w.img)+'" alt=""><div><small class="'+(w.nmn?'nm':'bl')+'">STEP '+(w.i+1)+' · '+(w.nmn?'NMN':'BALANCE')+'</small><b>'+esc(w.name)+'</b><span>'+w.lead+w.sig+w.reason+'</span></div></li>'}).join('');
    return '<section class="why-card"><div class="why-head"><span class="why-code">'+ci.code.split('').map(function(c){return '<span>'+c+'</span>'}).join('')+'</span><div><b>'+P(Q('이렇게 골랐어요','Why this routine','为什么推荐这套护理','このルーティンを選んだ理由'))+'</b><small>'+(sg.on.length?P(Q('최근 3일 예민 신호 '+sg.on.length+'가지 반영','Reflects '+sg.on.length+' recent sensitivity signals','已参考最近3天'+sg.on.length+'项敏感信号','直近3日の敏感サイン'+sg.on.length+'つを反映')):P(Q('피부 코드와 답변을 반영','Based on your skin code and answers','参考肌肤代码与回答','スキンコードと回答を反映')))+'</small></div></div>'
      +'<h5><em>WHY THIS ROUTINE</em>'+P(Q('제품별 한 줄 이유','One-line reason per product','每款产品一句话理由','製品ごとのひとこと理由'))+'</h5><ul>'+rows+'</ul></section>';
  }


  /* ---------- 8. 처방전 서식 요약용 데이터 ---------- */
  function codeInfo(){
    var s=st(),x=axisScores(s),O=x.o>.3,S=x.se>.3,TN=x.t>.3,F=x.f>.3;
    var code=(O?'O':'D')+(S?'S':'C')+(TN?'T':'E')+(F?'F':'L');
    var p1=O?Q('유분','Oily','油性','皮脂'):Q('건조','Dry','干燥','乾燥'),p2=S?Q('예민','Sensitive','敏感','敏感'):Q('편안','Calm','稳定','すこやか');
    var focus=TN&&F?Q('톤·탄력 집중형','Tone & firmness focus','光泽·弹润重点型','トーン・ハリ集中タイプ'):TN?Q('톤 집중형','Tone focus','光泽重点型','トーン集中タイプ'):F?Q('탄력 집중형','Firmness focus','弹润重点型','ハリ集中タイプ'):Q('밸런스 유지형','Balance keeper','平衡维持型','バランスキープタイプ');
    var nm={};['ko','en','zh','ja'].forEach(function(l){nm[l]=p1[l]+'·'+p2[l]+' · '+focus[l]});
    return {code:code,name:nm,S:S,sg:x.sg,type:quadrant(s).label,focus:radar(s).focus};
  }
  function whyItems(){
    var panel=document.querySelector('.solution-sheet .rx-tier-panel:not([hidden])')||document.querySelector('.solution-sheet .rx-tier-panel');if(!panel)return [];
    var s=st(),x=axisScores(s),O=x.o>.3,S=x.se>.3,TN=x.t>.3,F=x.f>.3;var sigOn=function(k){return signals[k]>0};
    return [].slice.call(panel.querySelectorAll('[data-ref-product]')).map(function(t,i){
      var k=t.getAttribute('data-ref-product'),img=t.querySelector('img'),nm=t.querySelector('strong'),nmn=NMNK.indexOf(k)>-1,drv=[],sigs=[];
      if(S&&!nmn)drv.push('S');
      if(!O&&['richCream','soothingCream','comfortCream','repairAmpoule','essenceToner','cleansing'].indexOf(k)>-1)drv.push('D');
      if(O&&['soothingGel','bubbleToner','soothingCream'].indexOf(k)>-1)drv.push('O');
      if(F&&['serum','richCream'].indexOf(k)>-1)drv.push('F');
      if(TN&&['serum','bubbleToner','soothingCream'].indexOf(k)>-1)drv.push('T');
      if(['repairAmpoule','comfortCream','essenceToner'].indexOf(k)>-1){if(sigOn('sting'))sigs.push('sting');if(sigOn('tight'))sigs.push('tight')}
      if(['soothingGel','soothingCream','essenceToner'].indexOf(k)>-1){if(sigOn('heat'))sigs.push('heat');if(sigOn('red'))sigs.push('red')}
      return {k:k,i:i,img:img?img.getAttribute('src'):'',name:nm?nm.textContent.trim():'',nmn:nmn,
        lead:drv.length?drv.join('·')+' · ':'',sig:sigs.length?SIG.filter(function(z){return sigs.indexOf(z.k)>-1}).map(function(z){return P(z.n)}).join('·')+' '+P(Q('신호','signal','信号','サイン'))+' → ':'',
        reason:P(WHY[k]||Q('','','',''))};
    });
  }

  function apply(){
    var sheet=document.querySelector('.solution-sheet');if(!sheet)return;
    sheet.querySelectorAll('.rx-balance-score').forEach(function(n){n.remove()});
    var diag=sheet.querySelector('.rx-diagnosis');
    if(diag){diag.classList.add('sm-one');var old=sheet.querySelector('.sm-skinmap');if(old)old.remove();diag.insertAdjacentHTML('afterend',skinMap());var oc=sheet.querySelector('.cd-card');if(oc)oc.remove();var sm=sheet.querySelector('.sm-skinmap');if(sm)sm.insertAdjacentHTML('afterend',codeCard());}
    var ow=sheet.querySelector('.why-card');if(ow)ow.remove();var mx=sheet.querySelector('.rx-matrix');if(mx)mx.insertAdjacentHTML('afterend',whyCard());
    var oldBox=sheet.querySelector('.bx-wrap');if(oldBox)oldBox.remove();
    sheet.insertAdjacentHTML('beforeend',boxCard());
  }
  function syncBox(){var w=document.querySelector('.solution-sheet .bx-wrap');if(w)w.outerHTML=boxCard();var y=document.querySelector('.solution-sheet .why-card');if(y){var h=whyCard();if(h)y.outerHTML=h;}}

  if(typeof paperRender==='function'){
    var prev=paperRender;
    paperRender=function(){var r=prev.apply(this,arguments);try{apply()}catch(e){console.warn('skinmap',e)}return r;};
  }
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-rx-tier]'))setTimeout(syncBox,30);});
  window.__sioreResultUpgrade={apply:apply,mountSignals:mountSignals};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountSignals);else mountSignals();
})();
