/* ───────── 시오레 입점 신청 약국 전달용 원페이지 (화이트 · 오렌지) ─────────
   ✏️ 접수 주소(JOIN_ENDPOINT)는 Apps Script 웹앱 배포 후 넣습니다. 비어 있으면 담당자 연락 안내로 대체됩니다. */
const OP={
  JOIN_ENDPOINT:'https://script.google.com/macros/s/AKfycby4jFHBBJ7lCAY9dvHk77IMwZTrkubrjND0mYk3BteQWFL9-utUXQRxTpFf-8Pmb5_S/exec',
  phone:'01031093106',phoneLabel:'010-3109-3106',
  mall:'https://siorekorea.co.kr/',
  sns:[['Instagram','@siore_global','https://www.instagram.com/siore_global/'],['TikTok','@siore_global','https://www.tiktok.com/@siore_global'],['공식몰','siore.co.kr','https://www.siore.co.kr'],['Amazon','amazon.com/siore','https://www.amazon.com/siore']]
};
const OPA='assets/partner-guide/assets/';
const OP_PRODUCTS=[
 {kr:'NMN 하이드로 캡슐 클렌징 밀크',en:'NMN Hydro Capsule Cleansing Milk',size:'150ml',price:38000,desc:'99% 고순도 NMN 500ppm. 부드러운 세정과 촉촉한 보습을 동시에 선사하는 클렌징 밀크',tags:'#NMN클렌징밀크 #보습캡슐클렌저 #저자극클렌징',pic:0,slide:17},
 {kr:'NMN 프레쉬 버블 토너',en:'NMN Fresh Bubble Toner',size:'145ml',price:38000,desc:'99% 고순도 NMN 10,000ppm. 버블 텍스처가 빠르게 흡수되어 광채와 생기를 더하는 버블 토너',tags:'#NMN버블토너 #광채토너 #수분버블케어',pic:1,slide:18,badge:'Hero Item'},
 {kr:'NMN 인텐시브 세럼',en:'NMN Intensive Serum',size:'50ml',price:44000,desc:'99% 고순도 NMN 10,000ppm. 피부 에너지와 탄력을 집중 케어하는 고농축 세럼',tags:'#NMN세럼 #안티에이징세럼 #고농축세럼',pic:2,slide:19,badge:'Best Seller'},
 {kr:'NMN 하이드레이팅 수딩 크림',en:'NMN Hydrating Soothing Cream',size:'50ml',price:32000,desc:'99% 고순도 NMN 10,000ppm. 단 1회 사용만으로도 수분과 진정을 동시에 채우는 수딩크림',tags:'#NMN수딩크림 #수분광크림 #속건조케어',pic:3,slide:20},
 {kr:'NMN 딥 글로우 리치 크림',en:'NMN Deep Glow Rich Cream',size:'50ml',price:44000,desc:'99% 고순도 NMN 10,000ppm. 깊은 영양과 탄력을 채워 광채 피부를 선사하는 안티에이징 리치크림',tags:'#NMN리치크림 #주름케어크림 #영양탄력케어',pic:4,slide:21,badge:'Best Seller'},
 {kr:'데일리 릴리프 에센스 토너',en:'Daily Relief Essence Toner',size:'150ml',price:39000,desc:'감나무잎수를 고함량으로 담아 민감해진 피부를 진정시키고, 깊은 수분감을 전달하는 에센스 토너',tags:'#감나무잎수토너 #에센스토너 #민감피부토너',pic:5,slide:27},
 {kr:'데일리 릴리프 리페어 앰플',en:'Daily Relief Repair Ampoule',size:'30ml',price:35000,desc:'병풀추출물 기반으로 피부 장벽을 강화하고 건강한 피부 컨디션을 유지해주는 진정·장벽 앰플',tags:'#병풀앰플 #장벽강화앰플 #민감피부앰플',pic:6,slide:28},
 {kr:'데일리 릴리프 카밍 수딩 젤',en:'Daily Relief Calming Soothing Gel',size:'80ml',price:35000,desc:'열감과 자극으로 예민해진 피부를 빠르게 진정시키고 산뜻하게 케어하는 쿨링 수딩 젤',tags:'#카밍수딩젤 #쿨링진정케어 #열감진정',pic:7,slide:29,badge:'Hero Item'},
 {kr:'데일리 릴리프 컴포트 크림',en:'Daily Relief Comfort Cream',size:'50ml',price:39000,desc:'건조하고 민감한 피부에 수분 보호막을 형성하여 편안한 피부 컨디션을 유지해주는 보습 크림',tags:'#데일리보습크림 #장벽크림 #저자극보습케어',pic:8,slide:30}
];
const opWon=n=>'₩'+n.toLocaleString('ko-KR');
function opCard(p,i){return `<button type="button" class="op-pc" data-op="${i}">${p.badge?`<span class="op-rib">${p.badge}</span>`:''}<img src="${OPA}product-${p.pic}.png" alt="${p.kr}" loading="lazy"><b class="op-en">${p.en}</b><span class="op-kr">${p.kr}</span><span class="op-sz">${p.size} / ${opWon(p.price)}</span><span class="op-desc">${p.desc}</span><span class="op-tags">${p.tags}</span><span class="op-more">상세 보기 ＋</span></button>`}
function opSetups(){return `<div class="ref-gallery op-gal">${SETUPS.map((s,i)=>`<${EDIT?'div':'button'} class="ref${s.wide?' wide':''}" data-ref="${i}" data-setup="${i}"><img src="${s.preview||asset+s.src}" alt="${s.title}" loading="lazy"><span class="ref-cap"><em>${s.tag}</em><b>${s.title}</b><small>${s.desc}</small></span></${EDIT?'div':'button'}>`).join('')}${window.editAddTile?editAddTile():''}</div>`}
const OP_REVIEWS=[
 {img:REF+'song.jpg',name:'송오브스킨 Song Of Skin',meta:'Instagram · 외부 집계 약 127만 팔로워',url:'https://www.instagram.com/reels/Dd4lUixvrSU/',label:'K-뷰티 크리에이터'},
 {name:'@tiffanymoonmd',meta:'Instagram · 94만',url:'https://www.instagram.com/p/Df4ycNRufeX/',label:'뷰티 전문가'},
 {name:'@kpharmacist_story',meta:'Instagram · 11.1만',url:'https://www.instagram.com/reel/Df8da1tNaMs/',label:'약사 채널 · 약들약'},
 {name:'@aniichakhunashvili',meta:'Instagram · 30.4만',url:'https://www.instagram.com/reel/Df1if6boqVc/',label:'뷰티 크리에이터'}
];
function partner(){const nmn=OP_PRODUCTS.slice(0,5).map((p,i)=>opCard(p,i)).join(''),dr=OP_PRODUCTS.slice(5).map((p,i)=>opCard(p,i+5)).join('');
return `<div class="op">
<header class="op-top"><div class="op-brand"><b>SIORÉ</b><span>약국 파트너 전용 안내</span></div><div class="op-tact"><a href="tel:${OP.phone}">담당자 상담 ${OP.phoneLabel}</a><a class="op-btn" href="#" data-opjump="op-join">B2B몰 가입하기</a></div></header>
<section class="op-hero"><div class="op-wrap op-hero-in"><div class="op-hero-t">
<p class="op-eye">WELCOME, PARTNER</p>
<h1>입점 신청해 주셔서<br>감사합니다.</h1>
<p class="op-lead">시오레를 약국에 들이기 전 필요한 모든 것을 한 페이지에 담았습니다. 살펴보신 뒤, 맨 아래에서 B2B몰 가입까지 바로 마치실 수 있어요.</p>
<ol class="op-steps"><li class="done"><small>STEP 1 · 완료</small><b>입점 신청 ✓</b></li><li class="now"><small>STEP 2 · 지금</small><b>B2B몰 가입</b></li><li><small>STEP 3</small><b>등급 승인</b></li><li><small>STEP 4</small><b>첫 주문</b></li></ol>
<div class="op-cta"><a class="op-btn lg" href="#" data-opjump="op-join">지금 B2B몰 가입하기 · 약 3분</a><a class="op-btn ghost lg" href="#" data-opjump="op-order">주문 안내 먼저 보기</a></div>
</div><img class="op-hero-img" src="${OPA}brand/hero-products.jpg" alt="시오레 전 제품"></div></section>
<nav class="op-toc" aria-label="페이지 목차"><div class="op-wrap">${[['op-brand-s','01 브랜드'],['op-product','02 제품 라인업'],['op-setting','03 세팅 사례'],['op-review','04 사용 후기'],['op-sns','05 SNS · 공식계정'],['op-order','06 주문 · 입점 안내'],['op-join','07 B2B몰 가입']].map(([k,n])=>`<a href="#" data-opjump="${k}"${k==='op-join'?' class="hot"':''}>${n}</a>`).join('')}</div></nav>

<section id="op-brand-s" class="op-sec op-wrap op-split"><img src="${OPA}brand/story-model.jpg" alt="시오레 브랜드">
<div><p class="op-eye">01 · BRAND</p><h2>약국 카운터의 질문에서 시작된,<br>약사가 설계한 바르는 피부 영양제</h2>
<p class="op-p">"어떤 제품을 써야 할까요?" 약사로서 수없이 들었던 질문에 답하기 위해 시작했습니다. 시오레는 건강기능식품과 제약 분야의 검증된 성분으로, 피부에 필요한 영양을 전달합니다.</p>
<div class="op-nums"><div><b>34+</b><span>제품별 인체적용시험</span></div><div><b>0.00</b><span>피부 자극지수</span></div><div><b>9종</b><span>미국 FDA MoCRA 리스팅</span></div></div>
<p class="op-sub">대표약사 고상온 · 임별 · (주)파마브로스</p></div></section>

<section id="op-product" class="op-sec op-wrap">
<div class="op-head"><p class="op-eye">02 · PRODUCT</p><a class="op-link" href="#selling">제품별 셀링카드 · 기초세트 →</a></div>
<h2 class="op-line"><span class="o">⁺NMN Anti-Aging</span> Solution</h2><p class="op-p">고순도 NMN과 검증된 유효 성분으로 피부 에너지와 탄력을 케어하는 안티에이징 솔루션. 제품을 누르면 상세 페이지가 열립니다.</p>
<div class="op-grid g5">${nmn}</div>
<h2 class="op-line"><span class="b">⁺Daily Relief</span> Solution</h2><p class="op-p">민감해진 피부를 진정시키고 수분과 장벽을 케어하는 데일리 피부 회복 솔루션.</p>
<div class="op-grid g4">${dr}</div></section>

<section id="op-setting" class="op-sec op-wrap"><p class="op-eye">03 · IN PHARMACY</p><h2>약국에 놓인 시오레</h2><p class="op-p">카운터 한 칸부터 브랜드존까지, 약국 공간에 맞춰 진열을 함께 준비합니다. 사진을 누르면 크게 볼 수 있습니다.</p>${opSetups()}</section>

<section id="op-review" class="op-sec op-tint"><div class="op-wrap"><div class="op-head"><p class="op-eye">04 · REVIEWS</p><a class="op-link" href="https://www.siore.co.kr" target="_blank" rel="noopener">공식몰 고객 후기 보기 ↗</a></div><h2>먼저 써본 크리에이터와 약사의 이야기</h2>
<div class="op-rev">${OP_REVIEWS.map((r,i)=>`<a class="op-rv${i===0?' big':''}" href="${r.url}" target="_blank" rel="noopener">${r.img?`<img src="${r.img}" alt="${r.name} 시오레 소개 콘텐츠"><span class="op-play" aria-hidden="true">▶</span>`:''}<span class="op-rv-t"><em>${r.label}</em><b>${r.name}</b><small>${r.meta}</small><span>콘텐츠 보기 ↗</span></span></a>`).join('')}</div>
<p class="op-fine">팔로워 수는 외부 집계 기준이며 시점에 따라 달라질 수 있습니다.</p></div></section>

<section id="op-sns" class="op-sec op-wrap"><p class="op-eye">05 · SNS &amp; OFFICIAL</p><h2>SNS에서 먼저 만나고, 약국에서 확인합니다</h2>
<div class="op-sns"><a class="op-visit" href="#" data-ref="visit"><img src="${REF}visit.jpg" alt="부산 블루랩약국 방문 콘텐츠"><span><em>PHARMACY VISIT</em><b>부산 블루랩약국 방문 사례</b><small>약국 방문 촬영 → 중화권 SNS 후기로 연결</small></span></a>
<div class="op-acc"><b>시오레 공식 계정</b>${OP.sns.map(([k,v,u])=>`<a href="${u}" target="_blank" rel="noopener"><b>${k}</b><span>${v} ↗</span></a>`).join('')}<a class="op-btn" href="${SUPPORT_CONFIG.seedingForm}" target="_blank" rel="noopener">우리 약국 포스팅 지원 신청 ↗</a></div></div></section>

<section id="op-order" class="op-sec op-wrap"><p class="op-eye">06 · ORDER GUIDE</p><h2>주문 · 입점 안내</h2>
<div class="op-flow"><div><b>01</b><strong>B2B몰 가입</strong><span>B2B몰에 회원가입한 뒤, 이 페이지 아래에서 아이디와 등록증을 보냅니다.</span></div><div><b>02</b><strong>등급 승인</strong><span>담당자가 서류를 확인하고 약국 등급으로 올려 드립니다.</span></div><div><b>03</b><strong>다시 로그인</strong><span><b style="color:var(--od)">중요!</b> 승인 문자를 받으면 로그아웃 후 다시 로그인해야 약국 공급가가 적용됩니다.</span></div><div><b>04</b><strong>첫 주문</strong><span>공급가를 확인하고 주문합니다. 진열 세팅은 담당자와 일정을 잡습니다.</span></div></div>
<div class="op-terms"><div><span class="op-pill">출고</span><p>평일 12:30 이전 주문은 당일 집하가 시작됩니다(제주 제외). 보통 1~2일 안에 도착합니다.</p></div><div><span class="op-pill">교품 · 반품</span><p>출고일로부터 90일 이내의 정상 제품은 거래 조건에 따라 지원합니다. 기획 출고 제품은 제한될 수 있습니다.</p></div><div><span class="op-pill">판매 조건</span><p>지정 약국 내 판매를 조건으로 공급하며, 온라인 재판매는 허용하지 않습니다.</p></div></div>
<a class="op-link" href="#enrollment">입점 절차 · 거래 조건 자세히 →</a></section>

<section id="op-join" class="op-sec op-join"><div class="op-wrap">
<p class="op-eye">07 · JOIN B2B MALL</p><h2>B2B몰 가입 → 승인 요청, 두 단계면 끝나요</h2>
<p class="op-p">로그인과 주문은 시오레 B2B몰에서 이루어지기 때문에, <b>회원가입은 아래 버튼으로 열리는 시오레 B2B몰(카페24) 화면에서 진행</b>됩니다. 가입을 마치신 뒤 이 페이지로 돌아와 STEP 2로 아이디와 등록증을 보내 주시면, 확인 후 바로 약국 등급으로 승인해 드립니다.</p>
<div class="op-join-in">
<div class="op-j1"><span class="op-jn">STEP 1</span><b class="op-jt">B2B몰 회원가입</b>
<ul class="op-tips"><li><b>회원구분</b> 개인회원으로 가입</li><li><b>아이디</b> 영문 소문자·숫자 4~16자 <small>(이메일 주소가 아니라 따로 정하는 아이디예요)</small></li><li><b>비밀번호</b> 대소문자·숫자·특수문자 중 2가지 이상, 10~16자 · 확인용으로 한 번 더 입력</li><li><b>그 외</b> 비밀번호 확인 질문·답변, 이름, 주소, 전화, 휴대전화, 이메일</li></ul>
<a class="op-btn lg" href="${OP.mall}member/agreement.html" target="_blank" rel="noopener">B2B몰 회원가입 하러 가기 ↗</a>
<p class="op-sub">이미 회원이신가요? <a href="${OP.mall}member/login.html" target="_blank" rel="noopener" class="op-u">B2B몰 로그인 ↗</a></p></div>
<form class="op-form" id="op-form" novalidate>
<b class="op-form-h"><span class="op-jn">STEP 2</span> 가입 후 승인 요청하기</b><p class="op-sub" style="margin:-4px 0 6px">B2B몰 가입만 하시면 담당자가 알 수 없어요. 여기서 보내 주셔야 빠르게 승인됩니다.</p>
<label><span class="op-lb">약국명 <i>*</i></span><input name="pharmacy" required placeholder="○○약국" autocomplete="organization"></label>
<label><span class="op-lb">대표약사 성함 <i>*</i></span><input name="owner" required autocomplete="name"></label>
<label><span class="op-lb">B2B몰 아이디 <i>*</i></span><input name="mallId" required placeholder="STEP 1에서 만든 아이디" autocapitalize="off" autocomplete="username"></label>
<label><span class="op-lb">휴대폰 번호 <i>*</i></span><input name="phone" type="tel" required placeholder="010-0000-0000" autocomplete="tel"></label>
<label class="full"><span class="op-lb">사업자등록번호 <i>*</i></span><input name="bizno" required placeholder="000-00-00000" inputmode="numeric"></label>
<label class="full"><span class="op-lb">사업자등록증 · 약국개설등록증 <i>*</i></span><span class="op-drop" id="op-drop"><input type="file" name="docs" id="op-docs" accept="image/*,application/pdf" multiple><span id="op-drop-t">사진 또는 PDF를 눌러서 올리기 (2장)</span></span></label>
<label class="full"><span class="op-lb">전달 사항 <span class="op-hint">(선택)</span></span><input name="memo" placeholder="희망 첫 주문 시기, 진열 공간 등"></label>
<label class="full op-agree"><input type="checkbox" name="agree" required><span>개인정보 수집·이용에 동의합니다 <i>*</i><small>수집 항목: 약국명, 성함, B2B몰 아이디, 휴대폰 번호, 사업자등록번호, 등록증 · 목적: B2B 거래 개설과 약국 등급 승인 · 보유 기간: 거래 종료 후 관계 법령에 따른 기간까지</small></span></label>
<p class="op-err" id="op-err" role="alert"></p>
<button type="submit" class="op-submit" id="op-submit">승인 요청 보내기</button>
</form>
<div class="op-done" id="op-done" hidden><span class="op-done-ic" aria-hidden="true">✓</span><b id="op-done-h">승인 요청이 접수됐어요!</b><p>서류를 확인한 뒤 약국 등급으로 승인해 드립니다. <strong>승인이 끝나면 <span id="op-done-phone"></span>으로 주문 가능 안내 문자를 보내드릴 예정입니다.</strong></p><p class="op-done-s">문자를 받으신 뒤 B2B몰에 <b>다시 로그인</b>하시면 약국 공급가가 보이고 바로 주문하실 수 있어요.</p><a class="op-btn ghost" href="${OP.mall}member/login.html" target="_blank" rel="noopener">B2B몰 로그인 ↗</a><small>문의 ${OP.phoneLabel}</small></div>
</div></div></section>

<footer class="op-foot"><div class="op-wrap"><b>SIORÉ</b><span>입점 · 주문 문의 ${OP.phoneLabel} · (주)파마브로스</span></div></footer>
<a class="op-float" href="${OP.mall}member/agreement.html" target="_blank" rel="noopener">B2B몰<br>가입</a>
<dialog class="op-modal" id="op-modal" aria-label="제품 상세"><div class="op-m-in"><img id="op-m-img" alt=""><div class="op-m-info" id="op-m-info"></div><button type="button" class="op-m-x" aria-label="닫기">✕</button><button type="button" class="op-m-nav prev" aria-label="이전 제품">‹</button><button type="button" class="op-m-nav next" aria-label="다음 제품">›</button>
<div class="op-m-bar"><b id="op-m-name"></b><div class="op-dots" id="op-dots"></div><a class="op-btn" href="#" data-opjump="op-join" data-close>이 제품으로 시작하기 · 가입</a></div></div></dialog>
</div>`}
/* ───── 동작 ───── */
let opIdx=0;
function opShow(i){const n=OP_PRODUCTS.length;opIdx=(i+n)%n;const p=OP_PRODUCTS[opIdx];const img=document.getElementById('op-m-img');img.src=`${OPA}slides/${p.slide}.jpg`;img.alt=p.kr+' 상세';document.getElementById('op-m-name').innerHTML=`${p.kr} <span>· ${opIdx+1} / ${n}</span>`;const sp=(window.SELL||{})[opIdx],pr=(typeof PRODUCTS!=='undefined'?PRODUCTS:[]).find(x=>x.id===opIdx)||{},st=sp&&pr.stats?pr.stats[sp.proof]||{}:{};document.getElementById('op-m-info').innerHTML=`<img src="${OPA}product-${p.pic}.png" alt=""><div><em>${p.badge||(opIdx<5?'NMN LINE':'DAILY RELIEF')}</em><b>${p.kr}</b><small>${p.size} / ${opWon(p.price)}</small></div>${sp?`<p class="band"><b>${sp.band[0]}</b><span>${sp.band[1]}</span></p><dl><dt>이런 고객에게</dt><dd>${sp.who[0]}</dd>${st.value?`<dt>대표 시험 결과</dt><dd><strong>${st.value}</strong> ${st.label} <small>(${st.condition||''})</small></dd>`:''}<dt>이렇게 권하세요</dt><dd>${sp.talk}</dd></dl>`:`<p>${p.desc}</p>`}<a class="op-m-full" href="${OPA}slides/${p.slide}.jpg" target="_blank" rel="noopener">소개서 상세 페이지 크게 보기 ↗</a>`;document.getElementById('op-dots').innerHTML=OP_PRODUCTS.map((q,k)=>`<button type="button" aria-label="${q.kr}" class="${k===opIdx?'on':''}" data-dot="${k}"></button>`).join('');document.querySelectorAll('[data-dot]').forEach(b=>b.onclick=()=>opShow(+b.dataset.dot))}
function opJump(id){const t=document.getElementById(id);if(t)t.scrollIntoView({behavior:'smooth',block:'start'})}
function bindPartner(){if(!document.querySelector('.op'))return;
 document.querySelectorAll('[data-opjump]').forEach(a=>a.onclick=e=>{e.preventDefault();if(a.dataset.close!==undefined)document.getElementById('op-modal').close();opJump(a.dataset.opjump)});
 const m=document.getElementById('op-modal');
 document.querySelectorAll('[data-op]').forEach(b=>b.onclick=e=>{if(document.body.classList.contains('editing')&&e.target.closest('[data-ek]'))return;opShow(+b.dataset.op);m.showModal()});
 m.querySelector('.op-m-x').onclick=()=>m.close();m.querySelector('.prev').onclick=()=>opShow(opIdx-1);m.querySelector('.next').onclick=()=>opShow(opIdx+1);
 m.onclick=e=>{if(e.target===m)m.close()};m.onkeydown=e=>{if(e.key==='ArrowLeft')opShow(opIdx-1);if(e.key==='ArrowRight')opShow(opIdx+1)};
 let sx=null;m.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});m.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)opShow(opIdx+(dx<0?1:-1));sx=null});
 const f=document.getElementById('op-form');if(f)bindJoin(f);}
