/* ───────── 시오레 파트너 가이드 · 관리자 편집모드 ─────────
   · 일반 링크: content.json(대표 문구·세팅 사진)을 읽어 화면에 표시만 합니다.
   · 링크 끝에 ?edit 를 붙이면 편집모드 → 저장 시 GitHub 저장소(content.json, 사진)에 바로 기록됩니다.
   · 저장 열쇠(GitHub 토큰)는 관리자 브라우저에만 보관됩니다. */
const GH={owner:'logan-pb',repo:'siore-skin',branch:'main',base:'guides/assets/partner-guide/'};
let HERO={eyebrow:'약사가 설계한 바르는 피부 영양제',title:'고객이 묻고,<br><em>약국이 설명할 수 있는</em><br>스킨케어.',lead:'약사가 설계한 제품과 피부 고민별 상담 도구, 제품별 인체적용시험 근거를 하나의 약국 상담 경험으로 연결합니다.'};
const EDIT=new URLSearchParams(location.search).has('edit');
let TEXTS={};let pendingUploads={};/* src → base64 */let dirty=false;
async function loadContent(){try{const r=await fetch('assets/partner-guide/content.json?t='+Date.now(),{cache:'no-store'});if(r.ok){const c=await r.json();if(c.hero)HERO=c.hero;if(Array.isArray(c.setups)&&c.setups.length)SETUPS=c.setups;if(c.texts)TEXTS=c.texts;}}catch(e){}watchApp();if(EDIT)setupEditor();}
const clean=h=>cleanRich(h);
function markDirty(){dirty=true;const b=document.getElementById('ed-save');if(b){b.disabled=false;b.textContent='저장하기 ●'}}
function editAddTile(){return EDIT?`<label class="ed-add"><input type="file" accept="image/*" multiple hidden><span>＋</span><b>세팅 사진 추가</b><small>여러 장 선택 가능 · 자동 압축</small></label>`:''}
function setupEditor(){document.body.classList.add('editing');const bar=document.createElement('div');bar.className='ed-bar';bar.innerHTML=`<b>✏️ 편집모드</b><span class="ed-hint">점선 글자를 눌러 수정 · 가격·연락처는 잠금 · 사진은 '세팅·지원' 탭</span><span class="ed-pal" title="글자를 드래그한 뒤 색을 누르세요"><em>글자색</em><button data-c="copper" style="--c:#a5684f" title="브랜드 코퍼"></button><button data-c="deep" style="--c:#3b2620" title="딥 브라운"></button><button data-c="peach" style="--c:#f2c3ad" title="피치 (어두운 배경용)"></button><button data-c="red" style="--c:#c4452c" title="포인트 레드"></button><button data-c="bold" class="ed-b" title="굵게">B</button><button data-c="none" class="ed-x" title="색·굵기 해제">⌫</button></span><button id="ed-key">저장 열쇠</button><button id="ed-save" class="ed-primary" disabled>저장됨</button><a href="${location.pathname}${location.hash}" class="ed-exit">나가기</a>`;document.body.appendChild(bar);
 document.getElementById('ed-key').onclick=askToken;
 document.getElementById('ed-save').onclick=saveAll;
 bindPalette();
 window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});
}
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
  btn.textContent='저장 중…';const cur=await gh('content.json');const data={hero:HERO,setups:SETUPS.map(({preview,...s})=>s),texts:TEXTS};
  await gh('content.json','PUT',{message:'편집모드: 대표 문구·세팅 사진 수정',content:b64(JSON.stringify(data,null,1)),sha:cur?.sha,branch:GH.branch});
  dirty=false;btn.textContent='저장됨 ✓';toast('저장 완료! 약 1~2분 뒤 약국용 링크에 반영돼요.')}
 catch(e){btn.disabled=false;btn.textContent='다시 저장';toast('⚠️ '+e.message,true);if(/열쇠/.test(e.message))askToken()}}
function toast(m,bad){const t=document.createElement('div');t.className='ed-toast'+(bad?' bad':'');t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),5000)}

