/* SIORÉ 결과지 저장 — 이미지(PNG)·PDF 저장을 기본으로, 인쇄는 보조 */
(function(){
  const LIBS={h2c:'assets/vendor/html2canvas.min.js',pdf:'assets/vendor/jspdf.umd.min.js'};
  const L={
    main:['결과 저장 (이미지·PDF)','Save result (image · PDF)','保存结果（图片·PDF）','結果を保存（画像・PDF）'],
    img:['이미지로 저장','Save as image','保存为图片','画像で保存'],
    imgSub:['휴대폰 사진첩·메신저 전송용 PNG','PNG for photos & messaging','PNG，便于相册与聊天发送','写真・メッセージ送信用PNG'],
    pdf:['PDF로 저장','Save as PDF','保存为PDF','PDFで保存'],
    pdfSub:['A4 페이지로 나눠 저장','Split into A4 pages','按A4分页保存','A4ページに分けて保存'],
    print:['인쇄하기','Print','打印','印刷'],
    busy:['저장 중…','Saving…','保存中…','保存中…'],
    done:['저장했어요','Saved','已保存','保存しました'],
    fail:['저장에 실패했어요. 인쇄 메뉴의 “PDF로 저장”을 이용해 주세요.','Save failed. Please use Print → Save as PDF.','保存失败，请使用打印 → 另存为PDF。','保存に失敗しました。印刷 →「PDFに保存」をご利用ください。']
  };
  const li=()=>({ko:0,en:1,zh:2,ja:3})[(window.languageMode||document.documentElement.lang||'ko').slice(0,2)]??0;
  const t=k=>{const a=L[k];const m=window.languageMode;if(m==='bilingual'||m==='ko-en')return a[0]+' · '+a[1];return a[li()]};
  const load=src=>new Promise((ok,no)=>{if(document.querySelector(`script[src="${src}"]`)&&(window.html2canvas&&src===LIBS.h2c||window.jspdf&&src===LIBS.pdf))return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)});
  const stamp=()=>{const d=new Date(),z=n=>String(n).padStart(2,'0');return `${d.getFullYear()}${z(d.getMonth()+1)}${z(d.getDate())}_${z(d.getHours())}${z(d.getMinutes())}`};
  const target=()=>document.querySelector('#step3 .paper-pair')||document.querySelector('#step3');

  const PROPS=['fill','fill-opacity','stroke','stroke-width','stroke-opacity','stroke-dasharray','stroke-linecap','stroke-linejoin','opacity','font-size','font-weight','letter-spacing','text-anchor','dominant-baseline','visibility','display','transform-origin'];
  async function svgUrls(el){
    return Promise.all([...el.querySelectorAll('svg')].map(async sv=>{
      const r=sv.getBoundingClientRect();if(!r.width||!r.height)return null;
      const c=sv.cloneNode(true);const a=[sv,...sv.querySelectorAll('*')],b=[c,...c.querySelectorAll('*')];
      a.forEach((n,j)=>{const m=b[j];if(!m||/^(defs|stop|linearGradient|radialGradient|clipPath|filter|feDropShadow|feGaussianBlur|style|title|mask|pattern)$/i.test(n.tagName))return;const cs=getComputedStyle(n);
        PROPS.forEach(k=>{const v=cs.getPropertyValue(k);if(v&&v!=='auto')m.style.setProperty(k,v)});m.style.setProperty('animation','none');m.style.setProperty('font-family','Pretendard,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif')});
      c.setAttribute('xmlns','http://www.w3.org/2000/svg');c.setAttribute('width',r.width);c.setAttribute('height',r.height);c.removeAttribute('class');c.style.cssText='';
      if(!c.getAttribute('viewBox')&&sv.viewBox&&sv.viewBox.baseVal&&sv.viewBox.baseVal.width){const v=sv.viewBox.baseVal;c.setAttribute('viewBox',`${v.x} ${v.y} ${v.width} ${v.height}`)}
      const src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(c));
      await new Promise(ok=>{const i=new Image();i.onload=i.onerror=ok;i.src=src});
      return {src,w:r.width,h:r.height,disp:getComputedStyle(sv).display==='inline'?'inline-block':'block',mg:(()=>{const q=getComputedStyle(sv);return `${q.marginTop} ${q.marginRight} ${q.marginBottom} ${q.marginLeft}`})()};
    }));
  }
  async function capture(){
    await load(LIBS.h2c);
    const el=target();
    const w=Math.ceil(el.scrollWidth);
    const urls=await svgUrls(el);
    return window.html2canvas(el,{
      scale:Math.min(2,Math.max(1.5,window.devicePixelRatio||1)),useCORS:true,backgroundColor:'#faf6f0',logging:false,
      windowWidth:Math.max(w+40,document.documentElement.clientWidth),
      ignoreElements:n=>n.classList&&(n.classList.contains('panel-actions')||n.classList.contains('rs-menu')||n.classList.contains('care-tier-options')||n.hasAttribute&&n.hasAttribute('data-save-ignore')),
      onclone:doc=>{
        const dst=[...(doc.querySelector('#step3 .paper-pair')||doc.querySelector('#step3')).querySelectorAll('svg')];
        dst.forEach((dv,i)=>{const u=urls[i];if(!u)return;const im=doc.createElement('img');im.src=u.src;im.width=u.w;im.height=u.h;im.style.cssText=`width:${u.w}px;height:${u.h}px;display:${u.disp};margin:${u.mg};vertical-align:middle;max-width:none`;dv.replaceWith(im)});
        const fd=doc.querySelector('#focus-dialog');if(fd)Object.assign(fd.style,{position:'static',overflow:'visible',height:'auto',maxHeight:'none'});
        const st=doc.createElement('style');
        st.textContent='*{animation:none!important;transition:none!important}.paper-pair{backdrop-filter:none!important}';
        doc.head.appendChild(st);
      }
    });
  }
  const toBlob=c=>new Promise(r=>c.toBlob(r,'image/png'));
  async function deliver(blob,name,type){
    const file=new File([blob],name,{type});
    const touch=matchMedia('(pointer:coarse)').matches;
    if(touch&&navigator.canShare&&navigator.canShare({files:[file]})){
      try{await navigator.share({files:[file],title:'SIORÉ'});return}catch(e){if(e&&e.name==='AbortError')return}
    }
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),4000);
  }
  async function saveImage(){
    const c=await capture();await deliver(await toBlob(c),`SIORE_skin_solution_${stamp()}.png`,'image/png');
  }
  async function savePdf(){
    const [c]=await Promise.all([capture(),load(LIBS.pdf)]);
    const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'mm',format:'a4',orientation:'portrait'});
    const pw=210,ph=297,m=8,iw=pw-m*2,pxPerMm=c.width/iw,pageH=Math.floor((ph-m*2)*pxPerMm);
    const slice=document.createElement('canvas');slice.width=c.width;
    for(let y=0,i=0;y<c.height;y+=pageH,i++){
      const h=Math.min(pageH,c.height-y);slice.height=h;
      const g=slice.getContext('2d');g.fillStyle='#faf6f0';g.fillRect(0,0,c.width,h);g.drawImage(c,0,y,c.width,h,0,0,c.width,h);
      if(i)pdf.addPage();
      pdf.setFillColor(250,246,240);pdf.rect(0,0,pw,ph,'F');
      pdf.addImage(slice.toDataURL('image/jpeg',.92),'JPEG',m,m,iw,h/pxPerMm);
    }
    await deliver(pdf.output('blob'),`SIORE_skin_solution_${stamp()}.pdf`,'application/pdf');
  }

  function toast(msg){let n=document.querySelector('.rs-toast');if(!n){n=document.createElement('div');n.className='rs-toast';(document.querySelector('#focus-dialog')||document.body).appendChild(n)}n.textContent=msg;n.classList.add('on');clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove('on'),2600)}
  async function run(kind,btn){
    const main=document.querySelector('#save-result');const label=main.innerHTML;
    closeMenu();main.disabled=true;main.innerHTML=`<span class="rs-spin"></span>${t('busy')}`;
    try{kind==='pdf'?await savePdf():await saveImage();toast(t('done'))}
    catch(e){console.warn('[siore save]',e);toast(t('fail'))}
    finally{main.disabled=false;main.innerHTML=label}
  }
  function closeMenu(){const m=document.querySelector('.rs-menu');if(m)m.hidden=true;const b=document.querySelector('#save-result');if(b)b.setAttribute('aria-expanded','false')}

  function render(){
    const print=document.querySelector('#print-summary');if(!print)return;
    print.hidden=true;print.setAttribute('aria-hidden','true');
    let wrap=document.querySelector('.rs-wrap');
    if(!wrap){
      wrap=document.createElement('div');wrap.className='rs-wrap';
      wrap.innerHTML='<button type="button" class="btn-primary" id="save-result" aria-haspopup="menu" aria-expanded="false"></button><div class="rs-menu" role="menu" hidden></div>';
      print.insertAdjacentElement('afterend',wrap);
      wrap.querySelector('#save-result').addEventListener('click',e=>{e.stopPropagation();const m=wrap.querySelector('.rs-menu');m.hidden=!m.hidden;e.currentTarget.setAttribute('aria-expanded',String(!m.hidden))});
      wrap.querySelector('.rs-menu').addEventListener('click',e=>{const b=e.target.closest('[data-save]');if(!b)return;e.stopPropagation();if(b.dataset.save==='print'){closeMenu();window.print()}else run(b.dataset.save,b)});
      document.addEventListener('click',e=>{if(!e.target.closest('.rs-wrap'))closeMenu()});
    }
    const ic={img:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>',pdf:'<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/></svg>'};
    wrap.querySelector('#save-result').innerHTML=`<svg class="rs-dl" viewBox="0 0 24 24"><path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg>${t('main')}`;
    wrap.querySelector('.rs-menu').innerHTML=
      `<button type="button" role="menuitem" data-save="img">${ic.img}<span><b>${t('img')}</b><small>${t('imgSub')}</small></span></button>`+
      `<button type="button" role="menuitem" data-save="pdf">${ic.pdf}<span><b>${t('pdf')}</b><small>${t('pdfSub')}</small></span></button>`+
      `<button type="button" role="menuitem" data-save="print" class="rs-print">${t('print')}</button>`;
  }
  const kick=()=>setTimeout(render,0);
  ['paperRender','showResults'].forEach(f=>{const o=window[f];if(typeof o==='function'&&!o.__rs){const w=function(){const r=o.apply(this,arguments);kick();return r};w.__rs=1;window[f]=w}});
  document.addEventListener('click',e=>{if(e.target.closest('[data-lang],.language-option,[data-mode]'))setTimeout(render,60)});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
  setTimeout(render,800);
})();
