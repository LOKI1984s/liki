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

/* ================= 리치텍스트 툴바 (요약설명/공지/이벤트/배송 안내 등 .rte-toolbar + .rte-body) =================
   textarea라서 실제 굵게/기울임 렌더링은 안 되지만(브라우저 제약), 선택한 텍스트를
   마크다운 표기(**굵게**, _기울임_, <u>밑줄</u>)로 감싸주는 방식으로 실제 동작하게 함. */
function rteWrapSelection(textarea, before, after){
  if(after===undefined) after = before;
  const start = textarea.selectionStart, end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end);
  textarea.setRangeText(before + selected + after, start, end, 'select');
  if(selected){
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + selected.length;
  } else {
    textarea.selectionStart = textarea.selectionEnd = start + before.length;
  }
  textarea.focus();
}
function rteInsertAtCursor(textarea, text){
  const start = textarea.selectionStart, end = textarea.selectionEnd;
  textarea.setRangeText(text, start, end, 'end');
  textarea.focus();
}
function rtePrefixLines(textarea, prefix){
  const start = textarea.selectionStart, end = textarea.selectionEnd;
  const val = textarea.value;
  const lineStart = val.lastIndexOf('\n', start-1) + 1;
  let lineEnd = val.indexOf('\n', end);
  if(lineEnd === -1) lineEnd = val.length;
  const block = val.slice(lineStart, lineEnd);
  const newBlock = block.split('\n').map(l => l.startsWith(prefix) ? l : prefix + l).join('\n');
  textarea.setRangeText(newBlock, lineStart, lineEnd, 'end');
  textarea.focus();
}
function initRteToolbars(){
  document.querySelectorAll('.rte-toolbar').forEach(toolbar=>{
    const body = toolbar.parentElement.querySelector('.rte-body') || toolbar.nextElementSibling;
    if(!body || body.dataset.rteReady) { /* 계속 진행, 버튼별로 개별 가드 */ }
    toolbar.querySelectorAll('.rte-btn').forEach(btn=>{
      if(btn.dataset.rteBound) return;
      btn.dataset.rteBound = '1';
      const label = btn.textContent.trim();
      const svgPath = btn.querySelector('path')?.getAttribute('d') || '';
      btn.addEventListener('click', e=>{
        e.preventDefault();
        if(label === 'B'){ rteWrapSelection(body, '**'); }
        else if(label === 'I'){ rteWrapSelection(body, '_'); }
        else if(label === 'U'){ rteWrapSelection(body, '<u>', '</u>'); }
        else if(label.startsWith('T')){ rtePrefixLines(body, '## '); }
        else if(svgPath.startsWith('M4 6h16')){ rtePrefixLines(body, '- '); }
        else if(svgPath.startsWith('M13 4h3a2')){
          const url = prompt('삽입할 이미지 URL을 입력해주세요.');
          if(url) rteInsertAtCursor(body, `![이미지](${url})`);
        }
        else if(svgPath.startsWith('M10 13a5')){
          const start = body.selectionStart, end = body.selectionEnd;
          const selected = body.value.slice(start, end);
          const url = prompt('연결할 링크 URL을 입력해주세요.');
          if(url) rteWrapSelection(body, '[', `](${url})`);
        }
        showToast('서식이 적용되었습니다');
      });
    });
  });
}
document.addEventListener('DOMContentLoaded', initRteToolbars);
