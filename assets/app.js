const collections=[
  {key:'casamentos',title:'Casamentos',overline:'01 / HISTÓRIAS DE AMOR',image:'assets/casamento.webp',alt:'Casal recém-casado se abraça sob a luz dourada',description:'Da ansiedade antes da cerimônia à pista cheia no final da noite. Uma coleção sobre gestos pequenos, pessoas queridas e a alegria de escolher caminhar juntos.',photos:['assets/casamento.webp','assets/casamento-2.webp','assets/casamento-3.webp']},
  {key:'formaturas',title:'Formaturas',overline:'02 / NOVOS COMEÇOS',image:'assets/formatura.webp',alt:'Formanda celebra com sua família',description:'Tem um mundo inteiro por trás de uma conquista: os dias difíceis, quem torceu junto e a coragem de continuar. Vamos guardar a celebração de tudo isso.',photos:['assets/formatura.webp','assets/formatura-2.webp','assets/formatura-3.webp']},
  {key:'gestantes',title:'Gestantes & bebês',overline:'03 / VIDA QUE CHEGA',image:'assets/gestante.webp',alt:'Casal durante a espera de um bebê',description:'A espera, o chá de bebê, os primeiros dias. Fotografias com delicadeza e tempo para acolher essa fase que passa tão depressa.',photos:['assets/gestante.webp','assets/gestante-2.webp','assets/gestante-3.webp']},
  {key:'familias',title:'Famílias',overline:'04 / A VIDA AGORA',image:'assets/familia.webp',alt:'Família rindo em um jardim ao entardecer',description:'O jeito de se abraçar, a risada conhecida, as pequenas aventuras de uma tarde juntos. Retratos para se reconhecer no que realmente importa.',photos:['assets/familia.webp','assets/familia-2.webp','assets/familia-3.webp']}
];
const menuButton=document.querySelector('.menu-button');
const mobileNav=document.querySelector('.mobile-nav');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Abrir menu':'Fechar menu');mobileNav.hidden=open;});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');}));

const dialog=document.getElementById('collection-dialog');
let currentIndex=0;
function showPhoto(index){const item=collections[currentIndex];const photo=document.getElementById('dialog-photo');photo.src=item.photos[index];photo.alt=`${item.title}: fotografia ${index+1} de ${item.photos.length}`;document.querySelectorAll('.dialog-thumbnails button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));}
function renderCollection(index){currentIndex=(index+collections.length)%collections.length;const item=collections[currentIndex];document.getElementById('dialog-overline').textContent=item.overline;document.getElementById('dialog-title').textContent=item.title;document.getElementById('dialog-description').textContent=item.description;document.getElementById('dialog-count').textContent=`0${currentIndex+1} / 0${collections.length}`;const thumbnails=document.getElementById('dialog-thumbnails');thumbnails.replaceChildren();item.photos.forEach((src,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`Ver fotografia ${i+1} de ${item.title}`);button.setAttribute('aria-pressed',String(i===0));const img=document.createElement('img');img.src=src;img.alt='';img.loading='lazy';button.append(img);button.addEventListener('click',()=>showPhoto(i));thumbnails.append(button);});showPhoto(0);}
document.querySelectorAll('[data-collection]').forEach(card=>card.addEventListener('click',()=>{renderCollection(collections.findIndex(item=>item.key===card.dataset.collection));dialog.showModal();document.body.classList.add('dialog-open');}));
function closeDialog(){dialog.close();document.body.classList.remove('dialog-open');}
document.querySelector('.dialog-close').addEventListener('click',closeDialog);
dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog();});
dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
document.getElementById('dialog-prev').addEventListener('click',()=>renderCollection(currentIndex-1));
document.getElementById('dialog-next').addEventListener('click',()=>renderCollection(currentIndex+1));
document.getElementById('dialog-contact').addEventListener('click',closeDialog);

document.querySelectorAll('[data-plan]').forEach(link=>link.addEventListener('click',()=>{const select=document.getElementById('type');const plan=link.dataset.plan;if(plan==='Ensaio')select.value='Família';else if(plan==='Celebração')select.value='Formatura';else select.value='Casamento';}));

const form=document.getElementById('inquiry-form');
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const message=`Olá! Meu nome é ${data.get('name')}.\n\nQuero fotografar: ${data.get('type')}\nMinha ideia, data ou cidade: ${data.get('message')}\n\nMeu e-mail para retorno: ${data.get('email')}`;document.getElementById('prepared-message').value=message;const result=document.getElementById('form-result');result.hidden=false;result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});});
document.getElementById('copy-message').addEventListener('click',async()=>{const text=document.getElementById('prepared-message').value;try{await navigator.clipboard.writeText(text);}catch{document.getElementById('prepared-message').select();document.execCommand('copy');}document.getElementById('copy-message').textContent='Mensagem copiada ✓';});
document.getElementById('year').textContent=new Date().getFullYear();
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px -30px 0px'});document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));}else document.querySelectorAll('.reveal').forEach(element=>element.classList.add('visible'));

