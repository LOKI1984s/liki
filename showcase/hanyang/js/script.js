const allMenuBtn = document.querySelector('#allMenuBtn');
const megaMenu = document.querySelector('#megaMenu');
allMenuBtn?.addEventListener('click', () => {
  const open = megaMenu.classList.toggle('open');
  allMenuBtn.setAttribute('aria-expanded', String(open));
});

document.addEventListener('click', (event) => {
  if (!megaMenu.contains(event.target) && !allMenuBtn.contains(event.target)) {
    megaMenu.classList.remove('open');
    allMenuBtn.setAttribute('aria-expanded', 'false');
  }
});

const tabButtons = document.querySelectorAll('[data-tabs] button');
const trendArt = document.querySelector('#trendArt');
const backgrounds = {
  masterpiece: "url('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=2200&q=85')",
  season: "url('https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=2200&q=85')",
  bucket: "url('https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=2200&q=85')"
};

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    tabButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const key = button.dataset.tab;
    trendArt.style.backgroundImage = `linear-gradient(90deg,rgba(0,0,0,.1),rgba(0,0,0,.12)),${backgrounds[key]}`;
  });
});


// shared prototype interactions

document.querySelectorAll('.qty').forEach(box=>{const input=box.querySelector('input');const buttons=box.querySelectorAll('button');if(buttons[0]&&buttons[1]&&input){buttons[0].addEventListener('click',()=>input.value=Math.max(1,(+input.value||1)-1));buttons[1].addEventListener('click',()=>input.value=(+input.value||1)+1);}});
document.querySelectorAll('.date-cards button').forEach(b=>b.addEventListener('click',()=>{b.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');}));

// 2026 motion system
const header = document.querySelector('.site-header, .sub-header');
const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
syncHeader(); window.addEventListener('scroll', syncHeader, {passive:true});

const revealTargets = document.querySelectorAll('main section, .product-card, .shop-card, .info-card, .plan-grid article, .service-grid article');
revealTargets.forEach((el,i)=>{el.dataset.reveal='';el.style.transitionDelay=`${Math.min(i%6,5)*55}ms`;});
const revealObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px -30px'});
revealTargets.forEach(el=>revealObserver.observe(el));


document.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{btn.classList.remove('is-clicked');void btn.offsetWidth;btn.classList.add('is-clicked');}));


// Add a subtle parallax effect only on capable devices.
if(matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches){
  const heroes=document.querySelectorAll('.hero-image,.subscription-hero,.partner-hero,.brand-hero');
  window.addEventListener('scroll',()=>heroes.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)el.style.backgroundPosition=`center calc(50% + ${r.top*.035}px)`;}),{passive:true});
}

