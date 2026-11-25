/* ───────── 시오레 파트너 가이드 · 관리자 편집모드 ─────────
   · 일반 링크: content.json(대표 문구·세팅 사진)을 읽어 화면에 표시만 합니다.
   · 링크 끝에 ?edit 를 붙이면 편집모드 → 저장 시 GitHub 저장소(content.json, 사진)에 바로 기록됩니다.
   · 저장 열쇠(GitHub 토큰)는 관리자 브라우저에만 보관됩니다. */
const GH={owner:'logan-pb',repo:'siore-skin',branch:'main',base:'guides/assets/partner-guide/'};
let HERO={eyebrow:'약사가 설계한 바르는 피부 영양제',title:'고객이 묻고,<br><em>약국이 설명할 수 있는</em><br>스킨케어.',lead:'약사가 설계한 제품과 피부 고민별 상담 도구, 제품별 인체적용시험 근거를 하나의 약국 상담 경험으로 연결합니다.'};
const EDIT=new URLSearchParams(location.search).has('edit');
let pendingUploads={};/* src → base64 */let dirty=false;
async function loadContent(){try{const r=await fetch('assets/partner-guide/content.json?t='+Date.now(),{cache:'no-store'});if(r.ok){const c=await r.json();if(c.hero)HERO=c.hero;if(Array.isArray(c.setups)&&c.setups.length)SETUPS=c.setups;}}catch(e){}if(EDIT)setupEditor();}
const clean=h=>h.replace(/<(?!\/?(br|em)\b)[^>]*>/gi,'').replace(/<(br|em)\b[^>]*>/gi,'<$1>').replace(/&nbsp;/g,' ').trim();
function markDirty(){dirty=true;const b=document.getElementById('ed-save');if(b){b.disabled=false;b.textContent='저장하기 ●'}}
function editAddTile(){return EDIT?`<label class="ed-add"><input type="file" accept="image/*" multiple hidden><span>＋</span><b>세팅 사진 추가</b><small>여러 장 선택 가능 · 자동 압축</small></label>`:''}
function setupEditor(){document.body.classList.add('editing');const bar=document.createElement('div');bar.className='ed-bar';bar.innerHTML=`<b>✏️ 편집모드</b><span class="ed-hint">글자를 눌러 바로 수정 · 사진은 '세팅·지원' 탭에서 추가/삭제</span><button id="ed-em" title="선택한 글자를 강조색으로">강조색</button><button id="ed-key">저장 열쇠</button><button id="ed-save" class="ed-primary" disabled>저장됨</button><a href="${location.pathname}${location.hash}" class="ed-exit">나가기</a>`;document.body.appendChild(bar);
 document.getElementById('ed-key').onclick=askToken;
 document.getElementById('ed-save').onclick=saveAll;
 document.getElementById('ed-em').onmousedown=e=>{e.preventDefault();const sel=getSelection();if(!sel.rangeCount||sel.isCollapsed)return alert('대표 문구에서 강조할 글자를 먼저 드래그해 주세요.');const r=sel.getRangeAt(0);const host=r.commonAncestorContainer.parentElement?.closest('[data-hero]');if(!host)return alert('대표 문구 안의 글자만 강조할 수 있어요.');const inEm=r.commonAncestorContainer.parentElement.closest('em');if(inEm){inEm.replaceWith(...inEm.childNodes)}else{const em=document.createElement('em');em.appendChild(r.extractContents());r.insertNode(em)}HERO[host.dataset.hero]=clean(host.innerHTML);markDirty();};
 window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});
 new MutationObserver(bindEditor).observe(document.getElementById('app'),{childList:true});}
