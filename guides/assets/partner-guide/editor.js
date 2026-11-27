/* ───────── 시오레 파트너 가이드 · 관리자 편집모드 ─────────
   · 일반 링크: content.json(대표 문구·세팅 사진)을 읽어 화면에 표시만 합니다.
   · 링크 끝에 ?edit 를 붙이면 편집모드 → 저장 시 GitHub 저장소(content.json, 사진)에 바로 기록됩니다.
   · 저장 열쇠(GitHub 토큰)는 관리자 브라우저에만 보관됩니다. */
const GH={owner:'logan-pb',repo:'siore-skin',branch:'main',base:'guides/assets/partner-guide/'};
let HERO={eyebrow:'약사가 설계한 바르는 피부 영양제',title:'고객이 묻고,<br><em>약국이 설명할 수 있는</em><br>스킨케어.',lead:'약사가 설계한 제품과 피부 고민별 상담 도구, 제품별 인체적용시험 근거를 하나의 약국 상담 경험으로 연결합니다.'};
const EDIT=new URLSearchParams(location.search).has('edit');
let TEXTS={};let CERT_SIZE=56;const setCert=()=>document.documentElement.style.setProperty('--cert',CERT_SIZE+'px');let pendingUploads={};/* src → base64 */let dirty=false;
async function loadContent(){try{const r=await fetch('assets/partner-guide/content.json?t='+Date.now(),{cache:'no-store'});if(r.ok){const c=await r.json();if(c.hero)HERO=c.hero;if(Array.isArray(c.setups)&&c.setups.length)SETUPS=c.setups;if(c.texts)TEXTS=c.texts;if(c.certSize)CERT_SIZE=c.certSize;}}catch(e){}setCert();watchApp();if(EDIT)setupEditor();}
const clean=h=>cleanRich(h);
function markDirty(){dirty=true;const b=document.getElementById('ed-save');if(b){b.disabled=false;b.textContent='저장하기 ●'}}
function editAddTile(){return EDIT?`<label class="ed-add"><input type="file" accept="image/*" multiple hidden><span>＋</span><b>세팅 사진 추가</b><small>여러 장 선택 가능 · 자동 압축</small></label>`:''}
function setupEditor(){document.body.classList.add('editing');const bar=document.createElement('div');bar.className='ed-bar';bar.innerHTML=`<b>✏️ 편집모드</b><span class="ed-hint">점선 글자를 눌러 수정 · 가격·연락처는 잠금 · 사진은 '세팅·지원' 탭</span><span class="ed-pal" title="글자를 드래그하거나, 문구를 클릭만 하면 문구 전체에 적용"><em>글자</em><button data-size="-1" class="ed-t" title="작게">A−</button><button data-size="1" class="ed-t" title="크게">A+</button><select id="ed-w" title="굵기"><option value="">굵기</option><option value="300">얇게</option><option value="400">보통</option><option value="500">중간</option><option value="700">굵게</option><option value="900">아주 굵게</option></select><button data-col="#a5684f" style="--c:#a5684f" title="브랜드 코퍼"></button><button data-col="#3b2620" style="--c:#3b2620" title="딥 브라운"></button><button data-col="#f2c3ad" style="--c:#f2c3ad" title="피치(어두운 배경용)"></button><button data-col="#c4452c" style="--c:#c4452c" title="포인트 레드"></button><button data-col="#ffffff" style="--c:#ffffff" title="흰색"></button><label class="ed-pick" title="원하는 색 직접 고르기">🎨<input type="color" id="ed-c" value="#a5684f"></label><button data-reset class="ed-t" title="선택 부분 서식 모두 해제">⌫</button></span><span class="ed-pal ed-cert" title="인증마크 크기"><em>인증마크</em><button data-cs="-4" class="ed-t">−</button><b id="ed-cs"></b><button data-cs="4" class="ed-t">＋</button></span><button id="ed-key">저장 열쇠</button><button id="ed-save" class="ed-primary" disabled>저장됨</button><a href="${location.pathname}${location.hash}" class="ed-exit">나가기</a>`;document.body.appendChild(bar);
 document.getElementById('ed-key').onclick=askToken;
 document.getElementById('ed-save').onclick=saveAll;
 bindPalette();document.querySelectorAll('[data-cs]').forEach(b=>{b.onmousedown=e=>e.preventDefault();b.onclick=()=>{CERT_SIZE=Math.min(110,Math.max(28,CERT_SIZE+Number(b.dataset.cs)));setCert();document.getElementById('ed-cs').textContent=CERT_SIZE;markDirty()}});document.getElementById('ed-cs').textContent=CERT_SIZE;
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
  btn.textContent='저장 중…';const cur=await gh('content.json');const data={hero:HERO,setups:SETUPS.map(({preview,...s})=>s),texts:TEXTS,certSize:CERT_SIZE};
  await gh('content.json','PUT',{message:'편집모드: 대표 문구·세팅 사진 수정',content:b64(JSON.stringify(data,null,1)),sha:cur?.sha,branch:GH.branch});
  dirty=false;btn.textContent='저장됨 ✓';toast('저장 완료! 약 1~2분 뒤 약국용 링크에 반영돼요.')}
 catch(e){btn.disabled=false;btn.textContent='다시 저장';toast('⚠️ '+e.message,true);if(/열쇠/.test(e.message))askToken()}}
function toast(m,bad){const t=document.createElement('div');t.className='ed-toast'+(bad?' bad':'');t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),5000)}