const mobileLayout=window.matchMedia('(max-width: 760px)');
const collectionStack=document.querySelector('.collection-stack');
const collectionStage=collectionStack.querySelector('.collection-grid');
const stackCards=[...collectionStage.querySelectorAll('.collection-card')];
const prefersMotion=window.matchMedia('(prefers-reduced-motion: no-preference)');
let collectionFrame=0;
function updateCollectionStack(){
  collectionFrame=0;
  if(!mobileLayout.matches||!prefersMotion.matches){
    collectionStack.classList.remove('is-enhanced');
    stackCards.forEach(card=>card.style.removeProperty('--entry'));
    return;
  }
  collectionStack.classList.add('is-enhanced');
  const available=collectionStack.offsetHeight-collectionStage.offsetHeight;
  const travel=Math.max(1,available-window.innerHeight*.24);
  const progress=Math.min(1,Math.max(0,(82-collectionStack.getBoundingClientRect().top)/travel))*(stackCards.length-1);
  stackCards.forEach((card,index)=>{
    const entry=index===0?0:1-Math.min(1,Math.max(0,(progress-(index-1)-.25)/.75));
    card.style.setProperty('--entry',`${(entry*100).toFixed(2)}%`);
  });
}
function scheduleCollections(){if(!collectionFrame)collectionFrame=requestAnimationFrame(updateCollectionStack);}
window.addEventListener('scroll',scheduleCollections,{passive:true});
window.addEventListener('resize',scheduleCollections,{passive:true});
scheduleCollections();

const stepsTrack=document.querySelector('.steps');
const stepCards=[...stepsTrack.querySelectorAll('.step')];
let timelineFrame=0;
function updateTimeline(){
  timelineFrame=0;
  if(!mobileLayout.matches)return;
  const dots=stepCards.map(card=>card.offsetTop+42);
  const length=Math.max(1,dots.at(-1)-dots[0]);
  const top=stepsTrack.getBoundingClientRect().top+dots[0];
  const progress=Math.min(1,Math.max(0,(window.innerHeight*.45-top)/length));
  stepsTrack.style.setProperty('--track-top',`${dots[0]}px`);
  stepsTrack.style.setProperty('--track-length',`${length}px`);
  stepsTrack.style.setProperty('--track-fill',`${length*progress}px`);
  const current=progress>=1?stepCards.length-1:Math.min(stepCards.length-1,Math.floor(progress*(stepCards.length-1)+.5));
  stepCards.forEach((card,index)=>card.classList.toggle('is-current',index===current));
}
function scheduleTimeline(){if(!timelineFrame)timelineFrame=requestAnimationFrame(updateTimeline);}
window.addEventListener('scroll',scheduleTimeline,{passive:true});
window.addEventListener('resize',scheduleTimeline,{passive:true});
scheduleTimeline();

const planTrack=document.querySelector('.plan-grid');
const planCards=[...planTrack.querySelectorAll('.plan')];
const planCount=document.querySelector('.plan-count');
const previousPlan=document.querySelector('.plan-prev');
const nextPlan=document.querySelector('.plan-next');
const calmMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let activePlan=1;
let planFrame=0;
function centerPlan(index,behavior='smooth'){
  activePlan=Math.max(0,Math.min(planCards.length-1,index));
  const card=planCards[activePlan];
  const left=planTrack.scrollLeft+card.getBoundingClientRect().left-planTrack.getBoundingClientRect().left-(planTrack.clientWidth-card.clientWidth)/2;
  planTrack.scrollTo({left,behavior:calmMotion.matches?'auto':behavior});
  updatePlanState();
}
function updatePlanState(){
  if(!mobileLayout.matches)return;
  const center=planTrack.getBoundingClientRect().left+planTrack.clientWidth/2;
  let nearest=0;
  let distance=Infinity;
  planCards.forEach((card,index)=>{const middle=card.getBoundingClientRect().left+card.clientWidth/2;const delta=Math.abs(middle-center);if(delta<distance){distance=delta;nearest=index;}});
  activePlan=nearest;
  planCards.forEach((card,index)=>card.classList.toggle('is-active',index===nearest));
  planCount.textContent=`0${nearest+1} / 0${planCards.length}`;
  previousPlan.disabled=nearest===0;
  nextPlan.disabled=nearest===planCards.length-1;
}
planTrack.addEventListener('scroll',()=>{if(!planFrame)planFrame=requestAnimationFrame(()=>{planFrame=0;updatePlanState();});},{passive:true});
planTrack.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();centerPlan(activePlan+(event.key==='ArrowRight'?1:-1));}});
previousPlan.addEventListener('click',()=>centerPlan(activePlan-1));
nextPlan.addEventListener('click',()=>centerPlan(activePlan+1));
let wasMobile=false;
function initializePlans(){
  if(mobileLayout.matches){if(!wasMobile)centerPlan(1,'auto');else centerPlan(activePlan,'auto');wasMobile=true;}
  else{wasMobile=false;planCards.forEach(card=>card.classList.remove('is-active'));}
}
requestAnimationFrame(initializePlans);
window.addEventListener('resize',()=>{scheduleTimeline();initializePlans();},{passive:true});