// account page interactions
document.querySelectorAll('[data-modal-open]').forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.modalOpen)?.classList.add('open')));document.querySelectorAll('.simple-modal').forEach(modal=>{modal.querySelector('.modal-close')?.addEventListener('click',()=>modal.classList.remove('open'));modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')})});

// member dropdown and authentication flows
document.querySelectorAll('.account-trigger').forEach(trigger=>trigger.addEventListener('click',e=>{e.stopPropagation();const menu=trigger.closest('.account-menu');const open=menu.classList.toggle('open');trigger.setAttribute('aria-expanded',String(open));}));
document.addEventListener('click',()=>document.querySelectorAll('.account-menu.open').forEach(x=>x.classList.remove('open')));
function activateTabs(buttons,paneSelector,dataKey){buttons.forEach(btn=>btn.addEventListener('click',()=>{buttons.forEach(b=>b.classList.remove('active'));document.querySelectorAll(paneSelector).forEach(p=>p.classList.remove('active'));btn.classList.add('active');document.querySelector(`${paneSelector}[data-${dataKey}-pane="${btn.dataset[dataKey+'Tab']}"]`)?.classList.add('active');}));}
activateTabs(document.querySelectorAll('[data-auth-tab]'),'.auth-pane','auth');
activateTabs(document.querySelectorAll('[data-find-tab]'),'.find-pane','find');
const hashTab=location.hash.replace('#','');if(hashTab){document.querySelector(`[data-find-tab="${hashTab}"]`)?.click();}
const allCheck=document.querySelector('[data-check-all]');allCheck?.addEventListener('change',()=>document.querySelectorAll('.join-card input[type="checkbox"]').forEach(c=>c.checked=allCheck.checked));
document.querySelector('[data-next-signup]')?.addEventListener('click',()=>{const req=[...document.querySelectorAll('.required-agree')];if(req.every(x=>x.checked)) location.href='signup-info.html'; else alert('필수 약관에 동의해주세요.');});


// Product detail tab navigation
const detailTabs = document.querySelectorAll('.detail-tabs a[href^="#"]');
detailTabs.forEach(tab => tab.addEventListener('click', () => {
  detailTabs.forEach(item => item.classList.remove('active'));
  tab.classList.add('active');
}));


// Four-image main hero: 3s crossfade + 3s hold (6s cycle).
(() => {
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.hero-slider-dots [data-slide-to]')];
  if (slides.length < 2) return;
  let current = 0;
  let timer;
  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  };
  const start = () => {
    clearInterval(timer);
    timer = setInterval(() => show(current + 1), 6000);
  };
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
  const hero = document.querySelector('.hero');
  hero?.addEventListener('mouseenter', () => clearInterval(timer));
  hero?.addEventListener('mouseleave', start);
  start();
})();

// Hero manual navigation arrows
(()=>{
  const slides=[...document.querySelectorAll('.hero-slide')];
  if(slides.length<2)return;
  const currentIndex=()=>Math.max(0,slides.findIndex(s=>s.classList.contains('active')));
  const clickDot=(index)=>document.querySelector(`[data-slide-to="${(index+slides.length)%slides.length}"]`)?.click();
  document.querySelector('.hero-prev')?.addEventListener('click',()=>clickDot(currentIndex()-1));
  document.querySelector('.hero-next-slide')?.addEventListener('click',()=>clickDot(currentIndex()+1));
})();

// Footer bank-account copy interaction
document.querySelectorAll('.copy-account').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(btn.dataset.copy||'');const old=btn.textContent;btn.textContent='복사됨';setTimeout(()=>btn.textContent=old,1400);}catch(e){alert('계좌번호: '+(btn.dataset.copy||''));}}));

