/* ───────── 시오레 셀링카드 · 제품별 판매 인사이트 + 피부 고민별 기초세트 ─────────
   수치·조건은 assets/products.js(브랜드 교육자료 기준)에서 그대로 가져옵니다. 문구는 편집모드로 수정 가능. */
const SELL={
 0:{hero:false,band:['NMN 500 ppm','PDRN · 글루타치온 · 피크노제놀'],who:['세안 후 당김 · 메이크업 잔여감','Gentle deep cleansing · 洁面不紧绷 · つっぱらない洗顔'],proof:0,
    talk:'메이크업과 미세먼지까지 씻어내면서도 세안 후 당기지 않습니다. 메이크업을 하지 않는 고객에게는 여드름성 피부 사용 적합 시험을 마친 데일리 클렌저로 소개해 보세요.',pair:[2,'세안 다음 단계로 NMN 케어까지']},
 1:{hero:false,band:['NMN 10,000 ppm','글루타치온 · 카르노신 · 병풀'],who:['칙칙함 · 세안 직후 건조','Dullness & dehydration · 暗沉·缺水 · くすみ・乾燥'],proof:1,
    talk:'손등에 한 번 펴 발라 보여주세요. 버블이 사라지며 남는 촉촉함이 설명을 대신합니다. 토너 단계부터 광채를 챙기고 싶은 고객에게.',pair:[2,'토너 다음은 세럼으로']},
 2:{hero:true,band:['NMN 10,000 ppm','알파리포산 · PDRN · 피크노제놀'],who:['잔주름 · 탄력 저하','Fine lines & firmness · 细纹·弹力 · 小じわ・ハリ'],proof:0,
    talk:'시오레를 처음 만나는 고객에게 가장 먼저 권하는 대표 세럼입니다. 리치크림과 함께 쓰면 1회 사용 직후 광채 564.64% 개선 결과가 있어, 자연스럽게 세트로 이어집니다.',pair:[4,'함께 쓰면 광채 564.64%↑*'],note:'* 세럼+리치크림 병행, 1회 사용 직후 결과'},
 3:{hero:false,band:['NMN 10,000 ppm','세라마이드 · 병풀 · 레스베라트롤'],who:['하루 종일 건조 · 가벼운 보습','All-day hydration · 全天保湿 · 一日中うるおい'],proof:2,
    talk:'무겁지 않은 마무리에 24시간 보습 지속력까지. 리치크림이 부담스러운 고객, 지성·복합성 고객에게 권하기 좋은 NMN 라인의 데일리 크림입니다.',pair:[1,'버블토너와 함께 가벼운 루틴']},
 4:{hero:false,band:['NMN 10,000 ppm','PDRN · 글루타치온 · 피크노제놀'],who:['깊은 주름 · 건조 · 나이트 케어','Deep lines & dryness · 皱纹·干燥 · シワ・乾燥'],proof:0,
    talk:'NMN 라인의 마무리 크림입니다. 팔자주름과 입가주름 감소 결과가 있어, 저녁 집중 케어를 찾는 고객에게 세럼과 한 세트로 제안하세요.',pair:[2,'세럼과 함께 쓰면 광채 564.64%↑*'],note:'* 세럼+리치크림 병행, 1회 사용 직후 결과'},
 5:{hero:false,band:['감나무잎수 85%','병풀 · 펩타이드 · RICE-EGF'],who:['예민한 피부 · 성분에 민감','Sensitive skin · 敏感肌 · 敏感肌'],proof:0,
    talk:'자극지수 0.00, 감나무잎수 85%의 순한 토너입니다. 성분을 꼼꼼히 보는 고객이나 피부가 예민해진 고객의 첫 제품으로 부담이 적습니다.',pair:[7,'다음 단계는 카밍 수딩젤']},
 6:{hero:false,band:['병풀 · 판테놀','펩타이드 · 밀싹추출물'],who:['피지 · 트러블 걱정','Oil & blemish-prone · 油脂·痘痘肌 · 皮脂・ニキビ肌'],proof:0,
    talk:'여드름성 피부 사용 적합 시험을 마친 앰플로, 2주 사용 후 피지 분비량 감소 결과가 있습니다. 번들거림과 트러블 걱정을 함께 가진 고객에게.',pair:[8,'같은 시험을 마친 컴포트 크림까지']},
 7:{hero:true,band:['병풀 · 판테놀 · 히알루론산','펩타이드 · 밀싹추출물'],who:['열감 · 붉어짐 · 각질','Heat & redness · 泛红·发热 · ほてり・赤み'],proof:0,
    talk:'손등에 발라 바로 느껴지는 시원함으로 권하기 가장 쉬운 진정 젤입니다. 햇볕이나 열감으로 달아오른 피부, 각질이 일어나는 피부에 진정·보습·각질 케어를 한 번에.',pair:[5,'순한 에센스 토너와 함께']},
 8:{hero:false,band:['병풀 · 판테놀 · 히알루론산','펩타이드 · 밀싹추출물'],who:['번들거림 · 트러블 걱정 없는 보습','Oily, blemish-prone · 油性·痘痘肌 · 脂性・ニキビ肌'],proof:1,
    talk:'여드름성 피부 사용 적합 시험을 마친 크림입니다. 보습은 필요하지만 크림이 부담스러웠던 고객에게, 산뜻한 마무리로 권해 보세요.',pair:[6,'리페어 앰플과 함께 트러블 걱정 케어']}
};
const SETS=[
 {key:'firm',tag:'탄력 · 잔주름',en:'Firming & Anti-wrinkle',title:'NMN 안티에이징 기본 세트',ids:[0,1,2,4],for:'잔주름과 탄력 저하가 고민인 고객',talk:'세럼과 리치크림을 함께 쓰면 1회 사용 직후 광채 564.64% 개선*. 세안부터 마무리까지 NMN으로 채우는 시오레의 대표 루틴입니다.',note:'* 세럼+리치크림 병행, 1회 사용 직후 결과'},
 {key:'glow',tag:'수분 · 광채',en:'Hydration & Glow',title:'데일리 광채 세트',ids:[1,2,3],for:'피부가 칙칙하고 쉽게 건조해지는 고객',talk:'버블토너로 수분과 광채를 채우고, 세럼과 수딩크림으로 가볍게 마무리합니다. 무거운 제형을 싫어하는 고객에게 맞는 구성입니다.'},
 {key:'calm',tag:'진정 · 예민',en:'Soothing & Sensitive',title:'DAILY RELIEF 진정 세트',ids:[5,7,8],for:'열감·붉어짐이 잦고 성분에 민감한 고객',talk:'자극지수 0.00 토너, 시원한 수딩젤, 산뜻한 크림까지. 예민해진 피부를 순하게 진정시키는 구성입니다.'},
 {key:'trouble',tag:'피지 · 트러블',en:'Oil & Blemish-prone',title:'여드름성 피부 맞춤 세트',ids:[0,6,8],for:'번들거림과 트러블 걱정이 함께 있는 고객',talk:'세 제품 모두 여드름성 피부 사용 적합 시험을 마쳤습니다. 세안부터 보습까지 트러블 걱정을 덜어 주는 구성입니다.'},
 {key:'first',tag:'첫 구매 · 선물',en:'Best of SIORÉ',title:'시오레 베스트 3',ids:[0,2,7],for:'시오레를 처음 만나는 고객 · 여행 선물을 찾는 외국인 고객',talk:'대표 세럼과 가장 권하기 쉬운 수딩젤, 그리고 데일리 클렌저. 브랜드를 한 번에 경험할 수 있는 입문 구성입니다.'}
];
const won=n=>n.toLocaleString('ko-KR')+'원';
const PBYID=id=>PRODUCTS.find(p=>p.id===id);
function scBadges(id){const c=(window.SIORE_CERTS||{})[id]||[];const b=[];if(SELL[id]&&SELL[id].hero)b.push('<span class="scb hero">★ 대표 제품</span>');if(c.includes('noncomedo'))b.push('<span class="scb nc">여드름성 피부 사용 적합</span>');if(c.includes('irritation'))b.push('<span class="scb ir">자극지수 0.00</span>');return b.join('')}
function sellCard(id){const p=PBYID(id),s=SELL[id];if(!p||!s)return'';const st=(p.stats||[])[s.proof]||{};const pp=PBYID(s.pair[0]);
 return `<article class="sc${s.hero?' is-hero':''}" id="sc-${id}"><div class="sc-top"><div class="sc-badges">${scBadges(id)}</div><img src="${p.picture}" alt="${p.short}" loading="lazy"><span class="sc-line">${p.line} · ${p.size}</span><b class="sc-name">${p.short}</b><span class="sc-rrp">권장 소비자가 <strong>${won(p.price)}</strong></span></div>
 <div class="sc-band"><b>${s.band[0]}</b><small>${s.band[1]}</small></div>
 <div class="sc-who"><em>이런 고객에게</em><b>${s.who[0]}</b><small>${s.who[1]}</small></div>
 <div class="sc-proof"><strong>${st.value||''}</strong><span>${st.label||''}</span><small>${st.condition||''}</small></div>
 <div class="sc-talk"><em>이렇게 권하세요</em><p>${s.talk}</p></div>
 <a class="sc-pair" href="#" data-sc="${s.pair[0]}"><img src="${pp.picture}" alt=""><span><em>함께 권하기</em><b>${pp.short}</b><small>${s.pair[1]}</small></span></a>${s.note?`<p class="sc-note">${s.note}</p>`:''}</article>`}
