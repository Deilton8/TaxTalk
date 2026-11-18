(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const G=window.gsap,ST=window.ScrollTrigger,RM=matchMedia('(prefers-reduced-motion:reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
if(G&&ST)G.registerPlugin(ST);
/* progresso de leitura + botão voltar ao topo */
const bar=$('#tt-prog'),bt=$('#tt-top'),ring=$('.pg',bt);let tk=0;
const upd=()=>{tk=0;const m=document.documentElement.scrollHeight-innerHeight,p=m>0?Math.min(scrollY/m,1):0;bar.style.transform='scaleX('+p+')';ring.style.strokeDashoffset=138.2*(1-p);bt.classList.toggle('on',scrollY>500)};
addEventListener('scroll',()=>{tk||(tk=requestAnimationFrame(upd))},{passive:true});upd();
bt.onclick=()=>scrollTo({top:0,behavior:RM?'auto':'smooth'});
/* vídeos tocam só quando visíveis */
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?e.target.play().catch(()=>{}):e.target.pause()),{threshold:.3});
$$('#inicio video,.tt-v video').forEach(v=>io.observe(v));
/* cena 3D (Three.js): moedas, poliedros e partículas */
function scene(){const T=window.THREE,c=$('#tt3d');if(!T||!c)return;
const sec=c.parentElement,r=new T.WebGLRenderer({canvas:c,alpha:true,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,1.75));
const s=new T.Scene(),cam=new T.PerspectiveCamera(38,1,.1,60);cam.position.z=16;
s.add(new T.AmbientLight(0xffffff,.8));const l1=new T.PointLight(0xfff1d6,1.3);l1.position.set(6,8,10);s.add(l1);const l2=new T.PointLight(0x6f9bd6,.9);l2.position.set(-8,-4,6);s.add(l2);
const M=(c,sp,sh)=>new T.MeshPhongMaterial({color:c,specular:sp,shininess:sh}),gold=M(0xC99550,0xffecc8,90),dk=M(0xA8782F,0xffe2a8,60),navy=M(0x12283E,0x7fa3cf,70);
const wire=new T.MeshBasicMaterial({color:0x12283E,wireframe:true,transparent:true,opacity:.3});
const coin=m=>{const k=new T.Group();k.add(new T.Mesh(new T.CylinderGeometry(1,1,.22,56),m));k.add(new T.Mesh(new T.CylinderGeometry(.68,.68,.28,48),m===gold?dk:gold));const t=new T.Mesh(new T.TorusGeometry(.97,.06,12,56),dk);t.rotation.x=Math.PI/2;k.add(t);return k};
const g=new T.Group();s.add(g);const it=[];
[[-.93,2.9,-1,.85,0],[-.8,-3.3,0,.6,1],[.9,3.1,-2,.95,0],[.66,-3.7,0,.9,1],[.97,.3,-3,.8,2],[-.97,.2,-2,.6,2],[.25,4.4,-4,.7,0],[-.4,-4.5,-3,.8,2]].slice(0,innerWidth<768?6:8).forEach(([u,y,z,sc,k])=>{
const o=k==2?new T.Mesh(new T.IcosahedronGeometry(1,0),wire):coin(k?navy:gold);o.scale.setScalar(sc);o.position.set(0,y,z);o.u=u;o.b=y;o.v=[Math.random()*.008+.003,Math.random()*.01+.004,Math.random()+.6,Math.random()*6];g.add(o);it.push(o)});
const R=[34,11,10],P=new Float32Array(180);for(let i=0;i<180;i++)P[i]=(Math.random()-.5)*R[i%3];
const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(P,3));g.add(new T.Points(pg,new T.PointsMaterial({color:0xC99550,size:.09,transparent:true,opacity:.7})));
let vis=1,mx=0,my=0,tx=0,ty=0;
const rs=()=>{const w=sec.clientWidth,h=sec.clientHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();const W=Math.tan(cam.fov*Math.PI/360)*cam.position.z*cam.aspect;it.forEach(o=>o.position.x=o.u*W)};
rs();addEventListener('resize',rs);new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(sec);
addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
const draw=t=>{mx+=(tx-mx)*.05;my+=(ty-my)*.05;const p=Math.min(scrollY/sec.offsetHeight,1.2);g.rotation.y=mx*.7+p*1.4;g.rotation.x=my*.35;g.position.y=p*3.5;it.forEach(o=>{o.rotation.x+=o.v[0];o.rotation.y+=o.v[1];o.position.y=o.b+Math.sin(t*.0006*o.v[2]+o.v[3])*.4});r.render(s,cam)};
if(RM){draw(0);return}
const f=t=>{requestAnimationFrame(f);vis&&!document.hidden&&draw(t)};f(0)}
scene();
if(!G)return;
/* staggered menu (adaptado do reactbits.dev) */
const sm=$('.sm'),b0=$('#mobile-menu-btn'),btn=b0.cloneNode(false);
btn.className='tt-mg inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-taxNavy';
btn.innerHTML='<span class="sm-lb">Menu</span><i class="ph ph-plus sm-pl"></i>';btn.setAttribute('aria-expanded','false');b0.replaceWith(btn);
const L=$$('.sm-l i'),P=$('.sm-p'),A=$$('.sm-a'),CT=$('.sm-cta'),FT=$('.sm-ft');let op=false;
G.set([...L,P],{xPercent:100});G.set(A,{yPercent:140,rotate:8});G.set([CT,FT],{autoAlpha:0,y:24});
const tl=G.timeline({paused:true,defaults:{ease:'power4.out'},onReverseComplete:()=>sm.classList.remove('on')})
.to(L,{xPercent:0,duration:.55,stagger:.08},0).to(P,{xPercent:0,duration:.7},.2).to(A,{yPercent:0,rotate:0,duration:1,stagger:.07},.38).to([CT,FT],{autoAlpha:1,y:0,duration:.6,stagger:.1},.75);
const set=v=>{op=v;btn.setAttribute('aria-expanded',v);$('.sm-lb',btn).textContent=v?'Fechar':'Menu';G.to($('.sm-pl',btn),{rotate:v?225:0,duration:.5,ease:'power3.out'});document.documentElement.style.overflow=v?'hidden':'';sm.setAttribute('aria-hidden',!v);if(v){sm.classList.add('on');tl.timeScale(1).play()}else tl.timeScale(1.7).reverse()};
btn.onclick=()=>set(!op);A.forEach(a=>a.onclick=()=>set(false));
CT.onclick=()=>{set(false);setTimeout(()=>window.openContactModal&&openContactModal('Participação / Contacto'),350)};
addEventListener('keydown',e=>e.key==='Escape'&&op&&set(false));addEventListener('resize',()=>innerWidth>=1024&&op&&set(false));
if(RM)return;
/* título: SplitText (reactbits) + entrada do hero */
const split=el=>{const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n=[];while(w.nextNode())n.push(w.currentNode);
n.forEach(t=>{const f=document.createDocumentFragment();t.textContent.split(/(\s+)/).forEach(p=>{if(!p.trim()){f.append(p);return}const o=document.createElement('span');o.className='tt-w';o.innerHTML='<i>'+p+'</i>';f.append(o)});t.replaceWith(f)});return $$('.tt-w>i',el)};
G.from(split($('#inicio h1')),{yPercent:115,rotate:5,duration:1.1,ease:'power4.out',stagger:.07,delay:.1});
G.from('#inicio [class*="col-span-5"]>*',{opacity:0,y:50,rotateY:-14,transformPerspective:900,duration:1.2,ease:'power3.out',stagger:.15,delay:.35});
/* scroll-trigger: revelação em cascata + parallax */
if(ST){const sel='section:not(#inicio) h2,section:not(#inicio) h2~p,section:not(#inicio) .grid>*,.tt-vgrid>*,.tt-mq,footer .grid>*';
$$(sel).forEach(e=>e.classList.add('tt-r'));G.set(sel,{opacity:0,y:44});
ST.batch(sel,{start:'top 92%',once:true,onEnter:b=>G.to(b,{opacity:1,y:0,duration:.9,ease:'power3.out',stagger:.12,overwrite:'auto',onComplete:()=>b.forEach(e=>e.classList.remove('tt-r'))})});
$$('#sobre img,#pilares img,#formatos img,#publicos img').forEach(i=>{if(getComputedStyle(i.parentElement).overflow!=='hidden')return;i.style.transition='none';
G.fromTo(i,{yPercent:-7,scale:1.18},{yPercent:7,scale:1.18,ease:'none',scrollTrigger:{trigger:i.parentElement,scrub:.6,start:'top bottom',end:'bottom top'}})});
addEventListener('load',()=>ST.refresh())}
/* inclinação 3D + brilho (reactbits TiltedCard/SpotlightCard) e botões magnéticos */
if(FINE){$$('#inicio [class*="aspect-[4/5]"],#pilares .grid>*,#formatos .grid>*,#publicos .grid>*,.tt-v').forEach(e=>{
if(getComputedStyle(e).position==='static')e.style.position='relative';e.classList.add('tt-tilt');
e.addEventListener('pointermove',ev=>{const b=e.getBoundingClientRect(),x=(ev.clientX-b.left)/b.width,y=(ev.clientY-b.top)/b.height;e.style.setProperty('--mx',x*100+'%');e.style.setProperty('--my',y*100+'%');G.to(e,{rotationY:(x-.5)*12,rotationX:(.5-y)*12,transformPerspective:900,duration:.5,ease:'power2.out',overwrite:'auto'})});
e.addEventListener('pointerleave',()=>G.to(e,{rotationX:0,rotationY:0,duration:.9,ease:'elastic.out(1,.6)',overwrite:'auto'}))});
$$('header button:not(#mobile-menu-btn),#inicio .pt-2 a,#contacto button,#contacto a').forEach(b=>{b.classList.add('tt-mg');const X=G.quickTo(b,'x',{duration:.5,ease:'power3'}),Y=G.quickTo(b,'y',{duration:.5,ease:'power3'});
b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();X((e.clientX-r.left-r.width/2)*.25);Y((e.clientY-r.top-r.height/2)*.25)});b.addEventListener('pointerleave',()=>{X(0);Y(0)})})}
})();