// Payment guide tabs
document.querySelectorAll('[data-pay-tab]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-pay-tab]').forEach(x=>x.classList.remove('active'));document.querySelectorAll('[data-pay-pane]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');document.querySelector(`[data-pay-pane="${btn.dataset.payTab}"]`)?.classList.add('active');}));
// Catalog sort visual state
document.querySelectorAll('.catalog-sort button').forEach(btn=>btn.addEventListener('click',()=>{btn.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');}));

// Keep the sticky product-detail tab visible and highlight the current section.
(()=>{
 const tabs=[...document.querySelectorAll('.detail-tabs a[href^="#"]')];
 if(!tabs.length)return;
 const pairs=tabs.map(tab=>[tab,document.querySelector(tab.getAttribute('href'))]).filter(x=>x[1]);
 const setActive=(id)=>tabs.forEach(tab=>tab.classList.toggle('active',tab.getAttribute('href')===`#${id}`));
 const observer=new IntersectionObserver(entries=>{
   const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
   if(visible)setActive(visible.target.id);
 },{rootMargin:'-30% 0px -55% 0px',threshold:[0,.15,.4]});
 pairs.forEach(([,section])=>observer.observe(section));
})();

// Product-detail floating TOP button.
(()=>{
  if(!document.querySelector('.product-detail')) return;
  const button=document.createElement('button');
  button.type='button';
  button.className='detail-top-button';
  button.setAttribute('aria-label','페이지 맨 위로 이동');
  button.textContent='TOP';
  document.body.appendChild(button);
  const sync=()=>button.classList.toggle('is-visible',window.scrollY>420);
  sync();
  window.addEventListener('scroll',sync,{passive:true});
  button.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
})();


// 2026.07 consolidated fixes
(() => {
  const header = document.querySelector('.sub-header');
  if (header) {
    const syncHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

  const tabs = [...document.querySelectorAll('.product-page .detail-tabs a')];
  if (tabs.length) {
    const sections = tabs.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const activate = () => {
      const offset = (document.querySelector('.sub-header')?.offsetHeight || 128) + 90;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= offset) current = section;
      }
      tabs.forEach(a => a.classList.toggle('active', current && a.getAttribute('href') === `#${current.id}`));
    };
    tabs.forEach(a => a.addEventListener('click', () => {
      setTimeout(activate, 450);
    }));
    window.addEventListener('scroll', activate, { passive: true });
    activate();
  }
})();


// Signup interactions: front-end demo, ready for later API integration.
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.email-domain, #emailDomain').forEach(select=>{
    const box=select.closest('.email-compose'); const custom=box?.querySelector('.custom-domain');
    const sync=()=>{ const show=select.value==='custom'; if(custom){custom.hidden=!show; custom.required=show; if(show) custom.focus();} };
    select.addEventListener('change',sync); sync();
  });
  const birth=document.querySelector('#birthDate');
  if(birth){ birth.addEventListener('click',()=>{ if(typeof birth.showPicker==='function') birth.showPicker(); }); }
  const checkEmail=document.querySelector('#checkEmailBtn');
  checkEmail?.addEventListener('click',()=>{
    const local=document.querySelector('#emailLocal')?.value.trim(); const select=document.querySelector('#emailDomain');
    const domain=select?.value==='custom'?document.querySelector('#customDomain')?.value.trim():select?.value;
    const msg=document.querySelector('#emailMessage');
    if(!local||!domain){msg.textContent='이메일 주소를 모두 입력해 주세요.';msg.className='field-message error';return;}
    msg.textContent=`${local}@${domain} 은(는) 사용 가능한 이메일입니다. (데모)`;msg.className='field-message success';
  });
  const send=document.querySelector('#sendCodeBtn'), panel=document.querySelector('#verifyPanel'), timerEl=document.querySelector('#verifyTimer'), verify=document.querySelector('#verifyCodeBtn'), vmsg=document.querySelector('#verifyMessage'); let interval;
  send?.addEventListener('click',()=>{
    const phone=document.querySelector('#phoneInput')?.value.trim(); if(!phone){alert('휴대전화 번호를 입력해 주세요.');return;}
    panel.hidden=false; clearInterval(interval); let left=180; send.textContent='인증번호 재전송';
    const tick=()=>{ const m=String(Math.floor(left/60)).padStart(2,'0'),s=String(left%60).padStart(2,'0'); timerEl.textContent=`${m}:${s}`; if(left--<=0){clearInterval(interval);timerEl.textContent='시간 만료';} }; tick(); interval=setInterval(tick,1000); document.querySelector('#verifyCode')?.focus();
  });
  verify?.addEventListener('click',()=>{ const code=document.querySelector('#verifyCode')?.value.trim(); if(code?.length===6){vmsg.textContent='휴대전화 인증이 완료되었습니다. (데모)';vmsg.className='field-message success';clearInterval(interval);timerEl.textContent='인증 완료';}else{vmsg.textContent='6자리 인증번호를 입력해 주세요.';vmsg.className='field-message error';} });
  let activeAddressBtn=null;
  const modal=document.createElement('div'); modal.className='address-modal'; modal.hidden=true; modal.innerHTML=`<div class="address-dialog" role="dialog" aria-modal="true" aria-label="주소 검색"><div class="address-dialog-head"><h2>주소 찾기</h2><button class="address-close" type="button" aria-label="닫기">×</button></div><div class="address-search-row"><input class="address-query" placeholder="도로명, 건물명 또는 지번 입력"><button class="address-query-btn" type="button">검색</button></div><div class="address-results"></div><p class="address-note">현재는 화면 동작 확인용 예시입니다. 추후 다음/카카오 주소 API를 연결할 수 있습니다.</p></div>`; document.body.appendChild(modal);
  const renderResults=()=>{ const q=modal.querySelector('.address-query').value.trim(); const results=modal.querySelector('.address-results'); if(!q){results.innerHTML='<p class="field-message error">검색어를 입력해 주세요.</p>';return;} const examples=[['03154','서울특별시 종로구 종로 1'],['04524','서울특별시 중구 세종대로 110'],['06236','서울특별시 강남구 테헤란로 123']]; results.innerHTML=examples.map(([zip,address])=>`<button type="button" class="address-result" data-zip="${zip}" data-address="${address}"><b>${zip}</b>${address} · ${q}</button>`).join(''); };
  document.querySelectorAll('.address-search-btn').forEach(btn=>btn.addEventListener('click',()=>{activeAddressBtn=btn;modal.hidden=false;modal.querySelector('.address-query').focus();}));
  modal.querySelector('.address-close').addEventListener('click',()=>modal.hidden=true); modal.addEventListener('click',e=>{if(e.target===modal)modal.hidden=true;}); modal.querySelector('.address-query-btn').addEventListener('click',renderResults); modal.querySelector('.address-query').addEventListener('keydown',e=>{if(e.key==='Enter')renderResults();}); modal.querySelector('.address-results').addEventListener('click',e=>{const item=e.target.closest('.address-result');if(!item||!activeAddressBtn)return;const label=activeAddressBtn.closest('label');(label.querySelector('#postcode,.postcode')||label.querySelector('input')).value=item.dataset.zip;const base=label.querySelector('#baseAddress,.base-address');if(base)base.value=item.dataset.address;modal.hidden=true;});
  document.querySelector('#personalSignupForm')?.addEventListener('submit',e=>{e.preventDefault();location.href='signup-complete.html';});
});

