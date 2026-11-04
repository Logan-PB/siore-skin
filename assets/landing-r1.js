/* SIORÉ 첫 화면 R1 '정돈형 2단' (2026-11-04)
   - 첫 화면에서 바로 피부 고민(최대 3개, 순서 유지)을 고르고 상담 시작
   - 기존 로비 버튼(상담시작·상담 기록·약사 추천 3종 세트·언어·인증 배지)은 그대로 두고 클릭만 연결
   - 반응형: 1024px 이상 2단(사진 오른쪽) / 그 아래는 1단, 모델 사진은 고민 선택 아래 카드로 항상 노출 */
(function(){
  'use strict';
  var IMG='images/official-scenes/serum-application.webp';
  var C=function(ko,en,zh,ja){return {ko:ko,en:en,zh:zh,ja:ja}};
  var CONCERNS=[
    ['건조','dryness',C('건조','Dryness','干燥','乾燥'),C('당김·푸석함','Tight, rough','紧绷·粗糙','つっぱり・カサつき')],
    ['민감','sensitivity',C('민감','Sensitivity','敏感','敏感'),C('쉽게 예민해짐','Easily irritated','容易敏感','ゆらぎやすい')],
    ['열감홍조','redness',C('열감·홍조','Heat / redness','热感 / 泛红','ほてり / 赤み'),C('화끈·붉어짐','Warm, flushed','发热·泛红','ほてり・赤み')],
    ['안티에이징','firmness',C('안티에이징','Firmness','弹力 / 熟龄护理','エイジングケア'),C('탄력 고민','Firmness care','弹力护理','ハリ不足')],
    ['광채톤업','radiance',C('광채·톤업','Radiance / tone','光泽 / 肤色','ツヤ / トーン'),C('칙칙한 톤','Dull tone','肤色暗沉','くすみ')],
    ['트러블','blemish',C('트러블','Blemishes','痘痘困扰','肌荒れ'),C('트러블 고민','Breakout-prone','容易长痘','肌荒れしやすい')],
    ['피지','sebum',C('피지','Sebum','油脂','皮脂'),C('번들거림','Shiny, oily','油光','テカリ')],
    ['장벽회복','barrier',C('장벽회복','Barrier care','屏障修护','バリアケア'),C('건조·예민 반복','Dry & sensitive cycles','反复干燥敏感','乾燥・ゆらぎの繰り返し')],
    ['각질','texture',C('각질','Texture','角质 / 肤理','角質 / キメ'),C('거친 결','Rough texture','肤理粗糙','ごわつき')]
  ];
  var TX={
    eyebrow:C('약사가 설계한 바르는 피부 영양제','Pharmacist-designed skin nutrition','药师设计的外用肌肤营养','薬剤師が設計した“塗る肌の栄養”'),
    h1:C('오늘 가장 신경 쓰이는 <br><em>피부 고민</em>을 골라 주세요','Choose the <em>skin concerns</em> <br>on your mind today','请选择您今天<br>最在意的<em>肌肤困扰</em>','今いちばん気になる<br><em>肌悩み</em>を選んでください'),
    lead:C('최대 3개까지 · 고른 순서대로 우선 케어해요','Up to 3 · we care for them in the order you pick','最多3项 · 按选择顺序优先护理','最大3つまで・選んだ順に優先ケア'),
    box:C('피부 고민','Skin concerns','肌肤困扰','肌悩み'),
    go:C('이 고민으로 상담 시작','Start with these concerns','按这些困扰开始咨询','この悩みで相談スタート'),
    go0:C('상담 시작','Start consultation','开始咨询','相談スタート'),
    max:C('최대 3개까지 고를 수 있어요','You can choose up to 3','最多可选择3项','最大3つまで選べます'),
    qrT:C('휴대폰으로 이어보기','Continue on your phone','在手机上继续','スマホで続ける'),
    qrS:C('QR을 찍으면 내 폰에서<br>결과를 저장할 수 있어요','Scan to save your<br>result on your phone','扫码即可在手机上<br>保存结果','QRを読み取ると<br>スマホで結果を保存できます'),
    clin:C('임상 전후 보기 ↗','Before & after ↗','使用前后对比 ↗','使用前後を見る ↗')
  };
  var sel=[];
  function lang(){var l=(document.body&&document.body.dataset.displayLanguage)||'';if(!l){try{l=languageMode}catch(e){}}l=String(l||'ko').slice(0,2);return TX.go[l]?l:'ko'}
  function t(m){return m[lang()]||m.ko}
  function q(s,r){return (r||document).querySelector(s)}
  function lobby(){return q('.focus-lobby')}
  function txtOf(s,fb){var e=q('.focus-lobby '+s);if(!e)return fb;var m=e.querySelector('.i18n-main');if(m)return m.textContent.trim()||fb;var c=e.cloneNode(true);[].forEach.call(c.querySelectorAll('.i18n-ko,small,[lang=ko]'),function(x){if(lang()!=='ko')x.remove()});var v=c.textContent.trim();return v||fb}
  function arrow(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'}

  function tiles(){
    return CONCERNS.map(function(c){var i=sel.indexOf(c[0]);
      return '<button type="button" class="rl-tile'+(i>-1?' is-on':'')+'" data-rl-concern="'+c[0]+'" aria-pressed="'+(i>-1)+'">'
        +'<span class="rl-ic"><img src="images/concerns/'+c[1]+'.svg" alt=""></span>'
        +'<span class="rl-tx"><b>'+t(c[2])+'</b><small>'+t(c[3])+'</small></span>'
        +(i>-1?'<span class="rl-no">'+(i+1)+'</span>':'')+'</button>';}).join('');
  }
  function dots(){var h='';for(var i=0;i<3;i++)h+='<i'+(i<sel.length?' class="on"':'')+'></i>';return '<span class="rl-count" aria-live="polite">'+h+'<em>'+sel.length+' / 3</em></span>'}
  function cta(cls){return '<button type="button" class="rl-cta '+cls+'">'+t(sel.length?TX.go:TX.go0)+arrow()+'</button>'}

  function render(){
    var L=lobby();if(!L)return;
    var root=q('.rl',L);
    if(!root){root=document.createElement('section');root.className='rl';root.setAttribute('aria-label','SIORÉ');L.insertBefore(root,L.firstChild);L.classList.add('rl-active');document.body.classList.add('rl-on');bind(root)}
    var langBtns=[['ko','kr','한국어'],['en','us','English'],['zh','cn','中文'],['ja','jp','日本語']].map(function(x){return '<button type="button" class="'+(lang()===x[0]?'on':'')+'" data-rl-lang="'+x[0]+'"><img src="images/flags/'+x[1]+'.svg" alt="">'+x[2]+'</button>'}).join('');
    var setT=txtOf('.lobby-set-open','약사 추천 3종 세트'),recT=txtOf('.lobby-records-open','상담 기록');
    root.innerHTML=
      '<div class="rl-photo" style="background-image:url('+IMG+')"><button type="button" class="rl-chip rl-clin" data-rl-act="clin">'+t(TX.clin)+'</button>'
        +'<div class="rl-qr"><span class="rl-qrimg"></span><small><b>'+t(TX.qrT)+'</b>'+t(TX.qrS)+'</small></div></div>'
      +'<header class="rl-top"><img class="rl-logo" src="images/brand/siore-logo-official-black.png" alt="SIORÉ">'
        +'<div class="rl-certs">'+[0,1,2].map(function(i){var src=['dermatest-excellent-2025','cert-irritation','cert-noncomedo'][i];return '<button type="button" data-rl-cert="'+i+'"><img src="images/cert/'+src+'.png" alt=""></button>'}).join('')+'</div>'
        +'<nav class="rl-langs" aria-label="Language">'+langBtns+'</nav></header>'
      +'<div class="rl-main"><span class="rl-eyebrow">'+t(TX.eyebrow)+'</span><h1 class="rl-h1">'+t(TX.h1)+'</h1><p class="rl-lead">'+t(TX.lead)+'</p>'
        +'<div class="rl-box"><div class="rl-bh"><b>'+t(TX.box)+'</b>'+dots()+'</div><div class="rl-grid">'+tiles()+'</div>'
          +'<div class="rl-bar rl-bar-in">'+cta('rl-go')+'<button type="button" class="rl-ghost" data-rl-act="set">'+setT+'</button></div></div>'
        +'<div class="rl-mphoto" style="background-image:url('+IMG+')"><button type="button" class="rl-chip" data-rl-act="clin">'+t(TX.clin)+'</button></div>'
        +'<div class="rl-bar rl-bar-out">'+cta('rl-go')+'<div class="rl-two"><button type="button" class="rl-ghost" data-rl-act="rec">'+recT+'</button><button type="button" class="rl-ghost" data-rl-act="set">'+setT+'</button></div></div>'
        +'<div class="rl-foot"><button type="button" data-rl-act="rec">'+recT+'</button><button type="button" data-rl-act="clin">'+t(TX.clin)+'</button></div>'
      +'</div><div class="rl-toast" role="status"></div>';
  }
  function toast(m){var n=q('.rl .rl-toast');if(!n)return;n.textContent=m;n.classList.add('on');clearTimeout(n._t);n._t=setTimeout(function(){n.classList.remove('on')},1800)}

  function start(){
    var b=q('.focus-lobby .lobby-start');if(b)b.click();else{try{openFocus()}catch(e){}}
    var want=sel.slice();if(!want.length)return;
    setTimeout(function(){
      var cards=[].slice.call(document.querySelectorAll('#focus-dialog .concern-card[data-concern]'));
      cards.forEach(function(c){if(c.getAttribute('aria-pressed')==='true'&&want.indexOf(c.dataset.concern)<0)c.click()});
      want.forEach(function(k){var c=cards.filter(function(x){return x.dataset.concern===k})[0];if(c&&c.getAttribute('aria-pressed')!=='true')c.click()});
    },120);
  }
  function bind(root){
    root.addEventListener('click',function(e){
      var el=e.target.closest('button');if(!el||!root.contains(el))return;
      if(el.dataset.rlConcern){var k=el.dataset.rlConcern,i=sel.indexOf(k);
        if(i>-1)sel.splice(i,1);else if(sel.length>=3){toast(t(TX.max));return}else sel.push(k);
        render();var n=q('.rl [data-rl-concern="'+k+'"]');if(n)n.focus({preventScroll:true});return}
      if(el.classList.contains('rl-go')){start();return}
      if(el.dataset.rlLang){var o=q('.focus-lobby .language-option[data-lang="'+el.dataset.rlLang+'"]')||q('.language-option[data-lang="'+el.dataset.rlLang+'"]');if(o)o.click();setTimeout(render,60);return}
      if(el.dataset.rlCert){var cs=document.querySelectorAll('.focus-lobby .ref-cert-badge');if(cs[+el.dataset.rlCert])cs[+el.dataset.rlCert].click();return}
      var a=el.dataset.rlAct;
      if(a==='set'){var s=q('.focus-lobby .lobby-set-open');if(s)s.click()}
      else if(a==='rec'){var r=q('.focus-lobby .lobby-records-open');if(r)r.click()}
      else if(a==='clin'){try{var p=parent.document.getElementById('siore-clinical-launch');if(p){p.click();return}}catch(x){}try{showBanner()}catch(x){}}
    });
  }
  function syncFromDialog(){try{sel=(selectedConcerns||[]).slice(0,3)}catch(e){}render()}

  function init(){
    if(/[?&]landing=classic/.test(location.search))return;
    render();
    new MutationObserver(function(){var l=lang();if(l!==init._l){init._l=l;render()}}).observe(document.body,{attributes:true,attributeFilter:['data-display-language']});
    var L=lobby();if(L)new MutationObserver(function(){if(!q('.rl',L))render()}).observe(L,{childList:true});
    var d=q('#focus-dialog');if(d)d.addEventListener('close',syncFromDialog);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,0)});else setTimeout(init,0);
})();