function sellSet(set,i){const items=set.ids.map(PBYID);const total=items.reduce((a,p)=>a+p.price,0);
 return `<article class="ss ss-${set.key}"><div class="ss-head"><span class="ss-n">SET ${String(i+1).padStart(2,'0')}</span><span class="ss-tag">${set.tag}</span><small>${set.en}</small></div><b class="ss-title">${set.title}</b><p class="ss-for">${set.for}</p>
 <ol class="ss-steps">${items.map((p,k)=>`<li><a href="#" data-sc="${p.id}"><img src="${p.picture}" alt="${p.short}" loading="lazy"><span><em>STEP ${k+1} · ${p.category}</em><b>${p.short}</b></span></a></li>`).join('')}</ol>
 <div class="ss-talk"><em>이렇게 제안하세요</em><p>${set.talk}</p>${set.note?`<small>${set.note}</small>`:''}</div>
 <div class="ss-total"><span>권장 소비자가 합계</span><strong>${won(total)}</strong></div>
 <p class="ss-add">＋ 이너뷰티를 함께 찾는 고객에게는 <a href="#" data-sc-pdrn>마시는 PDRN 200</a></p></article>`}
function selling(){const nmn=[0,1,2,3,4],dr=[5,6,7,8];
 return `<section class="sc-hero"><span class="overline">SELLING CARD</span><h1>피부 고민에서 제품까지,<br><em>한 장으로 설명합니다.</em></h1><p>제품마다 핵심 성분, 어울리는 고객, 대표 시험 결과, 권하는 말까지 정리했습니다. 매대 옆에 두고 상담에 바로 쓰세요.</p><nav class="sp-jump"><a href="#" data-jump="sc-nmn">NMN LINE</a><a href="#" data-jump="sc-dr">DAILY RELIEF</a><a href="#" data-jump="sc-sets">피부 고민별 기초세트</a><a href="#" class="sc-print" data-print>인쇄하기</a></nav></section>
 <section class="sc-block" id="sc-nmn"><div class="sc-lhead"><span class="dot d-n"></span><b>NMN LINE</b><small>탄력 · 광채 · 보습 — 피부 에너지를 채우는 NMN 루틴</small></div><div class="sc-grid g5">${nmn.map(sellCard).join('')}</div></section>
 <section class="sc-block" id="sc-dr"><div class="sc-lhead"><span class="dot d-r"></span><b>DAILY RELIEF</b><small>진정 · 보습 · 피부 밸런스 — 예민한 날을 위한 순한 루틴</small></div><div class="sc-grid g4">${dr.map(sellCard).join('')}</div></section>
 <section class="sc-block" id="sc-sets"><div class="section-head"><span class="overline">ROUTINE SETS</span><h2>피부 고민별 기초세트</h2><p>고객의 고민을 한 가지 묻고, 세트로 제안하세요. 단품보다 루틴으로 권할 때 설명이 쉬워지고 재구매로 이어집니다.</p></div><div class="ss-grid">${SETS.map(sellSet).join('')}</div></section>
 <p class="sc-fine">시험 결과는 해당 제품·시험 조건에 한하며 개인차가 있습니다. 시험 기관·대상·기간은 제품·근거 탭의 각 제품 상세에서 확인할 수 있습니다. 권장 소비자가는 공식몰 판매가 기준입니다.</p>${window.closingCta?closingCta():''}`}
function bindSelling(){document.querySelectorAll('[data-sc]').forEach(a=>a.onclick=e=>{e.preventDefault();const t=document.getElementById('sc-'+a.dataset.sc);if(t){t.scrollIntoView({behavior:'smooth',block:'center'});t.classList.remove('flash');void t.offsetWidth;t.classList.add('flash')}});
 document.querySelectorAll('[data-sc-pdrn]').forEach(a=>a.onclick=e=>{e.preventDefault();location.hash='products'});
 document.querySelectorAll('[data-print]').forEach(a=>a.onclick=e=>{e.preventDefault();window.print()})}
