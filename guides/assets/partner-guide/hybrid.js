function renderD(){
 return `${header()}
 <main class="hybrid-page">
  <section class="hybrid-hero" aria-labelledby="hybrid-title">
   <img class="hybrid-scene" src="assets/partner-guide/assets/pharmacy-brand-zone.jpg" alt="시오레 로고 아래 NMN과 데일리 릴리프 제품, 상담용 테스터가 정돈된 실제 진열 공간" fetchpriority="high">
   <div class="hybrid-copy"><span class="eyebrow">SIORÉ · PHARMACY PARTNERS</span><h1 id="hybrid-title">우리 약국에,<br><em>시오레를 더하다.</em></h1><p>진열부터 상담, 판매 지원까지.<br>입점 이후의 운영을 함께 준비합니다.</p><button class="button primary" data-start>입점 준비하기 ${icon('arrow')}</button></div>
   <div class="hybrid-scene-note"><span><i></i> 실제 시오레 세팅 사례</span><button data-open="settings">다양한 진열 사례 ${icon('arrow')}</button></div>
  </section>
  <div class="hybrid-proof">${partnerProof()}</div>
  <div class="hybrid-content">
   <section class="hybrid-intro"><span class="section-index">01 / START</span><div><h2>시작은 간결하게.<br class="mobile-break"> 준비는 함께.</h2><p>서류를 준비하고 몰에 가입하면,<br>담당자가 확인 후 첫 주문을 안내합니다.</p></div></section>
   ${flow()}${documentBox()}
   <section class="hybrid-intro support-intro"><span class="section-index">02 / TOGETHER</span><div><h2>제품이 들어온 다음까지,<br class="mobile-break"> 함께합니다.</h2><p>약국의 공간과 상담 환경에 맞춰<br>필요한 지원을 연결합니다.</p></div></section>
   <div class="hybrid-benefits">${benefits()}</div>
   <section class="hybrid-settings" aria-labelledby="setting-title"><div class="setting-intro"><span class="eyebrow">A PLACE FOR SIORÉ</span><h2 id="setting-title">큰 공간이든,<br>작은 선반이든.</h2><p>기존 약국의 공간에 맞춰<br>브랜드 진열과 일반 RRP를 제안합니다.</p><button class="text-btn" data-open="settings">실제 세팅 살펴보기 ${icon('arrow')}</button></div><figure><img src="assets/partner-guide/assets/pharmacy-counter.jpg" alt="제품과 상담용 안내물이 함께 놓인 시오레 진열대 VMD" loading="lazy"><figcaption><small>01 / DISPLAY</small><b>브랜드 진열</b><span>제품과 상담용 안내물을 함께.</span></figcaption></figure><figure><img src="assets/partner-guide/assets/pharmacy-rrp.jpg" alt="기존 약국 선반에 적용된 시오레 일반 RRP 진열" loading="lazy"><figcaption><small>02 / SHELF</small><b>일반 RRP 진열</b><span>기존 선반에 간결하게.</span></figcaption></figure></section>
   <section class="hybrid-order"><div><span class="eyebrow">FIRST SKU SELECTION</span><h2>첫 제품 구성도,<br>우리 약국에 맞게.</h2><p>핵심 제품부터 시작하거나<br>주요 고객의 피부 고민에 맞춰 선택하세요.</p><a class="text-btn" href="https://logan-pb.github.io/siore-showroom/" target="_blank" rel="noopener">SKU 선정 가이드 열기 ${icon('arrow')}</a><span class="order-note">영업자료의 6번 입점 상담에서 확인하세요.</span></div><div class="order-options"><article><span>A</span><div><small>핵심 제품 중심</small><h3>핵심 4종 구성</h3><p>버블토너 · 세럼 · 리치크림 · 컴포트크림</p></div></article><article><span>B</span><div><small>주요 고객의 피부 고민 중심</small><h3>니즈별 3종 구성</h3><p>안티에이징 · 시술 후 진정 회복<br>여드름성·트러블 · 열감·홍조 피부</p></div></article></div></section>
   ${guideCollection()}
   <section class="hybrid-policy" id="policy"><div class="policy-intro"><span class="section-index">03 / PARTNER POLICY</span><h2>오래 함께하기 위한,<br>거래 안내.</h2><p>주문과 운영에 필요한 기준을<br>미리 확인해 주세요.</p></div>${terms()}</section>
   ${contact()}
  </div>
 </main>${bottom()}`;
}

function guideCollection(){return `<section class="guide-collection" id="collection"><span class="section-index">PRODUCT COLLECTION</span><h2>제품을 알고, 우리 약국에 맞게.</h2><p class="collection-lead">10개 제품의 주요 성분과 특징, 추천 고객을 확인하세요.</p>${[['nmn','NMN LINE','탄력 · 주름 · 광채',0,5],['relief','DAILY RELIEF','진정 · 수분 · 보습장벽',5,9],['inner','INNER BEAUTY','PDRN · 콜라겐 · NMN · 병풀',9,10]].map(([key,name,desc,start,end])=>`<div class="collection-line ${key}"><div class="collection-label"><h3>${name}</h3><span>${desc}</span></div><div class="collection-products">${PRODUCTS.slice(start,end).map(p=>`<button class="collection-product" data-product-detail="${p.id}"><img src="${p.picture}" alt="${p.name}" loading="lazy"><div><small>${p.category}</small><h4>${p.short}</h4><p>${p.summary}</p><strong>${p.focus}</strong><span class="collection-more">성분 · 제품 설명 보기 ↗</span></div></button>`).join('')}</div></div>`).join('')}</section>`;}