/* ───── 전 페이지 문구 편집 (레이아웃 보호) ───── */
const INLINE=new Set(['BR','EM','B','STRONG','SMALL','I','SPAN','SUP','SUB']);
const LOCK_SEL='header,.ed-bar,[data-hero],.ref,.ed-add,svg,script,style,input,textarea,select,img,.inf-list strong';
const LOCK_TXT=/(\d[\d,]*\s*원)|₩|0\d{1,2}-?\d{3,4}-?\d{4}|https?:|\.co\.kr|\.com\b|@\w|\d+\s*ppm|\d+\.\d+|^\s*[\d,.+%만]+\s*$/;
const norm=h=>h.replace(/\s+/g,' ').replace(/ ?<br[^>]*> ?/gi,'<br>').trim();
function cleanRich(h){const d=document.createElement('div');d.innerHTML=h;(function walk(n){[...n.childNodes].forEach(c=>{if(c.nodeType===3)return;if(c.nodeType!==1||!INLINE.has(c.tagName)){c.replaceWith(...(c.nodeType===1?c.childNodes:[]));return walk(n)}const st=c.style;const keep=[];if(st.fontSize&&/^[\d.]+em$/.test(st.fontSize))keep.push('font-size:'+st.fontSize);if(st.fontWeight)keep.push('font-weight:'+st.fontWeight);if(st.color)keep.push('color:'+st.color);const cls=c.getAttribute('class');[...c.attributes].forEach(a=>c.removeAttribute(a.name));if(cls)c.setAttribute('class',cls);if(keep.length)c.setAttribute('style',keep.join(';'));if(c.tagName==='SPAN'&&!c.attributes.length){c.replaceWith(...c.childNodes);return walk(n)}walk(c)})})(d);return norm(d.innerHTML.replace(/&nbsp;/g,' '))}
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


/* ───── 글자 서식: 크기·굵기·색 (선택 부분 또는 문구 전체) ───── */
let savedRange=null;
document.addEventListener('selectionchange',()=>{const sel=getSelection();if(!sel.rangeCount)return;const n=sel.getRangeAt(0).commonAncestorContainer;const el=n.nodeType===1?n:n.parentElement;if(el&&el.closest&&el.closest('[data-hero],[data-ek]'))savedRange=sel.getRangeAt(0).cloneRange()});
function targetRange(){if(!savedRange)return null;const n=savedRange.commonAncestorContainer;const host=(n.nodeType===1?n:n.parentElement).closest('[data-hero],[data-ek]');if(!host||!document.body.contains(host))return null;const r=savedRange.cloneRange();if(r.collapsed)r.selectNodeContents(host);return{r,host}}
function styleSel(fn){const t=targetRange();if(!t)return toast('먼저 바꿀 문구를 클릭하거나 글자를 드래그해 주세요.',true);const{r,host}=t;
 /* 선택이 이미 하나의 서식 span과 정확히 같으면 그 span을 수정 */
 let span=null;const txt=r.toString();let n=r.commonAncestorContainer;if(n.nodeType===3)n=n.parentElement;while(n&&n!==host){if(n.tagName==='SPAN'&&n.textContent===txt)span=n;n=n.parentElement}
 if(!span&&txt===host.textContent){const only=[...host.childNodes].filter(c=>!(c.nodeType===3&&!c.textContent.trim()));if(only.length===1&&only[0].tagName==='SPAN')span=only[0]}
 if(!span){span=document.createElement('span');span.appendChild(r.extractContents());r.insertNode(span)}
 fn(span);host.normalize();const sel=getSelection();sel.removeAllRanges();const nr=document.createRange();nr.selectNodeContents(span);sel.addRange(nr);savedRange=nr.cloneRange();host.dispatchEvent(new Event('input'))}
function bindPalette(){const pal=document.querySelector('.ed-pal');if(!pal)return;
 pal.querySelectorAll('button,label').forEach(b=>b.addEventListener('mousedown',e=>{if(e.target.tagName!=='INPUT')e.preventDefault()}));
 pal.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>styleSel(sp=>{const cur=parseFloat(sp.style.fontSize)||1;let v=Math.round(cur*(b.dataset.size>0?1.1:1/1.1)*100)/100;v=Math.min(2.5,Math.max(.5,v));sp.style.fontSize=v===1?'':v+'em';toast(`글자 크기 ${Math.round(v*100)}%`)}));
 document.getElementById('ed-w').onchange=e=>{const v=e.target.value;if(v)styleSel(sp=>sp.style.fontWeight=v);e.target.value=''};
 pal.querySelectorAll('[data-col]').forEach(b=>b.onclick=()=>styleSel(sp=>sp.style.color=b.dataset.col));
 const ci=document.getElementById('ed-c');ci.oninput=()=>styleSel(sp=>sp.style.color=ci.value);
 pal.querySelector('[data-reset]').onclick=()=>{const t=targetRange();if(!t)return toast('해제할 문구를 클릭하거나 글자를 드래그해 주세요.',true);const{r,host}=t;const kill=[...host.querySelectorAll('span,em,b,strong')].filter(x=>r.intersectsNode(x)&&!(host.dataset.hero==='title'&&x.tagName==='EM'&&r.collapsed===false&&false));kill.forEach(x=>x.replaceWith(...x.childNodes));host.normalize();host.dispatchEvent(new Event('input'));toast('서식을 해제했어요')};
}