// Global interaction audit: wishlist, product quantity, checkout date/payment/address.
document.addEventListener('DOMContentLoaded',()=>{
  const toast=(message)=>{
    let el=document.querySelector('.button-feedback');
    if(!el){el=document.createElement('div');el.className='button-feedback';document.body.appendChild(el);}
    el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),1600);
  };

  // 찜하기 버튼 클릭/상태 동기화는 아래 "Final deterministic wishlist" 블록 하나로 일원화함.
  // (예전엔 이 블록과 아래 블록이 같은 localStorage 키를 동시에 토글해서, 클릭해도
  //  찜 상태가 저장되는 순간 바로 취소되는 버그가 있었음. toast 함수만 전역으로 공유하고
  //  실제 토글·저장은 한 곳에서만 하도록 정리.)
  window.__hanyangWishToast = toast;

  // Product quantity controls.
  document.querySelectorAll('.qty').forEach(box=>{
    const buttons=box.querySelectorAll('button');const input=box.querySelector('input');const total=box.querySelector('strong');
    if(buttons.length<2||!input)return;
    const base=Number((total?.textContent||'61900').replace(/[^0-9]/g,''))||61900;
    const update=(value)=>{const count=Math.max(1,Math.min(99,Number(value)||1));input.value=count;if(total)total.textContent=(base*count).toLocaleString('ko-KR')+'원';};
    buttons[0].addEventListener('click',()=>update(Number(input.value)-1));buttons[1].addEventListener('click',()=>update(Number(input.value)+1));input.addEventListener('change',()=>update(input.value));
  });

  // Checkout interactions.
  const checkout=document.querySelector('.checkout-layout');
  if(checkout){
    const dateButtons=[...document.querySelectorAll('.date-cards button')];
    dateButtons.forEach(btn=>btn.addEventListener('click',()=>{
      if(btn.textContent.includes('날짜선택')){openDatePicker(btn);return;}
      dateButtons.forEach(x=>x.classList.remove('active'));btn.classList.add('active');toast(`${btn.innerText.replace(/\n/g,' ')} 배송일을 선택했습니다.`);
    }));
    function openDatePicker(target){
      let modal=document.querySelector('.checkout-date-picker');
      if(!modal){modal=document.createElement('div');modal.className='checkout-date-picker';modal.hidden=true;modal.innerHTML='<div class="checkout-date-dialog" role="dialog" aria-modal="true"><h3>배송 희망일 선택</h3><input type="date" class="checkout-custom-date"><div class="checkout-date-actions"><button type="button" class="cancel">취소</button><button type="button" class="confirm">선택완료</button></div></div>';document.body.appendChild(modal);
        modal.querySelector('.cancel').onclick=()=>modal.hidden=true;modal.addEventListener('click',e=>{if(e.target===modal)modal.hidden=true;});
        modal.querySelector('.confirm').onclick=()=>{const input=modal.querySelector('input');if(!input.value){toast('날짜를 선택해 주세요.');return;}const d=new Date(input.value+'T00:00:00');dateButtons.forEach(x=>x.classList.remove('active'));target.classList.add('active');target.innerHTML=`선택일<br><b>${d.getMonth()+1}/${d.getDate()}</b>`;target.dataset.date=input.value;modal.hidden=true;toast('배송 희망일이 선택되었습니다.');};
      }
      const input=modal.querySelector('input');const tomorrow=new Date(Date.now()+86400000);input.min=tomorrow.toISOString().slice(0,10);input.value=target.dataset.date||input.min;modal.hidden=false;if(typeof input.showPicker==='function')setTimeout(()=>input.showPicker(),50);
    }

    const paymentLabels=[...document.querySelectorAll('.payment-tabs label')];
    let paymentPanel=document.querySelector('.payment-detail-panel');
    if(!paymentPanel){paymentPanel=document.createElement('div');paymentPanel.className='payment-detail-panel';document.querySelector('.payment-tabs')?.after(paymentPanel);}
    const paymentText={신용카드:'국내외 신용카드로 안전하게 결제합니다.',간편결제:'카카오페이·네이버페이 등 간편결제를 선택할 수 있습니다. (데모)',무통장입금:'농협 301-0149-4037-31 · 예금주 주식회사 한양꽃집'};
    const syncPayment=(label)=>{paymentLabels.forEach(x=>x.classList.toggle('active',x===label));const radio=label.querySelector('input');if(radio)radio.checked=true;const name=label.textContent.trim();paymentPanel.textContent=paymentText[name]||`${name}을 선택했습니다.`;toast(`${name}을 선택했습니다.`);};
    paymentLabels.forEach(label=>label.addEventListener('click',()=>syncPayment(label)));syncPayment(paymentLabels.find(x=>x.querySelector('input:checked'))||paymentLabels[0]);

    // Address search demo popup for every checkout address button.
    document.querySelectorAll('.address-row button').forEach(button=>button.addEventListener('click',()=>{
      const row=button.closest('.address-row');const wide=button.closest('label');
      const postal=row?.querySelector('input');const inputs=wide?.querySelectorAll('input');
      const modal=document.createElement('div');modal.className='checkout-date-picker';modal.innerHTML='<div class="checkout-date-dialog"><h3>주소 찾기</h3><input class="address-demo-query" placeholder="도로명 또는 건물명을 입력하세요"><div class="payment-detail-panel">추후 카카오 주소 API 연동 예정입니다.</div><div class="checkout-date-actions"><button type="button" class="cancel">닫기</button><button type="button" class="confirm">예시 주소 적용</button></div></div>';document.body.appendChild(modal);
      modal.querySelector('.cancel').onclick=()=>modal.remove();modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});modal.querySelector('.confirm').onclick=()=>{if(postal)postal.value='03154';if(inputs?.[1])inputs[1].value='서울특별시 종로구 종로 1';if(inputs?.[2])inputs[2].focus();modal.remove();toast('예시 주소가 입력되었습니다.');};modal.querySelector('input').focus();
    }));

    const payButton=document.querySelector('.summary-card a.primary.full');const agree=document.querySelector('.summary-card .agree input');
    payButton?.addEventListener('click',e=>{if(!agree?.checked){e.preventDefault();toast('결제 동의에 체크해 주세요.');agree?.focus();}});
  }

  // Buttons that are intentionally demos should still visibly respond.
  document.querySelectorAll('button').forEach(btn=>{
    if(btn.dataset.interactionAudited)return;btn.dataset.interactionAudited='1';
    btn.addEventListener('pointerdown',()=>btn.style.transform='scale(.98)');btn.addEventListener('pointerup',()=>btn.style.transform='');btn.addEventListener('pointerleave',()=>btn.style.transform='');
  });
});



