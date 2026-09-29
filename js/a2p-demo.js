/*
 * 국제 A2P 양방향 문자 — 인터랙티브 구조도 (개발 페이지 팝업)
 * 고객 웹 발송 → 한국 발신 → 미국 수신·재발신(우회) → Tier1 GSM 허브 → 국내 1차 수신 통신사 → MNO → 단말
 * 수신자 답장(MO)은 같은 길을 거꾸로 돌아와 고객 웹 수신함에 표시된다.
 * 회사명은 넣지 않고 역할 이름만 쓴다. 아이콘: Lucide (ISC License)
 */
(() => {
  const ICONS = {"monitor": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\" /> <line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\" /> <line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\" />", "server": "<rect width=\"20\" height=\"8\" x=\"2\" y=\"2\" rx=\"2\" ry=\"2\" /> <rect width=\"20\" height=\"8\" x=\"2\" y=\"14\" rx=\"2\" ry=\"2\" /> <line x1=\"6\" x2=\"6.01\" y1=\"6\" y2=\"6\" /> <line x1=\"6\" x2=\"6.01\" y1=\"18\" y2=\"18\" />", "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /> <path d=\"M2 12h20\" />", "network": "<rect x=\"16\" y=\"16\" width=\"6\" height=\"6\" rx=\"1\" /> <rect x=\"2\" y=\"16\" width=\"6\" height=\"6\" rx=\"1\" /> <rect x=\"9\" y=\"2\" width=\"6\" height=\"6\" rx=\"1\" /> <path d=\"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3\" /> <path d=\"M12 12V8\" />", "antenna": "<path d=\"M2 12 7 2\" /> <path d=\"m7 12 5-10\" /> <path d=\"m12 12 5-10\" /> <path d=\"m17 12 5-10\" /> <path d=\"M4.5 7h15\" /> <path d=\"M12 16v6\" />", "radio-tower": "<path d=\"M4.9 16.1C1 12.2 1 5.8 4.9 1.9\" /> <path d=\"M7.8 4.7a6.14 6.14 0 0 0-.8 7.5\" /> <circle cx=\"12\" cy=\"9\" r=\"2\" /> <path d=\"M16.2 4.8c2 2 2.26 5.11.8 7.47\" /> <path d=\"M19.1 1.9a9.96 9.96 0 0 1 0 14.1\" /> <path d=\"M9.5 18h5\" /> <path d=\"m8 22 4-11 4 11\" />", "smartphone": "<rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\" ry=\"2\" /> <path d=\"M12 18h.01\" />", "send": "<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\" /> <path d=\"m21.854 2.147-10.94 10.939\" />", "message-square-reply": "<path d=\"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z\" /> <path d=\"m10 8-3 3 3 3\" /> <path d=\"M17 14v-1a2 2 0 0 0-2-2H7\" />", "earth": "<path d=\"M21.54 15H17a2 2 0 0 0-2 2v4.54\" /> <path d=\"M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17\" /> <path d=\"M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05\" /> <circle cx=\"12\" cy=\"12\" r=\"10\" />"};
  const SVGNS = "http://www.w3.org/2000/svg";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- 구조 ---------- */
  const ORDER = ["web", "platform", "usIn", "usOut", "hub", "krGate", "mno", "phone"];
  const NODES = {
    web:      { label: "고객 웹", sub: "발송 · 수신함", icon: "monitor", desc: "고객이 웹에서 메시지를 쓰고 발송을 누릅니다. 수신자가 답장하면 같은 화면 수신함에 들어옵니다." },
    platform: { label: "A2P 플랫폼", sub: "KR · 발신", icon: "server", desc: "한국에 있는 발송 플랫폼입니다. 대표번호 확인, 과금, 발송 건 번호 부여를 하고 국제망으로 내보냅니다. 답장이 오면 원래 발송 건과 짝지어 고객에게 돌려줍니다." },
    usIn:     { label: "US 게이트웨이", sub: "수신", icon: "globe", desc: "미국 게이트웨이가 한국에서 보낸 메시지를 받습니다. 여기서부터 우회 구간입니다." },
    usOut:    { label: "US 게이트웨이", sub: "재발신", icon: "send", desc: "미국에서 국제 사업자망으로 다시 발신합니다. 수신자 쪽에서는 국제발신 메시지가 됩니다." },
    hub:      { label: "Tier1 GSM 허브", sub: "IPX · SS7", icon: "network", desc: "전 세계 통신사와 직접 연결된 사업자망입니다. 중간 업체 없이 국내망으로 들어가서 도달률이 높고, 통신사가 만든 진짜 결과(DLR)와 답장(MO)을 주고받을 수 있습니다." },
    krGate:   { label: "1차 수신 통신사", sub: "국내 국제관문", icon: "antenna", desc: "국제 메시지를 가장 먼저 받는 국내 사업자입니다. 발신번호가 '통신사 코드 + 대표번호'로 붙어서, 국제발신이지만 한국 대표번호로 표시됩니다." },
    mno:      { label: "국내 MNO", sub: "SMSC", icon: "radio-tower", desc: "이동통신사 문자센터가 단말로 전달합니다. 수신자가 답장하면 여기서 MO로 받아 거꾸로 올려보냅니다." },
    phone:    { label: "수신자", sub: "단말", icon: "smartphone", desc: "메시지를 받고 그 번호로 바로 답장할 수 있습니다. 일반 국제문자와 달리 답장이 고객에게 돌아갑니다." },
  };
  const BANDS = [
    { id: "kr1", label: "KOREA", sub: "발신", from: "web", to: "platform" },
    { id: "us", label: "USA", sub: "우회 구간", from: "usIn", to: "usOut" },
    { id: "gl", label: "GLOBAL", sub: "Tier1 IPX", from: "hub", to: "hub" },
    { id: "kr2", label: "KOREA", sub: "수신", from: "krGate", to: "phone" },
  ];
  const LAYOUT = {
    h: { w: 1200, h: 290, axis: 160, step: [60, 205, 365, 505, 670, 840, 985, 1135], lane: 17 },
    v: { w: 420, h: 800, axis: 110, step: [48, 136, 250, 334, 448, 562, 646, 730], lane: 17 },
  };
  const MSG = {
    sms: { name: "SMS", text: "[Zero∞] 주문이 접수됐어요. 궁금한 점은 이 번호로 답장 주세요." },
    lms: { name: "LMS", text: "[Zero∞] 주문 안내\n주문번호 A-20931\n상품: 무선 이어폰 외 1건\n결제: 49,800원\n배송 예정: 내일 도착\n변경·취소는 이 번호로 답장 주세요." },
    mms: { name: "MMS", text: "[Zero∞] 이번 주 신상품 안내예요. 궁금한 점은 답장 주세요." },
  };
  const REPLIES = ["네 확인했어요", "배송 언제 와요?", "감사합니다!", "주소 변경 가능할까요?"];
  const CAPTION = {
    mt: { web: "① 고객이 웹에서 발송", platform: "② 한국 플랫폼에서 발신 · 대표번호 확인 · 과금", usIn: "③ 미국 게이트웨이 수신", usOut: "④ 미국에서 재발신 · 우회 구간", hub: "⑤ Tier1 GSM 허브 · 사업자망으로 국내 진입", krGate: "⑥ 1차 수신 통신사 · 통신사 코드 + 대표번호 표시", mno: "⑦ 국내 MNO 문자센터 전달", phone: "⑧ 수신자 단말 도착" },
    dlr: { platform: "전달 결과(DLR) 회신 · 발송 건 상태 갱신" },
    mo: { phone: "↩ 수신자가 같은 번호로 답장", mno: "↩ MNO가 답장(MO) 수신", krGate: "↩ 1차 수신 통신사 경유", hub: "↩ Tier1 허브 · 국제망으로 회신", usOut: "↩ 미국 게이트웨이 경유", usIn: "↩ 미국 → 한국", platform: "↩ 플랫폼이 원래 발송 건과 매칭", web: "↩ 고객 웹 수신함에 답장 도착" },
  };
  const SPEED = 430;

  /* ---------- 상태 ---------- */
  let dlg, stage, svg, gPk, capEl, logEl, chatEl, sendBtn, autoBtn, mode, L;
  let packets = [], ambientT = 0, raf = 0, last = 0, running = false, busy = false, auto = true, autoT = 0.8, seq = 0, type = "sms";
  const nodeEls = {};

  const el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  // lane: -1 = MT(발신) 차선, +1 = MO(답장) 차선, 0 = 노드 중심
  const pt = (id, lane = 0) => {
    const i = ORDER.indexOf(id), s = L.step[i], o = lane * L.lane;
    return mode === "h" ? [s, L.axis + o] : [L.axis + o, s];
  };

  /* ---------- 모달 ---------- */
  function build() {
    dlg = document.createElement("dialog");
    dlg.className = "modal";
    dlg.setAttribute("aria-labelledby", "a2p-title");
    dlg.innerHTML = `
      <header class="modal-head">
        <div>
          <p class="eyebrow"><span class="mono">SYSTEM</span>Interactive</p>
          <h2 id="a2p-title">국제 A2P 양방향 문자</h2>
          <p class="modal-sub">국제망으로 보내고, 한국 대표번호로 받고, 답장까지 돌아오는 구조</p>
        </div>
        <button type="button" class="icon-btn" data-close aria-label="닫기">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </header>
      <div class="modal-body">
        <nav class="tabs" role="tablist" aria-label="서비스">
          <button type="button" role="tab" aria-selected="true" class="tab">A2P 양방향</button>
        </nav>
        <div class="sim-stage"></div>
        <p class="a2p-cap mono" aria-live="polite"></p>
        <div class="a2p-panels">
          <section class="a2p-console" aria-label="고객 웹 발송 화면">
            <div class="panel-head"><span class="mono">WEB CONSOLE</span></div>
            <dl class="a2p-form">
              <dt>발신번호</dt><dd><b>대표번호</b> 1588-0000</dd>
              <dt>유형</dt>
              <dd><div class="seg" role="radiogroup" aria-label="메시지 유형">
                <button type="button" role="radio" aria-checked="true" data-type="sms">SMS</button>
                <button type="button" role="radio" aria-checked="false" data-type="lms">LMS</button>
                <button type="button" role="radio" aria-checked="false" data-type="mms">MMS</button>
              </div></dd>
            </dl>
            <p class="a2p-note"></p>
            <div class="a2p-actions">
              <button type="button" class="btn btn-primary btn-sm-o" data-act="send">발송</button>
              <button type="button" class="btn btn-sm-o" data-act="auto" aria-pressed="true">자동 재생 켜짐</button>
            </div>
            <ol class="a2p-log" aria-label="발송 이력"></ol>
          </section>
          <section class="a2p-phone" aria-label="수신자 화면">
            <div class="phone">
              <div class="phone-head">
                <span class="ph-code">통신사 코드</span><b>+ 1588-0000</b>
              </div>
              <div class="phone-chat"></div>
            </div>
          </section>
        </div>
        <p class="sim-info"></p>
      </div>
      <footer class="modal-foot">
        <div class="sim-legend">
          <span><i class="dot lime"></i>발신 (MT)</span>
          <span><i class="dot mint"></i>전달 결과 (DLR)</span>
          <span><i class="dot amber"></i>답장 (MO)</span>
        </div>
        <button type="button" class="btn" data-close>닫기</button>
      </footer>`;
    document.body.appendChild(dlg);
    stage = dlg.querySelector(".sim-stage");
    capEl = dlg.querySelector(".a2p-cap");
    logEl = dlg.querySelector(".a2p-log");
    chatEl = dlg.querySelector(".phone-chat");
    sendBtn = dlg.querySelector('[data-act="send"]');
    autoBtn = dlg.querySelector('[data-act="auto"]');

    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest("[data-close]")) return close();
      const t = e.target.closest("[data-type]");
      if (t) { setType(t.dataset.type); if (auto) toggleAuto(); }
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (act === "send") startConversation();
      if (act === "auto") toggleAuto();
    });
    dlg.addEventListener("close", stop);
    new ResizeObserver(() => { const m = stage.clientWidth < 640 ? "v" : "h"; if (m !== mode) draw(m); }).observe(stage);
    setType("sms");
  }

  function toggleAuto() {
    auto = !auto; autoT = 1.2;
    autoBtn.setAttribute("aria-pressed", String(auto));
    autoBtn.textContent = auto ? "자동 재생 켜짐" : "자동 재생 꺼짐";
  }

  function setType(t) {
    type = t;
    dlg.querySelectorAll("[data-type]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.type === t)));
    // 국내 문자 기준 바이트: 한글 2byte, 영문·숫자 1byte
    const bytes = [...MSG[t].text].reduce((n, ch) => n + (ch.charCodeAt(0) > 0x7f ? 2 : 1), 0);
    dlg.querySelector(".a2p-note").innerHTML =
      t === "sms" ? `단문 1건 · 대표번호로 표시`
      : t === "lms" ? `장문 1건으로 도착 <span class="muted">· 일반 국제망은 90byte씩 ${Math.ceil(bytes / 90)}건으로 쪼개져 도착</span>`
      : `이미지 + 문구 1건으로 도착 <span class="muted">· 일반 국제망은 MMS 미지원</span>`;
  }

  function draw(m) {
    mode = m; L = LAYOUT[m];
    packets.forEach((p) => p.g.remove()); packets = [];
    busy = false; sendBtn && (sendBtn.disabled = false);
    stage.innerHTML = "";
    svg = el("svg", { viewBox: `0 0 ${L.w} ${L.h}`, class: `sim-svg a2p ${m}`, role: "img", "aria-label": "국제 A2P 양방향 문자 흐름도" }, stage);

    // 지역 구간
    const half = (i) => (L.step[i + 1] - L.step[i]) / 2;
    BANDS.forEach((b, bi) => {
      const i0 = ORDER.indexOf(b.from), i1 = ORDER.indexOf(b.to);
      const a = i0 === 0 ? 0 : L.step[i0] - half(i0 - 1);
      const z = i1 === ORDER.length - 1 ? (m === "h" ? L.w : L.h) : L.step[i1] + half(i1);
      const g = el("g", { class: `band b-${b.id}` }, svg);
      if (m === "h") {
        el("rect", { x: a, y: 0, width: z - a, height: L.h, class: "band-bg" }, g);
        if (bi) el("line", { x1: a, y1: 14, x2: a, y2: L.h - 14, class: "band-edge" }, g);
        const t = el("text", { x: a + 14, y: 28, class: "band-label" }, g); t.textContent = b.label;
        const s = el("text", { x: a + 14, y: 44, class: "band-sub" }, g); s.textContent = b.sub;
      } else {
        el("rect", { x: 0, y: a, width: L.w, height: z - a, class: "band-bg" }, g);
        if (bi) el("line", { x1: 12, y1: a, x2: L.w - 12, y2: a, class: "band-edge" }, g);
        const t = el("text", { x: L.w - 14, y: a + 24, class: "band-label", "text-anchor": "end" }, g); t.textContent = b.label;
        const s = el("text", { x: L.w - 14, y: a + 40, class: "band-sub", "text-anchor": "end" }, g); s.textContent = b.sub;
      }
    });

    // 차선: 위(왼쪽) MT, 아래(오른쪽) MO
    const lanePts = (lane) => ORDER.map((id) => pt(id, lane).join(",")).join(" ");
    el("polyline", { points: lanePts(-1), class: "track" }, svg);
    el("polyline", { points: lanePts(1), class: "track" }, svg);
    el("polyline", { points: lanePts(-1), class: "flow" }, svg);
    el("polyline", { points: ORDER.slice().reverse().map((id) => pt(id, 1).join(",")).join(" "), class: "flow mo" }, svg);
    // 차선 이름
    const [mx, my] = pt("platform", -1), [ox, oy] = pt("platform", 1);
    const mtT = el("text", m === "h" ? { x: (mx + pt("usIn")[0]) / 2, y: my - 8, class: "lane-tag", "text-anchor": "middle" } : { x: mx - 8, y: (my + pt("usIn")[1]) / 2, class: "lane-tag", "text-anchor": "end" }, svg);
    mtT.textContent = m === "h" ? "MT 발신 →" : "MT ↓";
    const moT = el("text", m === "h" ? { x: (ox + pt("usIn")[0]) / 2, y: oy + 18, class: "lane-tag mo", "text-anchor": "middle" } : { x: ox + 8, y: (oy + pt("usIn")[1]) / 2, class: "lane-tag mo" }, svg);
    moT.textContent = m === "h" ? "← MO 답장" : "MO ↑";

    // 노드
    for (const id of ORDER) {
      const n = NODES[id], [x, y] = pt(id);
      const g = el("g", { class: `node n-${id}${id === "hub" ? " hero" : ""}`, transform: `translate(${x} ${y})`, tabindex: 0, role: "button", "aria-label": `${n.label}: ${n.sub}` }, svg);
      if (id === "hub") el("circle", { r: 40, class: "ring" }, g);
      el("circle", { r: 31, class: "halo" }, g);
      el("circle", { r: 28, class: "disc" }, g);
      const ic = el("svg", { x: -11, y: -11, width: 22, height: 22, viewBox: "0 0 24 24", class: "ico" }, g);
      ic.innerHTML = ICONS[n.icon];
      const side = m === "h" ? "b" : "r";
      const tx = side === "r" ? 44 : 0, anchor = side === "r" ? "start" : "middle";
      const [ly, sy] = side === "b" ? [id === "hub" ? 62 : 54, id === "hub" ? 78 : 70] : [-1, 15];
      const t = el("text", { x: side === "r" ? tx + (id === "hub" ? 8 : 0) : 0, y: ly, class: "n-label", "text-anchor": anchor }, g); t.textContent = n.label;
      const s = el("text", { x: side === "r" ? tx + (id === "hub" ? 8 : 0) : 0, y: sy, class: "n-sub", "text-anchor": anchor }, g); s.textContent = n.sub;
      const show = () => { dlg.querySelector(".sim-info").innerHTML = `<b>${n.label}</b> ${n.desc}`; };
      g.addEventListener("pointerenter", show); g.addEventListener("focus", show); g.addEventListener("click", show);
      nodeEls[id] = g;
    }
    gPk = el("g", { class: "packets" }, svg);
    dlg.querySelector(".sim-info").innerHTML = `<b>안내</b> 아이콘을 누르면 각 단계 설명이 나옵니다.`;
  }

  /* ---------- 패킷 ---------- */
  function flash(id, cls = "hit") {
    const g = nodeEls[id]; if (!g) return;
    g.classList.remove(cls); void g.getBBox(); g.classList.add(cls);
    clearTimeout(g["_t" + cls]); g["_t" + cls] = setTimeout(() => g.classList.remove(cls), 420);
  }
  function makePk(kind, big) {
    const g = el("g", { class: `pk ${kind}${big ? " big" : ""}` }, gPk);
    if (big === "lms") { el("rect", { x: -9, y: -4, width: 18, height: 8, rx: 4, class: "pk-glow" }, g); el("rect", { x: -7, y: -2.6, width: 14, height: 5.2, rx: 2.6, class: "pk-core" }, g); }
    else if (big === "mms") { el("rect", { x: -7, y: -7, width: 14, height: 14, rx: 3, class: "pk-glow" }, g); el("rect", { x: -4.5, y: -4.5, width: 9, height: 9, rx: 2, class: "pk-core" }, g); }
    else { el("circle", { r: big ? 8 : 5, class: "pk-glow" }, g); el("circle", { r: big ? 3.8 : 2, class: "pk-core" }, g); }
    return g;
  }
  function launch({ kind, ids, lane, speed = SPEED, big, cap, onArrive, onDone }) {
    const pts = ids.map((id) => pt(id, lane));
    packets.push({ kind, ids, pts, seg: 0, d: 0, speed, g: makePk(kind, big), cap, onArrive, onDone });
  }
  function step(p, dt) {
    p.d += p.speed * dt;
    while (p.seg < p.pts.length - 1) {
      const [x1, y1] = p.pts[p.seg], [x2, y2] = p.pts[p.seg + 1];
      const len = Math.hypot(x2 - x1, y2 - y1);
      if (p.d < len) { const k = p.d / len; p.x = x1 + (x2 - x1) * k; p.y = y1 + (y2 - y1) * k; return; }
      p.d -= len; p.seg++;
      const id = p.ids[p.seg];
      if (p.cap) { flash(id, p.kind === "mo" ? "hit-mo" : p.kind === "dlr" ? "hit-dlr" : "hit"); if (CAPTION[p.cap]?.[id]) capEl.textContent = CAPTION[p.cap][id]; }
      p.onArrive?.(id);
    }
    p.done = true; p.g.remove(); p.onDone?.();
  }

  /* ---------- 대화 시나리오 ---------- */
  function logRow(id, text) {
    const li = document.createElement("li");
    li.dataset.id = id;
    li.innerHTML = `<span class="mono">#${String(id).padStart(4, "0")}</span><span class="lg-msg">${esc(text)}</span><span class="chip">발송 요청</span>`;
    logEl.prepend(li);
    while (logEl.children.length > 4) logEl.lastChild.remove();
    return li;
  }
  function setChip(li, text, cls) { const c = li.querySelector(".chip"); c.textContent = text; c.className = `chip ${cls || ""}`; }
  function bubble(side, html, cls = "") {
    const b = document.createElement("div");
    b.className = `bubble ${side} ${cls}`;
    b.innerHTML = html;
    chatEl.appendChild(b);
    while (chatEl.children.length > 5) chatEl.firstChild.remove();
    requestAnimationFrame(() => b.classList.add("in"));
    return b;
  }

  function startConversation() {
    if (busy || !running) return;
    busy = true; sendBtn.disabled = true;
    const id = ++seq, t = type, msg = MSG[t];
    const li = logRow(id, `${msg.name} · ${msg.text.split("\n")[0]}`);
    flash("web");
    capEl.textContent = CAPTION.mt.web;
    launch({
      kind: "mt", ids: ORDER, lane: -1, big: t === "sms" ? true : t, cap: "mt",
      onDone: () => {
        // 단말 도착
        const body = t === "mms" ? `<div class="mms-img" aria-hidden="true"></div>${esc(msg.text)}` : esc(msg.text).replace(/\n/g, "<br>");
        bubble("in", `<span class="b-type">${msg.name}</span>${body}`);
        // 전달 결과(DLR)
        launch({
          kind: "dlr", ids: ORDER.slice().reverse(), lane: 1, speed: SPEED * 1.8, cap: "dlr",
          onArrive: (nid) => { if (nid === "platform") setChip(li, "전달 완료", "ok"); },
        });
        // 답장(MO)
        setTimeout(() => {
          if (!running) return;
          const reply = REPLIES[(id - 1) % REPLIES.length];
          bubble("out", esc(reply), "typing");
          launch({
            kind: "mo", ids: ORDER.slice().reverse(), lane: 1, big: true, cap: "mo",
            onDone: () => {
              setChip(li, "답장 수신", "mo");
              const r = document.createElement("li");
              r.className = "reply";
              r.innerHTML = `<span class="mono">↩</span><span class="lg-msg">${esc(reply)}</span><span class="chip mo">MO</span>`;
              li.after(r);
              flash("web", "hit-mo");
              setTimeout(() => { busy = false; sendBtn.disabled = false; autoT = 2.2; }, 400);
            },
          });
        }, reduce ? 300 : 1300);
      },
    });
  }

  /* ---------- 루프 ---------- */
  function tick(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05) * (reduce ? 0.6 : 1);
    last = now;

    // 배경 트래픽: 흐릿한 점이 양쪽 차선을 계속 오감
    ambientT -= dt;
    if (ambientT <= 0) {
      ambientT = 0.35 + Math.random() * 0.5;
      const back = Math.random() < 0.35;
      launch({ kind: back ? "amb mo" : "amb", ids: back ? ORDER.slice(1).reverse() : ORDER.slice(1), lane: back ? 1 : -1, speed: SPEED * (0.8 + Math.random() * 0.4) });
    }
    // 자동 재생: SMS → LMS → MMS 순서로 돌아가며 발송
    if (auto && !busy) { autoT -= dt; if (autoT <= 0) { setType(["sms", "lms", "mms"][seq % 3]); startConversation(); } }

    for (const p of packets) if (!p.done) step(p, dt);
    packets = packets.filter((p) => !p.done);
    for (const p of packets) p.g.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    raf = requestAnimationFrame(tick);
  }

  let opener = null;
  function open(from) {
    if (!dlg) build();
    opener = from || null;
    dlg.showModal();
    document.documentElement.classList.add("modal-open");
    logEl.innerHTML = ""; chatEl.innerHTML = ""; capEl.textContent = "";
    draw(stage.clientWidth < 640 ? "v" : "h");
    running = true; busy = false; autoT = 0.8; last = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  }
  function close() { if (dlg?.open) dlg.close(); }
  function stop() {
    running = false; cancelAnimationFrame(raf);
    document.documentElement.classList.remove("modal-open");
    opener?.focus?.();
  }

  window.ZIDemos = Object.assign(window.ZIDemos || {}, { a2p: { open, close } });
})();
