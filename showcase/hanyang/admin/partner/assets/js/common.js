/* =========================================================
   common.js
   전 페이지 공통 로직: 헤더 알림 패널, 모달, 드롭다운 메뉴,
   토스트, 가격 포맷터, 사이드바 활성화
   ========================================================= */

/* ================= 사이드바 대분류 접기/펼치기 ================= */
function toggleNavGroup(el){
  const group = el.closest('.nav-group');
  if(group) group.classList.toggle('collapsed');
}

/* ================= 헤더 알림 패널 / 각종 드롭다운 닫기 ================= */
function closeAllMenus(){
  document.querySelectorAll('.dropdown-menu.open').forEach(m=>m.classList.remove('open'));
  document.querySelectorAll('.gh-notif-panel.open').forEach(m=>m.classList.remove('open'));
  document.querySelectorAll('.expose-dropdown.open').forEach(m=>m.classList.remove('open'));
  document.querySelectorAll('.split-menu.open').forEach(m=>m.classList.remove('open'));
  document.querySelectorAll('.plan-dropdown.open').forEach(m=>m.classList.remove('open'));
}
document.addEventListener('click', closeAllMenus);

function toggleNotifPanel(e, key){
  e.stopPropagation();
  const panel = document.getElementById('panel-'+key);
  if(!panel) return;
  const wasOpen = panel.classList.contains('open');
  closeAllMenus();
  if(!wasOpen) panel.classList.add('open');
}

/* ================= 모달 공통 ================= */
function closeModal(id){
  const el = document.getElementById(id);
  if(el) el.classList.remove('open');
}

/* ================= 행 "..." 드롭다운 메뉴 (뷰포트 잘림 방지: position:fixed 좌표 계산) ================= */
function toggleRowMenu(e, id){
  e.stopPropagation();
  const menu = document.getElementById(`menu-${id}`);
  if(!menu) return;
  const wasOpen = menu.classList.contains('open');
  closeAllMenus();
  if(wasOpen) return;
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  menu.classList.add('open');
  const menuWidth = menu.offsetWidth || 150;
  const menuHeight = menu.offsetHeight || 140;
  let left = rect.right - menuWidth;
  let top = rect.bottom + 6;
  if(left < 8) left = 8;
  if(top + menuHeight > window.innerHeight - 8) top = rect.top - menuHeight - 6;
  menu.style.left = left + 'px';
  menu.style.top = top + 'px';
}

/* ================= 가격 입력 포맷터 (천단위 콤마) ================= */
function formatPriceInput(el){
  let v = el.value.replace(/[^0-9]/g,'');
  el.value = v ? Number(v).toLocaleString() : '';
}

/* ================= 전화번호 입력 포맷터 ================= */
function formatPhone(el){
  let v = el.value.replace(/[^0-9]/g,'').slice(0,11);
  if(v.length > 3 && v.length <= 7) v = v.slice(0,3) + '-' + v.slice(3);
  else if(v.length > 7) v = v.slice(0,3) + '-' + v.slice(3,7) + '-' + v.slice(7);
  el.value = v;
}

/* ================= 토스트 ================= */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  const msgEl = document.getElementById('toastMsg');
  if(msgEl) msgEl.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2400);
}