// Category page filters, pagination, and dynamic hero.
document.addEventListener('DOMContentLoaded',()=>{
  const page=document.querySelector('.shop-layout');
  if(page){
    const cards=[...page.querySelectorAll('.shop-grid .shop-card')];
    const cats=[...page.querySelectorAll('.filter-panel a[data-category]')];
    const prices=[...page.querySelectorAll('.filter-panel input[data-price]')];
    const pager=[...page.querySelectorAll('.catalog-pagination button')];
    const count=page.querySelector('.catalog-count strong');
    let category='all', current=1; const perPage=8;
    const priceOK=(card)=>{const checked=prices.filter(x=>x.checked).map(x=>x.dataset.price);if(!checked.length)return true;const p=Number(card.dataset.price||0);return checked.some(v=>v==='low'?p<=50000:v==='mid'?(p>50000&&p<100000):p>=100000)};
    const render=()=>{const matched=cards.filter(c=>(category==='all'||c.dataset.category===category)&&priceOK(c));const pages=Math.max(1,Math.ceil(matched.length/perPage));current=Math.min(current,pages);cards.forEach(c=>c.hidden=true);matched.slice((current-1)*perPage,current*perPage).forEach(c=>c.hidden=false);if(count)count.textContent=`${matched.length}개`;pager.forEach(b=>{const n=Number(b.dataset.page);b.hidden=Number.isFinite(n)&&n>pages;b.classList.toggle('active',n===current)});};
    cats.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();category=a.dataset.category;current=1;cats.forEach(x=>x.classList.toggle('active',x===a));render();}));
    prices.forEach(x=>x.addEventListener('change',()=>{current=1;render();}));
    pager.forEach(b=>b.addEventListener('click',()=>{const max=Math.max(1,Math.ceil(cards.filter(c=>(category==='all'||c.dataset.category===category)&&priceOK(c)).length/perPage));if(b.dataset.page==='prev')current=Math.max(1,current-1);else if(b.dataset.page==='next')current=Math.min(max,current+1);else current=Number(b.dataset.page);render();document.querySelector('.catalog-toolbar')?.scrollIntoView({behavior:'smooth',block:'start'});}));
    render();
  }
  const hero=document.querySelector('#categoryHero');
  if(hero){const q=new URLSearchParams(location.search);const theme=q.get('theme');const h=hero.querySelector('h1'),p=hero.querySelector('p'),s=hero.querySelector('span');if(theme==='today'){hero.classList.add('theme-today');if(p)p.textContent='FAST DELIVERY';if(h)h.textContent='오늘도착+';if(s)s.textContent='오늘 주문하고 빠르게 마음을 전하세요.';}else if(theme==='season'||theme==='trend'){hero.classList.add('theme-season');if(p)p.textContent='SEASON FLOWERS';if(h)h.textContent='시즌상품';if(s)s.textContent='지금 가장 아름다운 계절의 꽃을 만나보세요.';}}

  const diyButtons=[...document.querySelectorAll('[data-diy-filter]')];
  if(diyButtons.length){const diyCards=[...document.querySelectorAll('[data-diy-category]')];diyButtons.forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.diyFilter;diyButtons.forEach(x=>x.classList.toggle('active',x===btn));diyCards.forEach(c=>c.hidden=key!=='all'&&c.dataset.diyCategory!==key);}));}
});

