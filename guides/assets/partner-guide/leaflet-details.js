// Product copy and original artwork supplied in the June 2026 leaflet.
const LEAFLETS = [
  {page:2, focus:'민감·건조·트러블성 피부의 부드러운 세정', summary:'99% 고순도 NMN 500 ppm과 판테놀 캡슐을 담은 클렌징 밀크. 메이크업과 노폐물을 부드럽게 세정하고, 세안 후에도 편안한 피부 컨디션을 유지합니다.', points:['논코메도제닉 시험 완료','피부 저자극 테스트 완료'], results:['미세먼지 제거율 99.55%','메이크업 세정력 91.59%','노폐물 세정력 99.48%']},
  {page:3, focus:'칙칙하고 수분이 부족한 피부의 광채 케어', summary:'99% 고순도 NMN 10,000 ppm을 담은 벌집 구조 버블 텍스처. 칙칙한 피부에 생기와 광채를 더하고 수분을 공급합니다.', points:['미백·주름개선 2중 기능성','145 mL · 버블 토너'], results:['피부 광채 403% 개선','피부 수분량 148% 개선','피부결(거칠기) 10.43% 개선']},
  {page:4, focus:'잔주름과 탄력 저하가 고민인 피부', summary:'99% 고순도 NMN 10,000 ppm을 담은 고농축 세럼. 노화로 저하된 피부 컨디션을 케어하고, 탄력 있고 매끄러운 피부로 가꾸어 줍니다.', points:['미백·주름개선 2중 기능성','주름 개선 테스트 완료'], results:['평균 주름 개선율 11.36%']},
  {page:5, focus:'건조하고 민감한 피부의 집중 수분 케어', summary:'99% 고순도 NMN 10,000 ppm을 담은 고보습 크림. 건조한 피부에 수분과 영양을 전달해 건강한 윤기와 수분 광채를 더합니다.', points:['미백·주름개선 2중 기능성','50 mL · 수딩 크림'], results:['피부 수분량 148.87% 증가','피부톤 및 투명도 개선']},
  {page:6, focus:'건조함과 탄력 저하가 함께 고민인 피부', summary:'99% 고순도 NMN 10,000 ppm을 담은 고영양 크림. 노화로 저하된 피부에 영양과 보습을 더해 탄탄하고 건강한 피부로 가꾸어 줍니다.', points:['미백·주름개선 2중 기능성','주름 개선 테스트 완료'], results:['팔자주름 21.89% 개선','피부 노화 10.19% 개선']},
  {page:7, focus:'민감·건조·복합성 피부의 수분 바탕', summary:'국내 제주산 감나무잎수를 고함량으로 담은 장벽 보습 토너. 물처럼 가볍고 산뜻하게 흡수되며, 세안 후 피부에 수분과 편안한 보습감을 더합니다.', points:['모든 피부 타입에 적합','피부 자극 테스트 완료'], results:['1회 사용 후 수분량 136.58% 개선','1회 사용 후 피부결 11.84% 개선']},
  {page:8, focus:'외부 자극으로 예민해진 트러블성 피부', summary:'병풀추출물 기반의 진정·장벽 앰플. 얇지만 밀도 있는 텍스처로 빠르게 수분을 공급하고 피부 컨디션을 편안하게 케어합니다.', points:['여드름성 피부 사용 적합','논코메도제닉 시험 완료'], results:['피부 광채 475.98% 개선','피부 장벽 47.08% 개선']},
  {page:9, focus:'열감과 자극으로 예민해진 피부의 진정', summary:'끈적임 없는 쿨링 젤 텍스처로 열감과 자극으로 예민해진 피부를 진정시키는 데일리 카밍 수딩 젤입니다.', points:['여드름성 피부 사용 적합','논코메도제닉 시험 완료'], results:['즉각적 피부 보습량 76.04% 개선','피부 수분손실량 15.42% 감소']},
  {page:10, focus:'민감·트러블성 피부의 보습 마무리', summary:'건조하고 민감해진 피부를 편안하게 감싸는 데일리 보습 크림. 피부 수분 보호막을 형성해 편안한 피부 컨디션을 오래 유지합니다.', points:['여드름성 피부 사용 적합','논코메도제닉 시험 완료'], results:['즉각적 피부 보습량 110.79% 개선','24시간 피부 보습지속력 60.58% 개선']}
];
LEAFLETS.forEach((entry,id)=>{PRODUCTS[id].focus=entry.focus; PRODUCTS[id].summary=entry.summary;});
function openProduct(id){
  const p=PRODUCTS[id], info=LEAFLETS[id], dialog=document.getElementById('detail');
  dialog.classList.toggle('leaflet-dialog',Boolean(info));
  dialog.classList.remove('selection-dialog');
  dialog.setAttribute('aria-label',p.name+' 제품 소개');
  const src=info?`assets/partner-guide/leaflets/product-page-${info.page}.jpg`:'';
  document.getElementById('detail-body').innerHTML=info?`<article class="leaflet-detail"><div class="leaflet-summary"><small>${p.line} · ${p.size}</small><h2>${p.name}</h2><p class="leaflet-focus">${info.focus}</p><p>${info.summary}</p><div class="leaflet-points">${info.points.map(x=>`<span>${x}</span>`).join('')}</div><h3>리플렛에 담긴 시험 결과</h3><ul>${info.results.map(x=>`<li>${x}</li>`).join('')}</ul><p class="leaflet-note">첨부 리플렛 기준. 시험 조건·대상·기간은 아래 원본 하단에서 확인할 수 있습니다. 개인차가 있을 수 있습니다.</p><a class="leaflet-original" href="${src}" target="_blank" rel="noopener">원본 크게 보기 ↗</a></div><img class="leaflet-art" src="${src}" alt="${p.name} 공식 리플렛: 제품 설명, 시험 결과 및 시험 조건" decoding="async"></article>`:`<div class="product-detail"><img src="${p.picture}" alt="${p.name}"><small>${p.line}</small><h2>${p.name}</h2><p>${p.summary}</p><h3>주요 성분</h3><p>${p.ingredients.join(' · ')}</p><h3>추천 고객</h3><p>${p.customer}</p></div>`;
  if(!dialog.open)dialog.showModal(); dialog.scrollTop=0;
}
document.getElementById('detail').addEventListener('close',()=>{const d=document.getElementById('detail');d.classList.remove('leaflet-dialog','selection-dialog');d.removeAttribute('aria-label');});
