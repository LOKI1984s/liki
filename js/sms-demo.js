/*
 * SMS 중계 재판매 시스템 — 인터랙티브 구조도 (사업 모델 페이지 팝업)
 * 문자 한 통이 고객사 → 플랫폼(접수·검증·큐·라우팅) → 중계사 → 통신사 → 수신자로 가고,
 * 결과(DLR)가 아래 경로로 돌아오는 흐름을 시뮬레이션한다.
 * 아이콘: Lucide (ISC License)
 */
(() => {
  const ICONS = {"building-2": "<path d=\"M10 12h4\" /> <path d=\"M10 8h4\" /> <path d=\"M14 21v-3a2 2 0 0 0-4 0v3\" /> <path d=\"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2\" /> <path d=\"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16\" />", "server": "<rect width=\"20\" height=\"8\" x=\"2\" y=\"2\" rx=\"2\" ry=\"2\" /> <rect width=\"20\" height=\"8\" x=\"2\" y=\"14\" rx=\"2\" ry=\"2\" /> <line x1=\"6\" x2=\"6.01\" y1=\"6\" y2=\"6\" /> <line x1=\"6\" x2=\"6.01\" y1=\"18\" y2=\"18\" />", "radio-tower": "<path d=\"M4.9 16.1C1 12.2 1 5.8 4.9 1.9\" /> <path d=\"M7.8 4.7a6.14 6.14 0 0 0-.8 7.5\" /> <circle cx=\"12\" cy=\"9\" r=\"2\" /> <path d=\"M16.2 4.8c2 2 2.26 5.11.8 7.47\" /> <path d=\"M19.1 1.9a9.96 9.96 0 0 1 0 14.1\" /> <path d=\"M9.5 18h5\" /> <path d=\"m8 22 4-11 4 11\" />", "antenna": "<path d=\"M2 12 7 2\" /> <path d=\"m7 12 5-10\" /> <path d=\"m12 12 5-10\" /> <path d=\"m17 12 5-10\" /> <path d=\"M4.5 7h15\" /> <path d=\"M12 16v6\" />", "smartphone": "<rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\" ry=\"2\" /> <path d=\"M12 18h.01\" />", "inbox": "<polyline points=\"22 12 16 12 14 15 10 15 8 12 2 12\" /> <path d=\"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\" />", "shield-check": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" /> <path d=\"m9 12 2 2 4-4\" />", "layers": "<path d=\"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z\" /> <path d=\"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12\" /> <path d=\"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17\" />", "split": "<path d=\"M16 3h5v5\" /> <path d=\"M8 3H3v5\" /> <path d=\"M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3\" /> <path d=\"m15 9 6-6\" />", "plug": "<path d=\"M12 22v-5\" /> <path d=\"M15 8V2\" /> <path d=\"M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z\" /> <path d=\"M9 8V2\" />", "receipt": "<path d=\"M12 17V7\" /> <path d=\"M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8\" /> <path d=\"M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z\" />", "webhook": "<path d=\"M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2\" /> <path d=\"m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06\" /> <path d=\"m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8\" />", "database": "<ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\" /> <path d=\"M3 5V19A9 3 0 0 0 21 19V5\" /> <path d=\"M3 12A9 3 0 0 0 21 12\" />"};
  const SVGNS = "http://www.w3.org/2000/svg";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 구조 정의 ---------- */
  const NODES = {
    client:  { label: "고객사", sub: "웹 · REST API · Agent", icon: "building-2", desc: "기업 고객이 웹 화면, REST API, 자체 서버에 설치한 발송 에이전트로 문자를 요청합니다." },
    intake:  { label: "접수", sub: "인증 · 등록", icon: "inbox", desc: "API 키로 고객을 인증하고 요청을 받아 발송 건으로 등록합니다." },
    verify:  { label: "검증", sub: "번호 · 스팸 · 잔액", icon: "shield-check", desc: "사전등록된 발신번호인지, 스팸 문구·080 수신거부 표기가 있는지, 선불 잔액이 있는지 확인합니다. 통과 못 하면 여기서 차단됩니다." },
    queue:   { label: "큐", sub: "예약 · 속도 제어", icon: "layers", desc: "대량 발송을 쌓아두고 중계사가 받을 수 있는 속도로 흘려보냅니다. 예약 발송도 여기서 대기합니다." },
    route:   { label: "라우팅", sub: "단가 · 우회", icon: "split", desc: "단가와 상태를 보고 중계사 A·B 중 어디로 보낼지 정합니다. 한쪽이 장애면 자동으로 다른 쪽으로 넘깁니다." },
    relayA:  { label: "중계사 A", sub: "SMPP · Agent", icon: "radio-tower", desc: "통신사망에 직접 연결된 문자 중계사업자입니다. 재판매사는 이 회선을 도매로 씁니다." },
    relayB:  { label: "중계사 B", sub: "SMPP · HTTP", icon: "radio-tower", desc: "이중화용 두 번째 중계사입니다. 평소엔 트래픽을 나눠 받고, A 장애 시 전량을 받습니다." },
    carrier: { label: "통신사", sub: "SMSC · 3사", icon: "antenna", desc: "통신사 문자센터(SMSC)가 수신자 단말로 문자를 전달하고 결과를 남깁니다." },
    phone:   { label: "수신자", sub: "단말 도착", icon: "smartphone", desc: "문자가 도착하면 통신사가 성공·실패 결과(DLR)를 만들어 돌려보냅니다." },
    dlr:     { label: "결과 수신", sub: "DLR 리포트", icon: "receipt", desc: "통신사와 중계사를 거쳐 온 전달 결과를 받아 발송 건과 짝지어 기록합니다." },
    log:     { label: "이력 · 과금", sub: "과금 · 환불", icon: "database", desc: "성공 건은 과금하고 실패 건은 잔액을 돌려줍니다. 발송 이력은 법정 기간 동안 보관합니다." },
    hook:    { label: "결과 알림", sub: "웹훅 · 조회 API", icon: "webhook", desc: "고객사 서버로 결과를 웹훅으로 보내고, 조회 API로도 확인할 수 있게 합니다." },
  };

  // 가로(넓은 화면) / 세로(좁은 화면) 좌표. side: 라벨 위치(b 아래, r 오른쪽, l 왼쪽)
  const LAYOUT = {
    h: {
      w: 1200, h: 560,
      frame: { x: 196, y: 84, w: 510, h: 452 },
      pos: {
        client: [80, 190], intake: [262, 190], verify: [392, 190], queue: [522, 190], route: [652, 190],
        relayA: [812, 105], relayB: [812, 285], carrier: [968, 190], phone: [1110, 190],
        dlr: [968, 440], log: [450, 440], hook: [80, 440],
        c1: [1170, 190], c2: [1170, 440], clientIn: [80, 262],
      },
      side: {},
    },
    v: {
      w: 420, h: 1100,
      frame: { x: 14, y: 168, w: 392, h: 432 },
      pos: {
        client: [60, 70], intake: [60, 222], verify: [60, 332], queue: [60, 442], route: [60, 552],
        relayA: [60, 690], relayB: [230, 762], carrier: [60, 870], phone: [60, 1010],
        dlr: [372, 940], log: [372, 497], hook: [372, 146],
        c1: [372, 1010], c2: [372, 1010], clientIn: [60, 70],
      },
      side: { client: "r", intake: "r", verify: "r", queue: "r", route: "r", relayA: "r", relayB: "r", carrier: "r", phone: "r", dlr: "l", log: "l", hook: "l" },
    },
  };
  const RETURN = ["phone", "c1", "c2", "dlr", "log", "hook", "clientIn"];

  const TPS = 12;             // 큐가 내보내는 초당 건수 (시뮬레이션 속도)
  const SPEED = 300;         // 패킷 이동 속도 (viewBox 단위/초)
  const BLOCK_RATE = 0.04;   // 검증 차단 비율
  const FAIL_RATE = 0.03;    // 단말 전달 실패 비율

  /* ---------- 상태 ---------- */
  let dlg, stage, svg, gPackets, infoEl, statEls = {}, L, mode;
  let packets = [], queue = [], tokens = 0, spawnT = 0, burstLeft = 0;
  let relayADown = 0, autoFailT = 14, raf = 0, last = 0, running = false;
  const stats = { sent: 0, ok: 0, fail: 0, reroute: 0 };
  const nodeEls = {};

  const el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const P = (id) => L.pos[id];

  /* ---------- 모달 ---------- */
  function build() {
    dlg = document.createElement("dialog");
    dlg.className = "modal";
    dlg.setAttribute("aria-labelledby", "sms-title");
    dlg.innerHTML = `
      <header class="modal-head">
        <div>
          <p class="eyebrow"><span class="mono">SYSTEM</span>Interactive</p>
          <h2 id="sms-title">SMS 중계 재판매 시스템</h2>
          <p class="modal-sub">문자 한 통이 발송되고 결과가 돌아오기까지</p>
        </div>
        <button type="button" class="icon-btn" data-close aria-label="닫기">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </header>
      <div class="modal-body">
        <div class="sim-stats">
          <div><span>접수</span><b data-stat="sent">0</b></div>
          <div><span>큐 대기</span><b data-stat="wait">0</b></div>
          <div><span>성공</span><b data-stat="ok" class="ok">0</b></div>
          <div><span>차단 · 실패</span><b data-stat="fail" class="bad">0</b></div>
          <div><span>장애 우회</span><b data-stat="reroute" class="warn">0</b></div>
        </div>
        <div class="sim-stage"></div>
        <p class="sim-info" aria-live="polite"></p>
        <div class="sim-legend">
          <span><i class="dot lime"></i>발송</span>
          <span><i class="dot mint"></i>결과(DLR)</span>
          <span><i class="dot red"></i>차단 · 실패</span>
        </div>
      </div>
      <footer class="modal-foot">
        <div class="sim-controls">
          <button type="button" class="btn btn-sm-o" data-act="burst">대량 발송 +150</button>
          <button type="button" class="btn btn-sm-o" data-act="fail">중계사 A 장애</button>
          <button type="button" class="btn btn-sm-o" data-act="pause" aria-pressed="false">일시정지</button>
        </div>
        <button type="button" class="btn" data-close>닫기</button>
      </footer>`;
    document.body.appendChild(dlg);
    stage = dlg.querySelector(".sim-stage");
    infoEl = dlg.querySelector(".sim-info");
    dlg.querySelectorAll("[data-stat]").forEach((b) => (statEls[b.dataset.stat] = b));

    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest("[data-close]")) close();
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (act === "burst") burstLeft += 150;
      if (act === "fail") failA(6);
      if (act === "pause") {
        const b = e.target.closest("[data-act]");
        running = !running;
        b.setAttribute("aria-pressed", String(!running));
        b.textContent = running ? "일시정지" : "재생";
        if (running) { last = performance.now(); raf = requestAnimationFrame(tick); }
      }
    });
    dlg.addEventListener("close", stop);
    new ResizeObserver(() => { const m = stage.clientWidth < 640 ? "v" : "h"; if (m !== mode) draw(m); }).observe(stage);
  }

  function draw(m) {
    mode = m; L = LAYOUT[m];
    packets.forEach((p) => p.g.remove());
    packets = []; queue = [];
    stage.innerHTML = "";
    svg = el("svg", { viewBox: `0 0 ${L.w} ${L.h}`, class: `sim-svg ${m}`, role: "img", "aria-label": "SMS 발송 구조도" }, stage);

    // 플랫폼 영역
    const f = L.frame;
    el("rect", { x: f.x, y: f.y, width: f.w, height: f.h, rx: 18, class: "frame" }, svg);
    const ft = el("text", { x: f.x + 18, y: f.y + 26, class: "frame-label" }, svg);
    ft.textContent = "재판매사 플랫폼";

    // 선로
    const line = (pts, cls) => el("polyline", { points: pts.map((p) => P(p).join(",")).join(" "), class: cls }, svg);
    line(["client", "intake", "verify", "queue", "route"], "track");
    line(["route", "relayA", "carrier"], "track");
    line(["route", "relayB", "carrier"], "track");
    line(["carrier", "phone"], "track");
    line(RETURN, "track back");
    line(["client", "intake", "verify", "queue", "route"], "flow");
    line(["route", "relayA", "carrier", "phone"], "flow");
    line(["route", "relayB", "carrier"], "flow");
    line(RETURN, "flow back");

    gPackets = el("g", { class: "packets" }, svg);

    // 노드
    for (const id in NODES) {
      const n = NODES[id], [x, y] = L.pos[id];
      const g = el("g", { class: `node n-${id}`, transform: `translate(${x} ${y})`, tabindex: 0, role: "button", "aria-label": `${n.label}: ${n.sub}` }, svg);
      el("circle", { r: 27, class: "halo" }, g);
      el("circle", { r: 24, class: "disc" }, g);
      const ic = el("svg", { x: -11, y: -11, width: 22, height: 22, viewBox: "0 0 24 24", class: "ico" }, g);
      ic.innerHTML = ICONS[n.icon];
      const side = L.side[id] || "b";
      const tx = side === "r" ? 36 : side === "l" ? -36 : 0;
      const anchor = side === "r" ? "start" : side === "l" ? "end" : "middle";
      const [ly, sy] = side === "b" ? [46, 63] : [-1, 15];
      const t = el("text", { x: tx, y: ly, class: "n-label", "text-anchor": anchor }, g); t.textContent = n.label;
      const s = el("text", { x: tx, y: sy, class: "n-sub", "text-anchor": anchor }, g); s.textContent = n.sub;
      if (id === "queue") { const b = el("text", side === "r" ? { x: 228, y: 4, class: "n-badge", "text-anchor": "start" } : { y: -74, class: "n-badge", "text-anchor": "middle" }, g); nodeEls.queueBadge = b; }
      if (id === "relayA") { const b = el("text", { y: -34, class: "n-badge bad", "text-anchor": "middle" }, g); nodeEls.relayABadge = b; }
      const show = () => { infoEl.innerHTML = `<b>${n.label}</b> ${n.desc}`; };
      g.addEventListener("pointerenter", show);
      g.addEventListener("focus", show);
      g.addEventListener("click", show);
      nodeEls[id] = g;
    }
    infoEl.innerHTML = `<b>안내</b> 아이콘을 누르면 각 단계 설명이 나옵니다.`;
    setRelayA();
  }

  /* ---------- 시뮬레이션 ---------- */
  function flash(id, cls = "hit") {
    const g = nodeEls[id]; if (!g) return;
    g.classList.remove(cls); void g.getBBox(); g.classList.add(cls);
    clearTimeout(g["_t" + cls]); g["_t" + cls] = setTimeout(() => g.classList.remove(cls), 380);
  }

  function makePacket(kind) {
    const g = el("g", { class: `pk ${kind}` }, gPackets);
    el("circle", { r: 7, class: "pk-glow" }, g);
    el("circle", { r: 3.2, class: "pk-core" }, g);
    return g;
  }

  function spawn() {
    stats.sent++;
    const p = { kind: "send", path: ["client", "intake", "verify", "queue"], seg: 0, d: 0, g: makePacket("send"), stage: "toQueue" };
    p.blocked = Math.random() < BLOCK_RATE;
    if (p.blocked) p.path = ["client", "intake", "verify"];
    packets.push(p);
  }

  function segLen(a, b) { const [x1, y1] = P(a), [x2, y2] = P(b); return Math.hypot(x2 - x1, y2 - y1); }

  function advance(p, dt) {
    if (p.wait) return;
    p.d += SPEED * dt;
    while (p.seg < p.path.length - 1) {
      const len = segLen(p.path[p.seg], p.path[p.seg + 1]);
      if (p.d < len) break;
      p.d -= len; p.seg++;
      arrive(p, p.path[p.seg]);
      if (p.dead || p.wait) return;
    }
    if (p.seg >= p.path.length - 1) { p.d = 0; return; }
    const [x1, y1] = P(p.path[p.seg]), [x2, y2] = P(p.path[p.seg + 1]);
    const k = p.d / segLen(p.path[p.seg], p.path[p.seg + 1]);
    p.x = x1 + (x2 - x1) * k; p.y = y1 + (y2 - y1) * k;
  }

  function arrive(p, id) {
    if (["intake", "route", "carrier", "log", "dlr", "hook"].includes(id)) flash(id);
    if (p.kind === "send") {
      if (id === "verify") {
        if (p.blocked) { flash("verify", "bad"); stats.fail++; kill(p, true); return; }
        flash("verify", "ok");
      }
      if (id === "queue") {
        p.wait = true; flash("queue");
        queue.push(p); placeQueue();
        return;
      }
      if (id === "relayA" && relayADown > 0) {
        // 장애 감지 → 라우팅으로 되돌아가 B로 우회
        stats.reroute++; flash("relayA", "bad"); p.g.classList.add("rr");
        p.path = ["relayA", "route", "relayB", "carrier", "phone"]; p.seg = 0; p.d = 0;
        return;
      }
      if (id === "relayA" || id === "relayB") flash(id);
      if (id === "phone") {
        flash("phone");
        const ok = Math.random() >= FAIL_RATE;
        kill(p, false);
        const r = { kind: ok ? "dlr" : "dlr-fail", path: RETURN.slice(), seg: 0, d: 0, g: makePacket(ok ? "dlr" : "dlr-fail"), ok };
        packets.push(r);
      }
    } else if (id === "log") {
      if (p.ok) stats.ok++; else stats.fail++;
    } else if (id === "clientIn") {
      flash("client"); kill(p, false);
    }
  }

  function kill(p, fade) {
    p.dead = true;
    if (fade) { p.g.classList.add("die"); setTimeout(() => p.g.remove(), 600); }
    else p.g.remove();
  }

  function release() {
    const p = queue.shift();
    p.g.style.opacity = "";
    placeQueue();
    const wantA = Math.random() < 0.6;
    const useA = wantA && relayADown <= 0;
    if (wantA && !useA) { stats.reroute++; p.g.classList.add("rr"); }
    p.wait = false; p.seg = 0; p.d = 0;
    p.path = ["queue", "route", useA ? "relayA" : "relayB", "carrier", "phone"];
    p.x = P("queue")[0]; p.y = P("queue")[1];
  }

  // 큐 대기열 표시: 가로 10 × 3줄(최대 30개), 넘치는 건 숫자로만
  function placeQueue() {
    const [qx, qy] = P("queue");
    queue.forEach((q, i) => {
      const col = i % 10, row = Math.floor(i / 10);
      if (mode === "v") { q.x = qx + 150 + col * 7; q.y = qy - 6 + row * 7; }
      else { q.x = qx - 31 + col * 7; q.y = qy - 44 - row * 7; }
      q.g.style.opacity = i < 30 ? "" : "0";
      q.g.setAttribute("transform", `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`);
    });
  }

  function failA(sec) { relayADown = sec; setRelayA(); }
  function setRelayA() {
    const g = nodeEls.relayA; if (!g) return;
    g.classList.toggle("down", relayADown > 0);
    if (nodeEls.relayABadge) nodeEls.relayABadge.textContent = relayADown > 0 ? "장애" : "";
  }

  function tick(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05) * (reduce ? 0.5 : 1);
    last = now;

    // 유입
    spawnT -= dt;
    if (spawnT <= 0) { spawn(); spawnT = 0.28 + Math.random() * 0.4; }
    if (burstLeft > 0) { const n = Math.min(burstLeft, Math.ceil(dt * 110)); for (let i = 0; i < n; i++) spawn(); burstLeft -= n; }

    // 큐: 초당 TPS 건만 내보냄
    tokens = Math.min(tokens + dt * TPS, 3);
    while (tokens >= 1 && queue.length) { tokens--; release(); }

    // 장애: 수동 버튼 + 가끔 자동
    if (relayADown > 0) { relayADown -= dt; if (relayADown <= 0) { relayADown = 0; setRelayA(); } }
    autoFailT -= dt;
    if (autoFailT <= 0) { failA(5); autoFailT = 22 + Math.random() * 10; }

    for (const p of packets) if (!p.dead) advance(p, dt);
    packets = packets.filter((p) => !p.dead || p.g.isConnected);
    for (const p of packets) if (!p.dead && p.x != null) p.g.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);

    statEls.sent.textContent = stats.sent.toLocaleString("en-US");
    statEls.wait.textContent = queue.length;
    statEls.ok.textContent = stats.ok.toLocaleString("en-US");
    statEls.fail.textContent = stats.fail.toLocaleString("en-US");
    statEls.reroute.textContent = stats.reroute.toLocaleString("en-US");
    if (nodeEls.queueBadge) nodeEls.queueBadge.textContent = queue.length > 30 ? `+${queue.length - 30}` : "";

    raf = requestAnimationFrame(tick);
  }

  let opener = null;
  function open(from) {
    if (!dlg) build();
    opener = from || null;
    dlg.showModal();
    document.documentElement.classList.add("modal-open");
    draw(stage.clientWidth < 640 ? "v" : "h");
    running = true; last = performance.now();
    const pb = dlg.querySelector('[data-act="pause"]'); pb.textContent = "일시정지"; pb.setAttribute("aria-pressed", "false");
    cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  }
  function close() { if (dlg?.open) dlg.close(); }
  function stop() {
    running = false; cancelAnimationFrame(raf);
    document.documentElement.classList.remove("modal-open");
    opener?.focus?.();
  }

  window.ZIDemos = Object.assign(window.ZIDemos || {}, { sms: { open, close } });
})();
