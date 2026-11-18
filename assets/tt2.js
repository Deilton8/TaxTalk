(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
/* navbar: pílula deslizante, scroll-spy e cabeçalho que encolhe */
const hd=$('header'),nav=$('.tt-nav');
const sc=()=>hd.classList.toggle('tt-sc',scrollY>20);addEventListener('scroll',sc,{passive:true});sc();
if(nav){const nl=$$('a',nav),pill=$('.tt-pill',nav),M={};let act=nl[0];
const go=a=>{nl.forEach(x=>x.classList.toggle('on',x===a));pill.style.cssText='opacity:1;width:'+a.offsetWidth+'px;transform:translateX('+a.offsetLeft+'px)'};
nl.forEach(a=>{M[a.getAttribute('href').slice(1)]=a;a.addEventListener('mouseenter',()=>go(a));a.addEventListener('focus',()=>go(a));a.addEventListener('click',()=>{act=a})});
nav.addEventListener('mouseleave',()=>go(act));nav.addEventListener('focusout',()=>go(act));
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){act=M[e.target.id];if(!nav.matches(':hover'))go(act)}}),{rootMargin:'-40% 0px -55% 0px'});
Object.keys(M).forEach(id=>{const s=document.getElementById(id);s&&so.observe(s)});
const re=()=>go(act);addEventListener('resize',re);Promise.resolve(document.fonts&&document.fonts.ready).then(re);re()}
/* hero: imagens a passar sozinhas (a barra de progresso comanda o tempo) */
const ss=$('.tt-ss');
if(ss){const im=$$('img',ss),dt=$('.tt-dots',ss);let n=0;dt.innerHTML=im.map(()=>'<b><i></i></b>').join('');const bs=$$('b',dt);
const show=k=>{n=(k+im.length)%im.length;im.forEach((x,j)=>x.classList.toggle('on',j===n));bs.forEach((b,j)=>{b.className=j<n?'d':j===n?'on':''})};
bs.forEach((b,j)=>b.addEventListener('click',()=>show(j)));$$('i',dt).forEach(i=>i.addEventListener('animationend',()=>show(n+1)));
new IntersectionObserver(e=>ss.classList.toggle('pz',!e[0].isIntersecting)).observe(ss);document.addEventListener('visibilitychange',()=>ss.classList.toggle('pz',document.hidden));show(0)}
/* lightbox: imagens e vídeos clicáveis, com setas, teclado e swipe */
const lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Visualizador');
lb.innerHTML='<div class="lb-bg"></div><button class="lb-x" aria-label="Fechar"><i class="ph ph-x"></i></button><button class="lb-n lb-p" aria-label="Anterior"><i class="ph ph-caret-left"></i></button><button class="lb-n lb-nx" aria-label="Seguinte"><i class="ph ph-caret-right"></i></button><div class="lb-st"></div><div class="lb-cp"><span></span><b></b></div>';
document.body.appendChild(lb);
const st=$('.lb-st',lb),cp=$('.lb-cp span',lb),ct=$('.lb-cp b',lb);
const full=e=>e.getAttribute('src').replace(/assets\/img\/(IMG_)/,'assets/img/lg/$1');
const meta=e=>e.classList.contains('tt-v')?{v:1,k:e.dataset.full,src:e.dataset.full,poster:$('video',e).getAttribute('poster'),cap:$('figcaption',e).textContent.trim()}:{k:full(e),src:full(e),cap:e.alt};
const grp=e=>e.closest('.tt-ss')?1:e.closest('.tt-car')?2:e.closest('#momentos')?3:e.closest('#publicos')?4:/neima/.test(e.getAttribute('src')||'')?5:6;
let items=[],ix=0,prev=null;
const stop=()=>{const v=$('video',st);if(v){v.pause();v.removeAttribute('src');v.load()}};
const render=()=>{const m=items[ix];stop();st.innerHTML='';let el;if(m.v){el=document.createElement('video');el.controls=true;el.autoplay=true;el.playsInline=true;el.setAttribute('poster',m.poster);el.src=m.src}else{el=new Image();el.alt=m.cap;el.src=m.src}
st.appendChild(el);cp.textContent=m.cap||'';ct.textContent=items.length>1?(ix+1)+' / '+items.length:'';lb.classList.toggle('one',items.length<2);const nx=items[(ix+1)%items.length];if(nx&&!nx.v)new Image().src=nx.src};
const open=e=>{const g=grp(e),seen=new Set();items=[];$$('[data-lb]').filter(x=>grp(x)===g).forEach(x=>{const m=meta(x);if(!seen.has(m.k)){seen.add(m.k);items.push(m)}});
ix=Math.max(0,items.findIndex(m=>m.k===meta(e).k));prev=document.activeElement;render();lb.classList.add('on');document.documentElement.style.overflow='hidden';$('.lb-x',lb).focus({preventScroll:true})};
const close=()=>{lb.classList.remove('on');stop();st.innerHTML='';document.documentElement.style.overflow='';prev&&prev.focus&&prev.focus({preventScroll:true})};
const go=d=>{if(items.length>1){ix=(ix+d+items.length)%items.length;render()}};
lb.addEventListener('click',e=>{const t=e.target;if(t.closest('.lb-x')||t.classList.contains('lb-bg'))close();else if(t.closest('.lb-p'))go(-1);else if(t.closest('.lb-nx'))go(1)});
$$('img[src*="assets/img/"],.tt-v').forEach(e=>{e.dataset.lb=1;e.tabIndex=0;e.setAttribute('role','button');e.setAttribute('aria-label',e.classList.contains('tt-v')?'Reproduzir vídeo: '+$('figcaption',e).textContent.trim():'Ampliar imagem: '+(e.alt||''))});
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-lb]');if(t&&!lb.contains(t))open(t)});
document.addEventListener('keydown',e=>{if(lb.classList.contains('on')){if(e.key==='Escape')close();else if(e.key==='ArrowRight')go(1);else if(e.key==='ArrowLeft')go(-1);return}
const t=e.target;if((e.key==='Enter'||e.key===' ')&&t.matches&&t.matches('[data-lb]')){e.preventDefault();open(t)}});
let sx=0;lb.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',e=>{if(e.target.tagName==='VIDEO')return;const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)go(d<0?1:-1)});
})();
