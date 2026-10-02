/*
 * 사업 모델 페이지 팝업 — 프로토타입 미리보기 · 영상 자료
 * data.js의 models[].showcase 설정을 읽어 models[].demo 키로 ZIDemos에 등록한다.
 *   kind: "proto" → 탭 + 브라우저 프레임(iframe, 폼 제출 차단)
 *   kind: "video" → 탭 + 영상 + 확보 서류 체크리스트
 */
(() => {
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const X = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>`;
  const EXT = `<svg class="arr" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5 4h7v7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;

  function make(key, m) {
    const sc = m.showcase;
    let dlg, opener = null;

    const body = () => {
      if (sc.kind === "proto") return `
        <div class="tabs" role="tablist">${sc.pages.map((pg, i) => `
          <button type="button" class="tab" role="tab" data-i="${i}" aria-selected="${i === 0}">${esc(pg.label)}</button>`).join("")}
        </div>
        <div class="proto-frame">
          <div class="proto-bar">
            <span class="proto-dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="proto-url mono"></span>
            <a class="proto-open" target="_blank" rel="noopener">새 창 ${EXT}</a>
          </div>
          <iframe class="proto-iframe" title="${esc(m.title)} 프로토타입" loading="lazy" sandbox="allow-scripts allow-same-origin"></iframe>
        </div>
        <p class="sim-info">${esc(sc.note || "")}</p>`;
      return `
        <div class="tabs" role="tablist">${sc.videos.map((v, i) => `
          <button type="button" class="tab" role="tab" data-i="${i}" aria-selected="${i === 0}">${esc(v.label)}</button>`).join("")}
        </div>
        <div class="vid-wrap"><video class="vid" controls playsinline preload="metadata"></video></div>
        <p class="sim-info vid-cap"></p>
        ${sc.checklist?.length ? `
        <div class="check">
          <p class="panel-head">${esc(sc.checklistTitle || "CHECKLIST")}</p>
          <ul>${sc.checklist.map((c) => {
            const it = typeof c === "string" ? { label: c } : c;
            return it.doc != null && sc.docs?.[it.doc]
              ? `<li><button type="button" class="check-doc" data-doc="${it.doc}"><i aria-hidden="true"></i>${esc(it.label)}<span class="check-open">서류 보기</span></button></li>`
              : `<li><i aria-hidden="true"></i>${esc(it.label)}</li>`;
          }).join("")}</ul>
        </div>` : ""}
        ${sc.docs?.length ? `
        <div class="doc-view" hidden>
          <div class="doc-bar">
            <button type="button" class="btn btn-sm-o" data-doc-back>목록으로</button>
            <div class="doc-title"><b></b><span></span></div>
            <div class="doc-pager">
              <button type="button" class="icon-btn" data-doc-prev aria-label="이전 쪽"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>
              <span class="doc-count mono"></span>
              <button type="button" class="icon-btn" data-doc-next aria-label="다음 쪽"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>
            </div>
            <button type="button" class="icon-btn doc-close" data-close aria-label="닫기">${X}</button>
          </div>
          <div class="doc-stage"><img alt="" /></div>
          <p class="doc-note">${esc(sc.docNote || "")}</p>
        </div>` : ""}`;
    };

    function show(i) {
      dlg.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(+t.dataset.i === i)));
      if (sc.kind === "proto") {
        const src = sc.base + sc.pages[i].path;
        dlg.querySelector(".proto-iframe").src = encodeURI(src);
        dlg.querySelector(".proto-url").textContent = sc.pages[i].path;
        dlg.querySelector(".proto-open").href = encodeURI(src);
      } else {
        const v = sc.videos[i], vid = dlg.querySelector(".vid");
        vid.pause();
        vid.poster = v.poster || "";
        vid.src = v.src;
        dlg.querySelector(".vid-cap").textContent = v.caption || "";
      }
    }

    let docI = 0, pageI = 0;
    const docView = () => dlg.querySelector(".doc-view");
    function showDoc(i, p = 0) {
      const d = sc.docs[i];
      docI = i; pageI = Math.max(0, Math.min(p, d.pages.length - 1));
      const v = docView();
      v.querySelector(".doc-title b").textContent = d.title;
      v.querySelector(".doc-title span").textContent = d.sub || "";
      const img = v.querySelector(".doc-stage img");
      img.src = d.pages[pageI];
      img.alt = `${d.title} ${pageI + 1}쪽`;
      v.querySelector(".doc-count").textContent = `${pageI + 1} / ${d.pages.length}`;
      v.querySelector("[data-doc-prev]").disabled = pageI === 0;
      v.querySelector("[data-doc-next]").disabled = pageI === d.pages.length - 1;
      v.querySelector(".doc-pager").hidden = d.pages.length < 2;
      v.querySelector(".doc-stage").scrollTop = 0;
      dlg.querySelector(".vid")?.pause();
      v.hidden = false;
    }
    const hideDoc = () => { const v = docView(); if (v) v.hidden = true; };

    function build() {
      dlg = document.createElement("dialog");
      dlg.className = "modal";
      dlg.setAttribute("aria-labelledby", `${key}-title`);
      dlg.innerHTML = `
        <header class="modal-head">
          <div>
            <p class="eyebrow"><span class="mono">${esc(sc.kind === "proto" ? "PROTOTYPE" : "MEDIA")}</span>${esc(m.field)}</p>
            <h2 id="${key}-title">${esc(m.title)}</h2>
            <p class="modal-sub">${esc(sc.sub || "")}</p>
          </div>
          <button type="button" class="icon-btn" data-close aria-label="닫기">${X}</button>
        </header>
        <div class="modal-body">${body()}</div>
        <footer class="modal-foot">
          <span class="muted small">${esc(sc.foot || "")}</span>
          <button type="button" class="btn" data-close>닫기</button>
        </footer>`;
      document.body.appendChild(dlg);
      // iframe 안에 포커스가 있어도 ESC로 닫히게
      dlg.querySelector(".proto-iframe")?.addEventListener("load", (e) => {
        try { e.target.contentWindow.addEventListener("keydown", (k) => { if (k.key === "Escape") close(); }); } catch {}
      });
      dlg.addEventListener("click", (e) => {
        if (e.target === dlg || e.target.closest("[data-close]")) close();
        const t = e.target.closest(".tab");
        if (t) show(+t.dataset.i);
        const dc = e.target.closest("[data-doc]");
        if (dc) showDoc(+dc.dataset.doc);
        if (e.target.closest("[data-doc-back]")) hideDoc();
        if (e.target.closest("[data-doc-prev]")) showDoc(docI, pageI - 1);
        if (e.target.closest("[data-doc-next]")) showDoc(docI, pageI + 1);
      });
      dlg.addEventListener("cancel", (e) => {
        if (docView() && !docView().hidden) { e.preventDefault(); hideDoc(); }
      });
      dlg.addEventListener("keydown", (e) => {
        if (!docView() || docView().hidden) return;
        if (e.key === "ArrowLeft") showDoc(docI, pageI - 1);
        if (e.key === "ArrowRight") showDoc(docI, pageI + 1);
      });
      dlg.addEventListener("close", () => {
        hideDoc();
        dlg.querySelector(".vid")?.pause();
        document.documentElement.classList.remove("modal-open");
        opener?.focus?.();
      });
    }

    function open(from) {
      if (!dlg) { build(); show(0); }
      opener = from || null;
      dlg.showModal();
      document.documentElement.classList.add("modal-open");
      // 카드의 서류 버튼으로 열면 해당 서류를 바로 보여준다
      const di = from?.dataset?.doc;
      if (di != null && sc.docs?.[+di]) showDoc(+di); else hideDoc();
    }
    function close() { if (dlg?.open) dlg.close(); }
    return { open, close };
  }

  const reg = {};
  (typeof PORTFOLIO !== "undefined" ? PORTFOLIO.models : []).forEach((m) => { if (m.demo && m.showcase) reg[m.demo] = make(m.demo, m); });
  window.ZIDemos = Object.assign(window.ZIDemos || {}, reg);
})();
