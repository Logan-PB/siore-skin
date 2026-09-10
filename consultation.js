/* UI additions are intentionally independent of the existing recommendation scores. */
let priorityConcern = null;
const habits = { products: new Set(), reactions: new Set() };
const copy4 = (ko,en,zh,ja) => ({ko,en,zh,ja});
const EXTRA = {
  brandSlogan:copy4('약사가 개발한 더마 인증 스킨케어, 피부 고민에 답하는 바르는 영양 솔루션','Pharmacist-developed, dermatologically tested skincare. Topical nutrition for your skin concerns.','药师开发、通过皮肤测试的护肤品，为肌肤困扰提供外用营养护理方案。','薬剤師開発・皮膚テスト済みスキンケア。肌悩みに応える、塗る栄養ソリューション。'),
  step1Title:copy4('오늘 가장 신경 쓰이는 피부 고민은 무엇인가요?','What concerns you most about your skin today?','今天最在意哪些肌肤问题？','今、最も気になる肌悩みは何ですか？'),
  step1Desc:copy4('고민을 모두 선택한 뒤, 상담에서 먼저 이야기할 고민 하나를 골라주세요.','Select your concerns, then choose one to discuss first.','请选择所有困扰，再选择一个优先咨询的问题。','悩みを選び、まず相談したいものを1つ選んでください。'),
  optionalRefine:copy4('선택 사항','Optional','可选','任意'),
  faceNote:copy4('피부 고민 이해를 돕는 예시 이미지','Illustration to help you understand skin concerns','帮助理解肌肤问题的示意图','肌悩みを理解するためのイメージ画像'),
  priorityTitle:copy4('먼저 상담할 고민 · 1개 선택','Discuss first · choose one','优先咨询 · 选择一项','まず相談したい悩み・1つ選択'),
  priorityNote:copy4('우선 고민은 상담 요약에 표시됩니다. 추천은 선택한 전체 고민을 함께 고려합니다.','Your priority appears in the summary. Recommendations consider all selected concerns.','优先问题显示在咨询摘要中，推荐仍综合考虑所有已选问题。','優先する悩みは相談の要約に表示されます。おすすめは選んだ悩み全体を考慮します。'),
  emptyConcerns:copy4('오른쪽에서 고민을 선택해주세요.','Select your concerns.','请选择肌肤问题。','肌悩みを選んでください。'),
  step2Title:copy4('피부 타입과 사용 습관을 알려주세요','Tell us about your skin and routine','请告诉我们您的肤质和护理习惯','肌タイプとお手入れ習慣を教えてください'),
  step2Desc:copy4('피부 타입·제형·민감도는 기존 추천 기준에 반영됩니다. 사용 경험은 상담 참고용입니다.','Skin type, texture and sensitivity refine the recommendations. Usage experience is for consultation reference.','肤质、质地和敏感度用于推荐。使用经历供咨询参考。','肌タイプ・使用感・敏感度をおすすめに反映します。使用経験は相談の参考にします。'),
  habitTitle:copy4('현재 사용 습관 · 선택 입력','Current routine · optional','当前护理习惯 · 选填','現在のお手入れ・任意'),
  currentProducts:copy4('현재 어떤 제품을 사용하고 있나요?','Which products do you currently use?','目前使用哪些产品？','現在どの製品を使っていますか？'),
  reactions:copy4('제품 사용 후 불편했던 경험이 있나요?','Have you experienced discomfort after using a product?','使用产品后是否有不适经历？','製品を使った後、不快感がありましたか？'),
  productNote:copy4('제품명 또는 불편했던 상황 (선택)','Product name or situation (optional)','产品名称或不适情况（选填）','製品名・不快感があった状況（任意）'),
  referenceOnly:copy4('상담 참고용 · 추천 점수에는 반영하지 않습니다.','Consultation reference only · does not change recommendation scores.','仅供咨询参考，不改变推荐评分。','相談の参考用です。おすすめの点数には反映しません。'),
  prioritySummary:copy4('먼저 상담할 고민','Discuss first','优先咨询','まず相談する悩み'),
  habitsSummary:copy4('사용 경험 메모','Routine notes','使用经历记录','使用経験メモ'),
  editProfile:copy4('선택 내용 수정','Edit selections','修改选择','選択を変更'),
  usageTitle:copy4('제품별 사용법','How to use','产品使用方法','製品の使い方'),
  routineNotice:copy4('아래 순서는 기존 제품별 사용 단계 기준입니다. 아침·저녁 여부는 각 제품 사용법을 확인해주세요.','The order below follows the existing product instructions. Check each product for morning or evening use.','以下顺序沿用原有产品使用步骤。早晚使用请查看各产品说明。','以下は従来の製品ごとの使用順です。朝・夜の使用は各製品の説明をご確認ください。'),
  saveSummary:copy4('상담 내용 인쇄·저장','Print / save consultation','打印／保存咨询内容','相談内容を印刷・保存')
};
Object.assign(PAGE_I18N,EXTRA);
const concernKeys=['concernDry','concernSensitive','concernRedness','concernFirmness','concernRadiance','concernBlemish','concernSebum','concernBarrier','concernTexture'];
const concernDescriptions=[
 copy4('세안 후 당기고 건조해요','Tight and dry after cleansing','洁面后紧绷、干燥','洗顔後につっぱり、乾燥する'),
 copy4('제품 사용 시 따갑고 예민해요','Stinging or reactive with products','使用产品时刺痛、敏感','製品を使うと刺激を感じる'),
 copy4('쉽게 달아오르고 붉어져요','Easily feels hot or looks red','容易发热、泛红','ほてりや赤みが気になる'),
 copy4('피부가 느슨하게 느껴져요','Skin feels less firm','感觉肌肤松弛','ハリの低下が気になる'),
 copy4('피부가 칙칙해 보여요','Skin looks dull','肤色看起来暗沉','くすみが気になる'),
 copy4('뾰루지가 반복돼요','Recurring blemishes','反复出现痘痘','肌荒れを繰り返す'),
 copy4('번들거림이 신경 쓰여요','Excess shine bothers me','在意出油、泛光','テカリが気になる'),
 copy4('외부 자극에 쉽게 불편해져요','Easily uncomfortable with external irritation','易受外界刺激而不适','外部刺激で不快感が出やすい'),
 copy4('들뜨거나 거칠게 느껴져요','Flaky or rough texture','起皮或感觉粗糙','粉ふきやざらつきが気になる')
];
const TERM = {};
function term(ko,en,zh,ja){TERM[ko]=copy4(ko,en,zh,ja);}
[
 ['고민 연결','Related concerns','相关困扰','関連する悩み'],['추천 이유','Why recommended','推荐理由','おすすめの理由'],['핵심 임상','Key study findings','主要测试结果','主な試験結果'],['임상 내용','Study findings','测试内容','試験内容'],
 ['사용 단계','Application step','使用步骤','使用ステップ'],['상담 목적별 맞춤 루틴','Choose your routine','选择护理组合','ルーティンを選ぶ'],['추천 순위와 사용 순서는 다릅니다.','Ranking differs from application order.','推荐排名与使用顺序不同。','おすすめ順位と使用順は異なります。'],
 ['아래 제품은 왼쪽부터 실제 사용하는 순서로 배치했습니다.','Products below follow application order.','以下产品按使用顺序排列。','以下は使用順に並んでいます。'],['왼쪽부터 순서대로 사용하세요','Follow the numbered application steps','请按编号顺序使用','番号順にご使用ください'],
 ['원픽 1종','One pick','精选1件','厳選1品'],['코어 3종','Core 3','核心3件','基本3品'],['프리미엄 5종','Premium 5','完整5件','充実5品'],['원픽','One pick','精选','厳選'],['코어','Core','核心','基本'],['프리미엄','Premium','完整','充実'],
 ['추가 구성','Additional option','追加选择','追加アイテム'],['단독 추천','Single recommendation','单品推荐','単品おすすめ'],['기존 루틴의 해당 단계에 사용','Use at the relevant step of your current routine','用于现有护理流程的相应步骤','現在のお手入れの該当ステップで使用'],
 ['클렌징','Cleansing','洁面','洗顔'],['토너','Toner','爽肤水','化粧水'],['앰플','Ampoule','安瓶','アンプル'],['세럼','Serum','精华','美容液'],['크림','Cream','面霜','クリーム'],['젤 크림','Gel cream','凝胶霜','ジェルクリーム'],
 ['수분','Hydration','水分','うるおい'],['장벽','Barrier','屏障','バリア'],['열감','Heat','热感','ほてり'],['탄력','Firmness','弹力','ハリ'],['근거','Evidence','依据','根拠'],
 ['클렌저','Cleanser','洁面产品','洗顔料'],['세럼·앰플','Serum / ampoule','精华／安瓶','美容液・アンプル'],['선크림','Sunscreen','防晒','日焼け止め'],['잘 모르겠어요','Not sure','不确定','わからない'],
 ['따가움','Stinging','刺痛','刺激感'],['붉어짐','Redness','泛红','赤み'],['가려움','Itching','瘙痒','かゆみ'],['트러블','Blemishes','痘痘','肌荒れ'],['없음','None','无','なし']
].forEach(args=>term(...args));
function escaped(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function bilingual(map){if(!map)return '';if(languageMode==='ko')return escaped(map.ko);return `<span class="i18n-main" lang="${languageMode}">${escaped(map[languageMode]||map.ko)}</span><span class="i18n-ko" lang="ko">${escaped(map.ko)}</span>`;}
function termHTML(text){return TERM[text]?bilingual(TERM[text]):escaped(text);}
function clinicalHTML(p,j=0){const ko=p.clinical?.[j];if(!ko)return '';return bilingual({ko,...Object.fromEntries(['en','zh','ja'].map(lang=>[lang,p.i18n?.[lang]?.clinical?.[j]||CLINICAL[ko]?.[lang]]))});}
function concernLabel(value){const card=document.querySelector(`[data-concern="${value}"]`);return PAGE_I18N[card?.querySelector('[data-i18n]')?.dataset.i18n]||{ko:value};}
function syncSelections(){document.querySelectorAll('.segmented-grid button,.concern-card,.type-card').forEach(el=>el.setAttribute('aria-pressed',String(el.classList.contains('selected'))));}
function updateConcernSummary(){
 if(!selectedConcerns.includes(priorityConcern))priorityConcern=selectedConcerns[0]||null;
 document.getElementById('selected-concern-chips').innerHTML=selectedConcerns.length?selectedConcerns.map(c=>`<span>${bilingual(concernLabel(c))}</span>`).join(''):bilingual(EXTRA.emptyConcerns);
 const box=document.getElementById('priority-box');box.hidden=!selectedConcerns.length;
 document.getElementById('priority-options').innerHTML=selectedConcerns.map(c=>`<button type="button" data-priority="${c}" aria-pressed="${c===priorityConcern}">${bilingual(concernLabel(c))}</button>`).join('');
 syncSelections();
}
const originalApplyPageLanguage=applyPageLanguage;
applyPageLanguage=function(){
 originalApplyPageLanguage();
 document.querySelectorAll('[data-age]').forEach(el=>{if(el.dataset.age!=='none')el.innerHTML=bilingual({ko:el.dataset.age==='70대 이상'?'70+':el.dataset.age,...UI.ages[el.dataset.age]});});
 document.querySelectorAll('[data-term]').forEach(el=>el.innerHTML=termHTML(el.dataset.term));
 document.querySelectorAll('[data-placeholder]').forEach(el=>{const map=EXTRA[el.dataset.placeholder];el.placeholder=map[languageMode];});
 if(document.getElementById('priority-box'))updateConcernSummary();
 document.querySelectorAll('.language-option').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===languageMode)));
};
// Translate residual server-free template labels, without touching their existing i18n spans.
function localizeResultLabels(root){
 if(languageMode==='ko')return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
 while(walker.nextNode()){const node=walker.currentNode;if(node.parentElement.closest('.i18n-main,.i18n-ko,script,style'))continue;if(TERM[node.textContent.trim()])nodes.push(node);}
 nodes.forEach(node=>{const span=document.createElement('span');span.innerHTML=termHTML(node.textContent.trim());node.replaceWith(span);});
}
const originalReady=updateStep1Ready;
updateStep1Ready=function(){originalReady();updateConcernSummary();};
const originalReset=resetAll;
resetAll=function(){originalReset();priorityConcern=null;Object.values(habits).forEach(set=>set.clear());document.querySelectorAll('[data-habit]').forEach(b=>b.setAttribute('aria-pressed','false'));document.getElementById('habit-note').value='';updateConcernSummary();syncSelections();};
const originalSelectSegment=selectSegment;
selectSegment=function(...args){originalSelectSegment(...args);syncSelections();};
const originalGoToStep=goToStep;
goToStep=function(num){originalGoToStep(num);document.querySelectorAll('.step-item').forEach((el,i)=>i===num-1?el.setAttribute('aria-current','step'):el.removeAttribute('aria-current'));const heading=document.querySelector('#step'+num+' h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}};
const originalShowResults=showResults;
showResults=function(){
 const previousTier=document.querySelector('.routine-tier-tabs .active')?.dataset.tier;
 originalShowResults();
 const routineKicker=document.querySelector('.routine-explorer-head>div>span');if(routineKicker)routineKicker.textContent='STEP 03';
 const summary=document.getElementById('result-summary');
 if(priorityConcern)summary.insertAdjacentHTML('beforeend',`<div><strong>${bilingual(EXTRA.prioritySummary)}</strong><div>${bilingual(concernLabel(priorityConcern))}</div><small>${bilingual(EXTRA.priorityNote)}</small></div>`);
 const notes=[...habits.products,...habits.reactions];const freeText=document.getElementById('habit-note').value.trim();
 if(notes.length||freeText)summary.insertAdjacentHTML('beforeend',`<div><strong>${bilingual(EXTRA.habitsSummary)}</strong><div>${notes.map(termHTML).join(' · ')}</div><p>${escaped(freeText)}</p><small>${bilingual(EXTRA.referenceOnly)}</small></div>`);
 document.querySelector('.analysis-visual').insertAdjacentHTML('beforeend',`<p class="image-note">${bilingual(EXTRA.faceNote)}</p>`);
 const cards=document.querySelectorAll('.routine-product-card');
 const ordered=[...buildSets(getRecommendations()).premium5].sort((a,b)=>a.routineOrder-b.routineOrder);
 cards.forEach((card,i)=>{
  const p=ordered[i];card.dataset.productKey=p.key;
  card.querySelector('.routine-metric').innerHTML=`<small>${termHTML('핵심 임상')}</small><div>${clinicalHTML(p)}</div>`;
  card.insertAdjacentHTML('beforeend',`<div class="usage-copy"><strong>${bilingual(EXTRA.usageTitle)}</strong><div>${bilingual({ko:p.usage,...USAGE[p.key]})}</div></div>`);
  // Keep the full clinical statements and their Korean counterpart together.
  const list=card.querySelector('.clinical-content ul');list.innerHTML=(p.clinical||[]).slice(0,3).map((ko,j)=>`<li>${bilingual({ko,en:p.i18n?.en?.clinical?.[j]||CLINICAL[ko]?.en,zh:p.i18n?.zh?.clinical?.[j]||CLINICAL[ko]?.zh,ja:p.i18n?.ja?.clinical?.[j]||CLINICAL[ko]?.ja})}</li>`).join('');
 });
 document.querySelectorAll('.comparison-product').forEach((card,i)=>{
  const p=buildSets(getRecommendations()).core3[i];
  card.querySelector('.comparison-product-head small').innerHTML=`${escaped(p.capacity)} · ${termHTML(p.routine)}`;
  card.querySelector('.metric-row-compact').innerHTML=`<b>${termHTML('핵심 임상')}</b><div>${clinicalHTML(p)}</div>`;
 });
 document.querySelector('.routine-explorer').insertAdjacentHTML('beforeend',`<p class="routine-note">${bilingual(EXTRA.routineNotice)}</p>`);
 localizeResultLabels(document.getElementById('step3'));
 setRoutineTier(previousTier||'core3');
};
const originalSetRoutineTier=setRoutineTier;
setRoutineTier=function(tier){
 originalSetRoutineTier(tier);const explorer=document.querySelector('.routine-explorer');if(!explorer)return;
 const cards=[...explorer.querySelectorAll('.routine-product-card')];let count=0;
 cards.forEach(card=>{const active=tier==='premium5'||(tier==='core3'&&card.classList.contains('in-core'))||(tier==='one'&&card.classList.contains('in-one'));card.classList.toggle('is-hidden',!active);if(active){count++;card.querySelector('.application-step strong').innerHTML=`${String(count).padStart(2,'0')} · ${termHTML(card.dataset.routineLabel)}`;}});
 explorer.querySelectorAll('[data-tier]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.tier===tier));});
 explorer.querySelector('.routine-tier-tabs').setAttribute('role','group');
 localizeResultLabels(explorer);
};
// Existing result re-render must work for object-shaped product catalogs as well as arrays.
setLanguage=function(next){if(!['ko','en','zh','ja'].includes(next))return;languageMode=next;syncLanguageButtons();applyPageLanguage();if(document.getElementById('step3').classList.contains('active')&&Object.keys(products).length)showResults();};
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.concern-card').forEach((card,i)=>{PAGE_I18N['help'+i]=concernDescriptions[i];const p=document.createElement('span');p.className='concern-help';p.dataset.i18n='help'+i;card.append(p);});
 document.getElementById('priority-options').addEventListener('click',event=>{const b=event.target.closest('[data-priority]');if(!b)return;priorityConcern=b.dataset.priority;updateConcernSummary();document.querySelector(`[data-priority="${priorityConcern}"]`)?.focus();});
 document.querySelectorAll('[data-habit]').forEach(button=>button.addEventListener('click',()=>{const set=habits[button.dataset.habit];const value=button.dataset.term;if(set.has(value))set.delete(value);else {if(value==='없음'||value==='잘 모르겠어요')set.clear();else{set.delete('없음');set.delete('잘 모르겠어요');}set.add(value);}document.querySelectorAll(`[data-habit="${button.dataset.habit}"]`).forEach(b=>b.setAttribute('aria-pressed',String(set.has(b.dataset.term))));}));
 document.querySelectorAll('.type-card').forEach(b=>b.addEventListener('click',()=>queueMicrotask(syncSelections)));
 document.getElementById('print-summary').addEventListener('click',()=>window.print());
 applyPageLanguage();
});