// Final unified wishlist glyph state.
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.home-wish, .wish, [data-wish]').forEach(button=>{
    const paint=()=>{
      const active=button.classList.contains('is-active');
      if(!button.querySelector('svg')) button.textContent=active?'♥':'♡';
    };
    paint();
    const observer=new MutationObserver(paint);
    observer.observe(button,{attributes:true,attributeFilter:['class']});
  });
});


// 2026-07-21 definitive global UI normalization.
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.sub-header').forEach(header=>{
    header.classList.remove('is-scrolled');
    header.style.position='relative';
    const brand=header.querySelector('.brand-text');
    if(brand){brand.style.display='inline-block';brand.style.opacity='1';brand.style.visibility='visible';}
  });
  // Keep one wishlist glyph and preserve selected state across pages.
  document.querySelectorAll('.home-wish,.wish,[data-wish]').forEach((button,index)=>{
    button.replaceChildren();
    button.type='button';
    const card=button.closest('.home-product-card,.product-card,.shop-card,.product-detail,.상품카드');
    const title=card?.querySelector('h3,h1')?.textContent?.trim()||`상품-${index+1}`;
    const key='hanyang-wishlist';
    const read=()=>{try{return new Set(JSON.parse(localStorage.getItem(key)||'[]'));}catch(e){return new Set();}};
    const sync=()=>{const on=read().has(title);button.classList.toggle('is-active',on);button.setAttribute('aria-pressed',String(on));};
    sync();
  });
});
window.addEventListener('scroll',()=>document.querySelectorAll('.sub-header').forEach(h=>h.classList.remove('is-scrolled')),{passive:true});