/* ───── 전 페이지 문구 편집 (레이아웃 보호) ───── */
const INLINE=new Set(['BR','EM','B','STRONG','SMALL','I','SPAN','SUP','SUB']);
const LOCK_SEL='header,.ed-bar,[data-hero],.ref,.ed-add,svg,script,style,input,textarea,select,img,.inf-list strong';
const LOCK_TXT=/(\d[\d,]*\s*원)|₩|0\d{1,2}-?\d{3,4}-?\d{4}|https?:|\.co\.kr|\.com\b|@\w|\d+\s*ppm|\d+\.\d+|^\s*[\d,.+%만]+\s*$/;
const norm=h=>h.replace(/\s+/g,' ').replace(/ ?<br[^>]*> ?/gi,'<br>').trim();
const cleanRich=h=>norm(h.replace(/<(?!\/?(br|em|b|strong|small|i|span|sup|sub)\b)[^>]*>/gi,'').replace(/<(\w+)[^>]*?(\sclass="[^"]*")?[^>]*>/g,(m,t,c)=>`<${t}${c||''}>`).replace(/&nbsp;/g,' '));
function textUnits(root){const out=[];root.querySelectorAll('*').forEach(el=>{if(el.closest(LOCK_SEL)||el.closest('[data-ek-u]'))return;if(INLINE.has(el.tagName)&&el.parentElement&&el.parentElement.closest('[data-ek-u]'))return;const kids=[...el.childNodes];if(!kids.some(n=>n.nodeType===3&&n.textContent.trim()))return;if(!kids.every(n=>n.nodeType===3||(n.nodeType===1&&INLINE.has(n.tagName)&&![...n.children].some(c=>c.tagName!=='BR'))))return;const txt=el.textContent.trim();if(txt.length<2||LOCK_TXT.test(txt))return;el.setAttribute('data-ek-u','');out.push(el)});return out}
let applying=false;
function applyTexts(){const app=document.getElementById('app');if(!app)return;applying=true;textUnits(app).forEach(el=>{if(el.dataset.ek!==undefined)return;const key=norm(el.innerHTML);el.dataset.ek=key;if(TEXTS[key]!=null){el.innerHTML=TEXTS[key];if(EDIT)el.classList.add('ed-changed')}});if(EDIT){bindEditor();bindTexts()}applying=false}
function watchApp(){const app=document.getElementById('app');new MutationObserver(()=>{if(!applying)applyTexts()}).observe(app,{childList:true,subtree:true});applyTexts()}
let miniBar;
function bindTexts(){document.querySelectorAll('[data-ek]').forEach(el=>{if(el.dataset.eb)return;el.dataset.eb=1;const key=el.dataset.ek;const origLen=el.textContent.trim().length;const max=Math.max(origLen*1.6+8,14);el.contentEditable='true';
 el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation()},true);
 el.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();if(e.shiftKey)document.execCommand('insertLineBreak');else el.blur()}if(e.key==='Escape')el.blur()});
 el.addEventListener('paste',e=>{e.preventDefault();document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text').replace(/\s+/g,' '))});
 el.addEventListener('input',()=>{const len=el.textContent.trim().length;el.classList.toggle('ed-long',len>max);if(len>max){toast(`원래보다 많이 길어서 레이아웃이 흐트러질 수 있어요 (권장 ${Math.round(max)}자 이내)`,true)}const v=cleanRich(el.innerHTML);if(v===key){delete TEXTS[key];el.classList.remove('ed-changed')}else{TEXTS[key]=v;el.classList.add('ed-changed')}markDirty();placeMini(el)});
 el.addEventListener('focus',()=>placeMini(el));el.addEventListener('blur',()=>setTimeout(()=>{if(miniBar&&!miniBar.matches(':hover'))miniBar.hidden=true},150))})}
function placeMini(el){if(!miniBar){miniBar=document.createElement('div');miniBar.className='ed-mini';miniBar.innerHTML='<button>↺ 원래 문구로</button>';document.body.appendChild(miniBar)}const key=el.dataset.ek;miniBar.hidden=!(key in TEXTS);if(miniBar.hidden)return;const r=el.getBoundingClientRect();miniBar.style.top=(window.scrollY+r.top-38)+'px';miniBar.style.left=(window.scrollX+r.left)+'px';miniBar.firstChild.onmousedown=e=>{e.preventDefault();delete TEXTS[key];el.innerHTML=key;el.classList.remove('ed-changed','ed-long');miniBar.hidden=true;markDirty()}}

const HL=['copper','deep','peach','red','bold'];
function bindPalette(){document.querySelectorAll('.ed-pal button').forEach(btn=>btn.onmousedown=e=>{e.preventDefault();const c=btn.dataset.c;const sel=getSelection();if(!sel.rangeCount)return;const r=sel.getRangeAt(0);const node=r.commonAncestorContainer;const host=(node.nodeType===1?node:node.parentElement).closest('[data-hero],[data-ek]');if(!host)return toast('점선 글자 안에서 바꿀 부분을 먼저 드래그해 주세요.',true);
 if(c==='none'){/* 선택 영역(또는 커서 위치)의 색·굵기·강조 해제 */const kill=[...host.querySelectorAll('span.hl,em')].filter(x=>sel.isCollapsed?x.contains(node):r.intersectsNode(x));if(!kill.length&&sel.isCollapsed)return toast('해제할 글자를 드래그하거나 그 글자 안을 클릭해 주세요.',true);kill.forEach(x=>x.replaceWith(...x.childNodes));host.normalize()}
 else{if(sel.isCollapsed)return toast('바꿀 글자를 먼저 드래그해 주세요.',true);const span=document.createElement('span');span.className='hl hl-'+c;span.appendChild(r.extractContents());span.querySelectorAll('span.hl').forEach(x=>x.replaceWith(...x.childNodes));r.insertNode(span);sel.removeAllRanges();const nr=document.createRange();nr.selectNodeContents(span);sel.addRange(nr)}
 host.dispatchEvent(new Event('input'))})}
