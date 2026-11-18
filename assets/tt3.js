(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* carrossel da Missão: uma imagem de cada vez, com autoplay, setas, pontos e swipe */
$$('.tt-car').forEach(c=>{const t=$('.tt-ct',c),im=$$('img',t),d=$('.tt-cd',c);let i=0,hold=0,vis=1;
d.innerHTML=im.map(()=>'<b></b>').join('');const bs=$$('b',d);
const set=k=>{i=(k+im.length)%im.length;bs.forEach((b,j)=>b.classList.toggle('on',j===i))};
const to=k=>{set(k);t.scrollTo({left:i*t.clientWidth,behavior:RM?'auto':'smooth'})};
t.addEventListener('scroll',()=>{clearTimeout(t._s);t._s=setTimeout(()=>set(Math.round(t.scrollLeft/t.clientWidth)),80)},{passive:true});
bs.forEach((b,j)=>b.addEventListener('click',()=>to(j)));$('.tt-cp',c).addEventListener('click',()=>to(i-1));$('.tt-cn',c).addEventListener('click',()=>to(i+1));
['pointerenter','focusin','touchstart'].forEach(e=>c.addEventListener(e,()=>{hold=1},{passive:true}));['pointerleave','focusout','touchend'].forEach(e=>c.addEventListener(e,()=>{hold=0},{passive:true}));
new IntersectionObserver(e=>{vis=e[0].isIntersecting}).observe(c);
if(!RM)setInterval(()=>{if(!hold&&vis&&!document.hidden)to(i+1)},4200);set(0)});
/* vídeos dos Momentos: setas */
const g=$('.tt-vgrid');
if(g){const step=()=>($('.tt-v',g).offsetWidth+20)*(innerWidth>=1024?2:1);$('.tt-vp').addEventListener('click',()=>g.scrollBy({left:-step(),behavior:'smooth'}));$('.tt-vn').addEventListener('click',()=>g.scrollBy({left:step(),behavior:'smooth'}))}
})();