// Final deterministic wishlist behavior across all product lists and detail pages.
document.addEventListener('DOMContentLoaded',()=>{
  const storageKey='hanyang-wishlist';
  const read=()=>{try{return new Set(JSON.parse(localStorage.getItem(storageKey)||'[]'));}catch(_){return new Set();}};
  const write=set=>localStorage.setItem(storageKey,JSON.stringify([...set]));
  document.querySelectorAll('.home-wish,.wish,[data-wish]').forEach((button,index)=>{
    button.replaceChildren();
    button.type='button';
    button.insertAdjacentHTML('afterbegin','<svg class="wish-heart" viewBox="0 0 24 24" aria-hidden="true"><path class="heart-outline" d="M12 20.2 3.6 12.4C1 10 1 6 3.6 3.6 6 1.3 9.7 1.6 12 4.2 14.3 1.6 18 1.3 20.4 3.6 23 6 23 10 20.4 12.4Z"/><path class="heart-fill" d="M12 20.2 3.6 12.4C1 10 1 6 3.6 3.6 6 1.3 9.7 1.6 12 4.2 14.3 1.6 18 1.3 20.4 3.6 23 6 23 10 20.4 12.4Z"/></svg>');
    const card=button.closest('.home-product-card,.product-card,.shop-card,.product-detail,.상품카드')||button.parentElement;
    const title=card?.querySelector('h1,h2,h3')?.textContent?.trim()||button.dataset.wish||`상품-${index+1}`;
    const sync=()=>{
      const on=read().has(title);
      button.classList.toggle('is-active',on);
      button.classList.toggle('is-wished',on);
      button.setAttribute('aria-pressed',String(on));
      button.setAttribute('title',on?'찜 해제':'찜하기');
    };
    if(!button.dataset.finalWishBound){
      button.dataset.finalWishBound='1';
      button.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        const set=read();set.has(title)?set.delete(title):set.add(title);write(set);sync();
        window.__hanyangWishToast?.(set.has(title)?'찜한 상품에 저장했습니다.':'찜을 해제했습니다.');
      });
    }
    sync();
  });
});


/* ===== 찜하기 동작 통일 ===== */
(function(){
  const KEY = "한양꽃집-찜-버튼";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch(e) {}

  function keyOf(btn, index){
    return btn.dataset.wish || btn.dataset.productId || btn.getAttribute("aria-label") || (location.pathname + ":" + index);
  }
  function apply(btn, on){
    btn.classList.toggle("선택", on);
    btn.classList.toggle("selected", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.title = on ? "찜 해제" : "찜하기";
  }

  function init(){
    const buttons = [...document.querySelectorAll(".찜,[data-wish],.wishlist-btn,.wish-btn,.product-wish,.상품찜,.상세찜버튼")];
    buttons.forEach((btn, i)=>{
      const key = keyOf(btn, i);
      if (saved[key] === true) apply(btn, true);
      if (!btn.dataset.wishUnified){
        btn.dataset.wishUnified = "1";
        btn.addEventListener("click", function(e){
          e.preventDefault();
          e.stopPropagation();
          const now = !(btn.classList.contains("선택") || btn.classList.contains("selected"));
          apply(btn, now);
          saved[key] = now;
          localStorage.setItem(KEY, JSON.stringify(saved));
        });
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  const observer = new MutationObserver(init);
  observer.observe(document.documentElement, {childList:true, subtree:true});
})();