/* 가입 신청 양식 */
function opShrink(file){return new Promise(ok=>{if(!file.type.startsWith('image/')){const r=new FileReader();r.onload=()=>ok({name:file.name,type:file.type,data:r.result.split(',')[1]});r.readAsDataURL(file);return}const img=new Image();img.onload=()=>{const s=Math.min(1,2000/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(img.src);ok({name:file.name.replace(/\.\w+$/,'')+'.jpg',type:'image/jpeg',data:c.toDataURL('image/jpeg',.85).split(',')[1]})};img.src=URL.createObjectURL(file)})}
function bindJoin(f){const docs=f.querySelector('#op-docs'),t=f.querySelector('#op-drop-t'),err=f.querySelector('#op-err');
 docs.onchange=()=>{t.textContent=docs.files.length?[...docs.files].map(x=>x.name).join(', '):'사진 또는 PDF를 눌러서 올리기 (2장)';f.querySelector('#op-drop').classList.toggle('has',!!docs.files.length)};
 f.onsubmit=async e=>{e.preventDefault();err.textContent='';
  const d=Object.fromEntries(new FormData(f).entries());
  const miss=['pharmacy','owner','mallId','phone','bizno'].filter(k=>!String(d[k]||'').trim());
  if(miss.length){err.textContent='* 표시된 항목을 모두 채워 주세요.';f.querySelector(`[name=${miss[0]}]`).focus();return}
  if(!/^[a-z0-9]{4,16}$/.test(String(d.mallId).trim())){err.textContent='B2B몰 아이디는 영문 소문자·숫자 4~16자예요. 가입하신 아이디를 확인해 주세요.';f.mallId.focus();return}
  if(!docs.files.length){err.textContent='사업자등록증과 약국개설등록증을 올려 주세요.';return}
  if([...docs.files].some(x=>x.size>15*1024*1024)){err.textContent='파일 하나당 15MB 이하로 올려 주세요.';return}
  if(!f.agree.checked){err.textContent='개인정보 수집·이용에 동의해 주세요.';return}
  if(!OP.JOIN_ENDPOINT){err.innerHTML=`지금은 온라인 접수 준비 중입니다. 담당자에게 문자로 보내 주세요: <a href="sms:${OP.phone}">${OP.phoneLabel}</a>`;return}
  const btn=f.querySelector('#op-submit');btn.disabled=true;btn.textContent='보내는 중…';
  try{const files=await Promise.all([...docs.files].slice(0,4).map(opShrink));
   delete d.docs;d.agree='Y';d.page=location.href;
   await fetch(OP.JOIN_ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({...d,files})});
   f.hidden=true;const done=document.getElementById('op-done');done.querySelector('#op-done-h').textContent=`가입을 환영합니다, ${d.pharmacy} ${d.owner} 약사님!`;done.querySelector('#op-done-phone').textContent=d.phone;done.hidden=false;done.scrollIntoView({behavior:'smooth',block:'center'})}
  catch(x){btn.disabled=false;btn.textContent='보내고 가입 마치기';err.innerHTML=`보내지 못했어요. 잠시 후 다시 시도하시거나 <a href="sms:${OP.phone}">${OP.phoneLabel}</a>로 문자 주세요.`}}}