function bindEditor(){if(!EDIT)return;
 document.querySelectorAll('[data-hero]').forEach(el=>{if(el.dataset.ed)return;el.dataset.ed=1;el.contentEditable='true';el.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();if(el.dataset.hero==='title')document.execCommand('insertLineBreak')}});el.addEventListener('input',()=>{HERO[el.dataset.hero]=clean(el.innerHTML);markDirty()})});
 document.querySelectorAll('[data-setup]').forEach(card=>{if(card.dataset.ed)return;card.dataset.ed=1;const i=Number(card.dataset.setup);card.onclick=e=>e.preventDefault();
  const tools=document.createElement('span');tools.className='ed-tools';tools.innerHTML=`<i data-a="up" title="앞으로">◀</i><i data-a="down" title="뒤로">▶</i><i data-a="wide" title="넓게/좁게">↔</i><i data-a="del" class="ed-del" title="삭제">✕</i>`;card.appendChild(tools);
  tools.onclick=e=>{e.stopPropagation();e.preventDefault();const a=e.target.dataset.a;if(!a)return;if(a==='del'){if(!confirm(`'${SETUPS[i].title}' 사진을 페이지에서 뺄까요?`))return;SETUPS.splice(i,1)}else if(a==='wide'){SETUPS[i].wide=!SETUPS[i].wide}else{const j=a==='up'?i-1:i+1;if(j<0||j>=SETUPS.length)return;[SETUPS[i],SETUPS[j]]=[SETUPS[j],SETUPS[i]]}markDirty();render()};
  card.querySelectorAll('.ref-cap em,.ref-cap b,.ref-cap small').forEach(el=>{const k=el.tagName==='EM'?'tag':el.tagName==='B'?'title':'desc';el.contentEditable='true';el.onclick=e=>e.stopPropagation();el.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();el.blur()}};el.oninput=()=>{SETUPS[i][k]=el.textContent.trim();markDirty()}});});
 const add=document.querySelector('.ed-add input');if(add&&!add.dataset.ed){add.dataset.ed=1;add.onchange=async()=>{for(const f of add.files){const data=await shrink(f);const src='ref/u'+Date.now()+Math.floor(Math.random()*90+10)+'.jpg';pendingUploads[src]=data.split(',')[1];SETUPS.push({src,preview:data,tag:'새 세팅',title:'약국명 또는 세팅 이름',desc:'설명을 입력하세요',wide:false})}markDirty();render();setTimeout(()=>document.querySelector('.ed-add')?.scrollIntoView({behavior:'smooth',block:'center'}),100)}}}
function shrink(file){return new Promise((ok,no)=>{const img=new Image();img.onload=()=>{const m=1600,s=Math.min(1,m/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(img.src);ok(c.toDataURL('image/jpeg',.82))};img.onerror=()=>no(alert('사진을 읽지 못했어요: '+file.name));img.src=URL.createObjectURL(file)})}
function token(){return localStorage.getItem('siore_gh_token')||''}
function askToken(){const t=prompt('GitHub 저장 열쇠(토큰)를 붙여넣어 주세요.\n이 기기 브라우저에만 저장됩니다. (지우려면 빈칸으로 확인)',token());if(t===null)return false;if(t.trim())localStorage.setItem('siore_gh_token',t.trim());else localStorage.removeItem('siore_gh_token');return !!t.trim()}
async function gh(path,method='GET',body){const r=await fetch(`https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${GH.base}${path}${method==='GET'?'?ref='+GH.branch+'&t='+Date.now():''}`,{method,headers:{Authorization:'Bearer '+token(),Accept:'application/vnd.github+json'},body:body&&JSON.stringify(body)});if(method==='GET'&&r.status===404)return null;if(!r.ok){const t=await r.text();throw new Error(r.status===401?'저장 열쇠가 맞지 않거나 만료됐어요.':r.status===403||r.status===404?'저장 열쇠에 이 저장소 쓰기 권한이 없어요.':r.status===409?'다른 곳에서 먼저 수정됐어요. 새로고침 후 다시 저장해 주세요.':'저장 실패 ('+r.status+') '+t.slice(0,120))}return r.json()}
const b64=s=>btoa(unescape(encodeURIComponent(s)));
async function saveAll(){if(!token()&&!askToken())return;const btn=document.getElementById('ed-save');btn.disabled=true;
 try{const used=new Set(SETUPS.map(s=>s.src));const ups=Object.keys(pendingUploads).filter(k=>used.has(k));let n=0;
  for(const src of ups){btn.textContent=`사진 올리는 중 ${++n}/${ups.length}`;await gh(src,'PUT',{message:'편집모드: 세팅 사진 추가',content:pendingUploads[src],branch:GH.branch});delete pendingUploads[src]}
  btn.textContent='저장 중…';const cur=await gh('content.json');const data={hero:HERO,setups:SETUPS.map(({preview,...s})=>s)};
  await gh('content.json','PUT',{message:'편집모드: 대표 문구·세팅 사진 수정',content:b64(JSON.stringify(data,null,1)),sha:cur?.sha,branch:GH.branch});
  dirty=false;btn.textContent='저장됨 ✓';toast('저장 완료! 약 1~2분 뒤 약국용 링크에 반영돼요.')}
 catch(e){btn.disabled=false;btn.textContent='다시 저장';toast('⚠️ '+e.message,true);if(/열쇠/.test(e.message))askToken()}}
function toast(m,bad){const t=document.createElement('div');t.className='ed-toast'+(bad?' bad':'');t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),5000)}
