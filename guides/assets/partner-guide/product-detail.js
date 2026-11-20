/* SIORÉ 제품 상세 v2 — 무드컬렉트 에디션 레이아웃 · 이어보기(이전/다음·썸네일·스와이프·←→) · 제형 애니메이션 */
(function(){
const TEX={0:'cleansing',1:'bubble',2:'serum',3:'soothing-cream',4:'rich-cream',5:'essence-toner',6:'ampoule',7:'soothing-gel',8:'comfort-cream'};
const texSrc=id=>TEX[id]!=null?`../images/textures/${TEX[id]}-texture.jpg`:'';
const lineKey=p=>p.line==='DAILY RELIEF'?'rel':p.line==='INNER BEAUTY'?'inn':'nmn';
const won=n=>n?n.toLocaleString('ko-KR')+'원':'';
let cur=0,tx=null;
/* 제품별 인증 (상담링크 인증서·시험결과표·리플렛 기준) */
const CERT_META={dermatest:['dermatest-excellent-2025','Dermatest EXCELLENT'],irritation:['cert-irritation','피부자극지수 0.00'],noncomedo:['cert-noncomedo','논코메도제닉']};
const CERTS={0:['irritation','noncomedo'],1:['irritation'],2:['dermatest','irritation'],3:['irritation'],4:['irritation'],5:['irritation'],6:['noncomedo'],7:['irritation','noncomedo'],8:['irritation','noncomedo'],9:[]};
window.SIORE_CERTS=CERTS;window.SIORE_CERT_META=CERT_META;
window.certBadges=(id,cls='cert-col')=>{const c=CERTS[id]||[];return c.length?`<span class="${cls}">${c.map(k=>`<span class="cert-b" title="${CERT_META[k][1]}"><img src="../images/cert/${CERT_META[k][0]}.png?v=2" alt="${CERT_META[k][1]}"></span>`).join('')}</span>`:'';};
/* 제품별 인체적용시험 결과 카드 */
const CARDS={0:['cleansing-makeup','cleansing-waste'],1:['bubble-moisture','bubble-glow','bubble-texture','bubble-soothing'],2:['serum-mouth-wrinkle','serum-eye-wrinkle','serum-elasticity','serum-glow'],3:['soothing-cream-moisture','soothing-cream-24h','soothing-cream-transparency'],4:['rich-lifting','rich-moisture','rich-density'],5:['essence-moisture','essence-texture'],6:['ampoule-barrier','ampoule-soothing','ampoule-elasticity','ampoule-trouble'],7:['gel-immediate-moisture','gel-24h','gel-sebum'],8:['comfort-moisture','comfort-soothing','comfort-pigmentation','comfort-texture'],9:[]};

function view(id){
  const p=PRODUCTS[id],L=(typeof LEAFLETS!=='undefined'&&LEAFLETS[id])||null,k=lineKey(p);
  const price=(typeof RRP!=='undefined'&&RRP[id])||p.price;
  const stats=(p.stats||[]).slice(0,4);
  const tex=texSrc(id);
  const desc=(p.description||[]);
  return `<article class="pd pd-${k}">
  <div class="pd-nav"><button class="pd-arrow" data-pd="-1" aria-label="이전 제품">‹</button><span class="pd-count"><b>${id+1}</b> / ${PRODUCTS.length}</span><button class="pd-arrow" data-pd="1" aria-label="다음 제품">›</button></div>
  <div class="pd-stage">
    ${tex?`<div class="pd-tex" style="background-image:url('${tex}')"></div><div class="pd-sheen"></div>`:`<div class="pd-tex pd-tex-plain"></div>`}
    <img class="pd-prod" src="${p.picture}" alt="${p.name}">${certBadges(id,"cert-col pd-certs")}
    <span class="pd-texlabel">${p.texture?p.texture.split('·')[0].trim():''}</span>
  </div>
  <div class="pd-body">
    <div class="pd-row"><span class="pd-pill">SIORÉ · PHARMACY EDITION</span><span class="pd-meta"><i class="dot d-${k}"></i>${p.line} · ${p.size}${price?` · 권장 소비자가 <b>${won(price)}</b>`:''}</span></div>
    <h2 class="pd-name">${p.name}</h2>
    <p class="pd-head">${L?L.focus:p.focus}</p>
    <p class="pd-sum">${L?L.summary:p.summary}</p>
    <div class="pd-cards">
      <div class="pd-card"><p class="pd-cap">제형 · 사용감</p><p>${p.texture||''}</p>${(p.ingredients||[]).length?`<div class="pd-chips">${p.ingredients.map(x=>`<span>${x}</span>`).join('')}</div>`:''}</div>
      <div class="pd-card"><p class="pd-cap">이렇게 설명해요</p>${desc.map(([t,d])=>`<p class="pd-pt"><b>${t}</b><br>${d}</p>`).join('')}</div>
    </div>
    <section class="pd-clin">
      <div class="pd-clin-h"><p class="pd-cap">${p.line==='INNER BEAUTY'?'1포 함량':'인체적용시험 결과'}</p>${(CERTS[id]||[]).length?`<div class="pd-badges">${CERTS[id].map(k=>`<span>${CERT_META[k][1]}</span>`).join('')}</div>`:''}</div>
      <div class="pd-stats s${stats.length}">${stats.map(s=>`<div><b>${s.value}</b><span>${s.label}</span><small>${s.condition||''}</small></div>`).join('')}</div>
      ${(CARDS[id]||[]).length?`<div class="pd-graphs">${CARDS[id].map(c=>`<img src="../images/clinical/cards/${c}.png" alt="인체적용시험 결과 그래프" loading="lazy">`).join('')}</div>`:''}
    </section>
    <div class="pd-band"><p><b>이런 고객에게</b><br>${(p.customer||'').split('·').map(x=>x.trim()).filter(Boolean).join(' · ')}</p></div>
    <p class="pd-foot">${p.line==='INNER BEAUTY'?'함량 기준':'시험 정보'}: ${p.condition||''} · 개인차가 있을 수 있습니다.</p>
  </div>
  <div class="pd-rail" role="navigation" aria-label="제품 이어보기">${PRODUCTS.map((q,i)=>`<button data-pdi="${i}" aria-current="${i===id}" title="${q.short}"><img src="${q.picture}" alt=""><span>${q.short}</span></button>`).join('')}</div>
  </article>`;
}

function bind(){
  const d=document.getElementById('detail'),b=document.getElementById('detail-body');
  b.querySelectorAll('[data-pd]').forEach(x=>x.onclick=()=>go(cur+Number(x.dataset.pd)));
  b.querySelectorAll('[data-pdi]').forEach(x=>x.onclick=()=>go(Number(x.dataset.pdi)));
  const on=b.querySelector('.pd-rail [aria-current=true]');on&&on.scrollIntoView({block:'nearest',inline:'center'});
}
function go(id){
  const n=PRODUCTS.length;cur=(id+n)%n;
  const d=document.getElementById('detail'),b=document.getElementById('detail-body');
  b.innerHTML=view(cur);d.scrollTop=0;bind();
}
window.openProduct=function(id){
  const d=document.getElementById('detail');
  d.classList.remove('leaflet-dialog','selection-dialog');d.classList.add('pd-dialog');
  d.setAttribute('aria-label','제품 상세 이어보기');
  go(Number(id));
  if(!d.open)d.showModal();
};
const d=document.getElementById('detail');
d.addEventListener('close',()=>d.classList.remove('pd-dialog'));
document.addEventListener('keydown',e=>{if(!d.open||!d.classList.contains('pd-dialog'))return;if(e.key==='ArrowRight')go(cur+1);if(e.key==='ArrowLeft')go(cur-1);});
d.addEventListener('touchstart',e=>{if(!d.classList.contains('pd-dialog'))return;if(e.target.closest('.pd-rail'))return;tx=e.touches[0].clientX},{passive:true});
d.addEventListener('touchend',e=>{if(tx==null)return;const dx=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(dx)>60)go(cur+(dx<0?1:-1));});
})();
