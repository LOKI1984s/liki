/*
 * 국제 메시징 플랫폼 — 인터랙티브 구조도 (개발 페이지 팝업)
 * 탭: A2P 양방향 / OTP · 룩업   목적지: 국가 선택
 * 공통 경로: 한국 플랫폼 → 미국 게이트웨이(수신·재발신) → Tier1 GSM 허브 → 목적지 통신사 → 단말
 * 한국 목적지는 1차 수신 통신사를 거쳐 '통신사 코드 + 대표번호'로 표시된다.
 * 회사명은 넣지 않고 역할 이름만 쓴다. 아이콘: Lucide (ISC License)
 */
(() => {
  const ICONS = {"monitor": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\" /> <line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\" /> <line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\" />", "server": "<rect width=\"20\" height=\"8\" x=\"2\" y=\"2\" rx=\"2\" ry=\"2\" /> <rect width=\"20\" height=\"8\" x=\"2\" y=\"14\" rx=\"2\" ry=\"2\" /> <line x1=\"6\" x2=\"6.01\" y1=\"6\" y2=\"6\" /> <line x1=\"6\" x2=\"6.01\" y1=\"18\" y2=\"18\" />", "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /> <path d=\"M2 12h20\" />", "network": "<rect x=\"16\" y=\"16\" width=\"6\" height=\"6\" rx=\"1\" /> <rect x=\"2\" y=\"16\" width=\"6\" height=\"6\" rx=\"1\" /> <rect x=\"9\" y=\"2\" width=\"6\" height=\"6\" rx=\"1\" /> <path d=\"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3\" /> <path d=\"M12 12V8\" />", "antenna": "<path d=\"M2 12 7 2\" /> <path d=\"m7 12 5-10\" /> <path d=\"m12 12 5-10\" /> <path d=\"m17 12 5-10\" /> <path d=\"M4.5 7h15\" /> <path d=\"M12 16v6\" />", "radio-tower": "<path d=\"M4.9 16.1C1 12.2 1 5.8 4.9 1.9\" /> <path d=\"M7.8 4.7a6.14 6.14 0 0 0-.8 7.5\" /> <circle cx=\"12\" cy=\"9\" r=\"2\" /> <path d=\"M16.2 4.8c2 2 2.26 5.11.8 7.47\" /> <path d=\"M19.1 1.9a9.96 9.96 0 0 1 0 14.1\" /> <path d=\"M9.5 18h5\" /> <path d=\"m8 22 4-11 4 11\" />", "smartphone": "<rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\" ry=\"2\" /> <path d=\"M12 18h.01\" />", "send": "<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\" /> <path d=\"m21.854 2.147-10.94 10.939\" />", "key-round": "<path d=\"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z\" /> <circle cx=\"16.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" />", "search-check": "<path d=\"m8 11 2 2 4-4\" /> <circle cx=\"11\" cy=\"11\" r=\"8\" /> <path d=\"m21 21-4.3-4.3\" />", "shield-check": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" /> <path d=\"m9 12 2 2 4-4\" />", "building-2": "<path d=\"M10 12h4\" /> <path d=\"M10 8h4\" /> <path d=\"M14 21v-3a2 2 0 0 0-4 0v3\" /> <path d=\"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2\" /> <path d=\"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16\" />", "lock-keyhole": "<circle cx=\"12\" cy=\"16\" r=\"1\" /> <rect x=\"3\" y=\"10\" width=\"18\" height=\"12\" rx=\"2\" /> <path d=\"M7 10V7a5 5 0 0 1 10 0v3\" />"};
  const SVGNS = "http://www.w3.org/2000/svg";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const CIRC = "①②③④⑤⑥⑦⑧⑨⑩";

  /* ---------- 목적지 ---------- */
  const DEST = {
    kr: { en: "KOREA", ko: "한국", cc: "+82", num: "10-****-1234" },
    us: { en: "USA", ko: "미국", cc: "+1", num: "415-***-0192" },
    jp: { en: "JAPAN", ko: "일본", cc: "+81", num: "90-****-5521" },
    vn: { en: "VIETNAM", ko: "베트남", cc: "+84", num: "91-***-4410" },
    gb: { en: "UK", ko: "영국", cc: "+44", num: "7700-***861" },
  };

  /* ---------- 노드 ---------- */
  const N = (d) => d;
  const NODES = {
    web:      N({ label: "고객 웹", sub: "발송 · 수신함", icon: "monitor", mt: "고객이 웹에서 발송", mo: "고객 웹 수신함에 답장 도착", desc: "고객이 웹에서 메시지를 쓰고 발송을 누릅니다. 수신자가 답장하면 같은 화면 수신함에 들어옵니다." }),
    svc:      N({ label: "기업 서비스", sub: "로그인 · 결제", icon: "building-2", mt: "사용자가 인증번호 요청", mo: "로그인 완료", desc: "OTP를 도입한 기업의 서비스입니다. 로그인·결제 단계에서 비밀번호 대신 문자 인증번호를 씁니다." }),
    platform: N({ label: "A2P 플랫폼", sub: "KR · 발신", icon: "server", mt: "한국 플랫폼에서 발신 · 대표번호 확인 · 과금", mo: "플랫폼이 원래 발송 건과 매칭", desc: "한국에 있는 발송 플랫폼입니다. 대표번호 확인, 과금, 발송 건 번호 부여를 하고 국제망으로 내보냅니다. 답장이 오면 원래 발송 건과 짝지어 고객에게 돌려줍니다." }),
    otp:      N({ label: "OTP API", sub: "발급 · 룩업 · 검증", icon: "key-round", mt: "OTP 발급 · 6자리 생성 · 유효 3분", mo: "검증 API · 일치 · 유효시간 확인", desc: "기업 서버가 호출하는 OTP API입니다. 인증번호를 만들고(원문 대신 암호화 저장), 보내기 전에 룩업으로 번호를 확인하고, 사용자가 입력한 번호를 검증합니다. 재요청·시도 횟수 제한이 걸려 있습니다." }),
    usIn:     N({ label: "US 게이트웨이", sub: "수신", icon: "globe", mt: "미국 게이트웨이 수신", mo: "미국 → 한국", desc: "미국 게이트웨이가 한국에서 보낸 메시지를 받습니다. 여기서부터 우회 구간입니다." }),
    usOut:    N({ label: "US 게이트웨이", sub: "재발신", icon: "send", mt: "미국에서 재발신 · 우회 구간", mo: "미국 게이트웨이 경유", desc: "미국에서 국제 사업자망으로 다시 발신합니다." }),
    hub:      N({ label: "Tier1 GSM 허브", sub: "IPX · SS7 · 글로벌 코드", icon: "network", mt: "Tier1 GSM 허브 · 사업자망으로 목적지 진입", mo: "Tier1 허브 · 국제망으로 회신", desc: "전 세계 통신사와 직접 연결된 사업자망입니다. 국가별 단독 코드가 아니라 글로벌 코드로 연결돼 있어 허브의 전 세계 라우팅망을 그대로 씁니다. 도착은 문서 기준 약 2초, 실무 10초 이내입니다." }),
    krGate:   N({ label: "1차 수신 통신사", sub: "국내 국제관문", icon: "antenna", mt: "1차 수신 통신사 · 통신사 코드 + 대표번호 표시", mo: "1차 수신 통신사 경유", desc: "국제 메시지를 가장 먼저 받는 국내 사업자입니다. 발신번호가 '통신사 코드 + 대표번호'로 붙어서, 국제발신이지만 한국 대표번호로 표시됩니다." }),
    mno:      N({ label: "국내 MNO", sub: "SMSC · HLR", icon: "radio-tower", mt: "국내 MNO 문자센터 전달", mo: "MNO가 답장(MO) 수신", desc: "이동통신사 문자센터가 단말로 전달합니다. 가입자 정보(HLR)도 여기 있어서 룩업 질의에 답합니다." }),
    local:    N({ label: "현지 MNO", sub: "SMSC · HLR", icon: "radio-tower", mt: "현지 MNO 문자센터 전달", mo: "현지 MNO가 답장(MO) 수신", desc: "목적지 나라 이동통신사입니다. 허브가 직접 연결돼 있어 중간 업체 없이 바로 전달합니다." }),
    phone:    N({ label: "수신자", sub: "단말", icon: "smartphone", mt: "수신자 단말 도착", mo: "수신자가 같은 번호로 답장", desc: "메시지를 받고 그 번호로 바로 답장할 수 있습니다." }),
  };

  function scene(tab, dk) {
    const d = DEST[dk];
    const head = tab === "a2p" ? ["web", "platform"] : ["svc", "otp"];
    const tail = dk === "kr" ? ["krGate", "mno", "phone"] : ["local", "phone"];
    const order = [...head, "usIn", "usOut", "hub", ...tail];
    const bands = [
      { label: "KOREA", sub: tab === "a2p" ? "발신" : "기업 · OTP 플랫폼", from: head[0], to: head[1] },
      { label: "USA", sub: "우회 구간", from: "usIn", to: "usOut" },
      { label: "GLOBAL", sub: "Tier1 IPX", from: "hub", to: "hub", hi: true },
      { label: d.en, sub: "수신", from: tail[0], to: "phone" },
    ];
    return { order, bands, d };
  }

  /* ---------- 탭별 콘텐츠 ---------- */
  const MSG = {
    sms: { name: "SMS", text: "[Zero∞] 주문이 접수됐어요. 궁금한 점은 이 번호로 답장 주세요." },
    lms: { name: "LMS", text: "[Zero∞] 주문 안내\n주문번호 A-20931\n상품: 무선 이어폰 외 1건\n결제: 49,800원\n배송 예정: 내일 도착\n변경·취소는 이 번호로 답장 주세요." },
    mms: { name: "MMS", text: "[Zero∞] 이번 주 신상품 안내예요. 궁금한 점은 답장 주세요." },
  };
  const REPLIES = ["네 확인했어요", "배송 언제 와요?", "감사합니다!", "주소 변경 가능할까요?"];
  const CARRIERS = ["MNO-A", "MNO-B", "MNO-C"];
  const SPEED = 430;

  /* ---------- 상태 ---------- */
  let dlg, stage, svg, gPk, capEl, infoEl, mode, L, S;
  let tab = "a2p", dest = "kr", type = "sms";
  let packets = [], timers = [], ambientT = 0, raf = 0, last = 0, clock = 0, running = false, busy = false, auto = true, autoT = 0.8, seq = 0;
  let otpStats = { ok: 0, blocked: 0, times: [] };
  const nodeEls = {};
  const $ = (sel) => dlg.querySelector(sel);

  const el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  // lane: -1 = 발신(위/왼쪽) 차선, +1 = 회신(아래/오른쪽) 차선
  const pt = (id, lane = 0) => {
    const i = S.order.indexOf(id), s = L.steps[i], o = lane * L.lane;
    return mode === "h" ? [s, L.axis + o] : [L.axis + o, s];
  };
  // 시뮬레이션 시계 기준 지연 실행 (일시정지·닫기에 안전)
  const later = (sec, fn) => timers.push({ at: clock + sec, fn });

  /* ---------- 모달 ---------- */
  function build() {
    dlg = document.createElement("dialog");
    dlg.className = "modal";
    dlg.setAttribute("aria-labelledby", "intl-title");
    dlg.innerHTML = `
      <header class="modal-head">
        <div>
          <p class="eyebrow"><span class="mono">SYSTEM</span>Interactive</p>
          <h2 id="intl-title">국제 메시징 플랫폼</h2>
          <p class="modal-sub">Tier1 GSM 허브의 글로벌 라우팅망 위에서 도는 서비스</p>
        </div>
        <button type="button" class="icon-btn" data-close aria-label="닫기">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </header>
      <div class="modal-body">
        <div class="demo-bar">
          <nav class="tabs" role="tablist" aria-label="서비스">
            <button type="button" role="tab" class="tab" data-tab="a2p" aria-selected="true">A2P 양방향</button>
            <button type="button" role="tab" class="tab" data-tab="otp" aria-selected="false">OTP · 룩업</button>
          </nav>
          <div class="dest">
            <span class="mono">목적지</span>
            <div class="seg" role="radiogroup" aria-label="목적지 국가">
              ${Object.entries(DEST).map(([k, v]) => `<button type="button" role="radio" data-dest="${k}" aria-checked="${k === "kr"}">${v.ko}</button>`).join("")}
            </div>
          </div>
        </div>
        <div class="sim-stage"></div>
        <p class="a2p-cap mono" aria-live="polite"></p>

        <div class="a2p-panels" data-panel="a2p">
          <section class="a2p-console" aria-label="고객 웹 발송 화면">
            <div class="panel-head"><span class="mono">WEB CONSOLE</span></div>
            <dl class="a2p-form">
              <dt>발신번호</dt><dd class="a2p-from"></dd>
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
            <div class="phone"><div class="phone-head"></div><div class="phone-chat"></div></div>
          </section>
        </div>

        <div class="a2p-panels" data-panel="otp" hidden>
          <section class="a2p-console otp-login" aria-label="기업 서비스 로그인 화면">
            <div class="panel-head"><span class="mono">ENTERPRISE LOGIN</span></div>
            <p class="otp-title">휴대폰 인증으로 로그인</p>
            <div class="otp-field"><span class="cc mono"></span><span class="num mono"></span></div>
            <div class="code-boxes" aria-label="인증번호 입력">${"<span></span>".repeat(6)}</div>
            <p class="otp-status">인증번호를 요청하세요.</p>
            <div class="a2p-actions">
              <button type="button" class="btn btn-primary btn-sm-o" data-act="otp">인증번호 받기</button>
              <button type="button" class="btn btn-sm-o" data-act="fraud">가짜 번호 요청 (펌핑)</button>
              <button type="button" class="btn btn-sm-o" data-act="auto" aria-pressed="true">자동 재생 켜짐</button>
            </div>
            <div class="otp-stats">
              <div><span>인증 성공</span><b data-os="ok">0</b></div>
              <div><span>공격 차단</span><b data-os="blocked" class="bad">0</b></div>
              <div><span>평균 도착</span><b data-os="avg">–</b></div>
            </div>
          </section>
          <section class="otp-side">
            <div class="lookup-card" aria-live="polite">
              <div class="panel-head"><span class="mono">LOOKUP</span><span class="lk-state mono">대기</span></div>
              <dl>
                <dt>번호 상태</dt><dd data-lk="valid">–</dd>
                <dt>통신사</dt><dd data-lk="carrier">–</dd>
                <dt>번호이동</dt><dd data-lk="ported">–</dd>
                <dt>로밍</dt><dd data-lk="roaming">–</dd>
              </dl>
            </div>
            <div class="timer">
              <div class="timer-top"><span class="mono">도착 시간</span><b class="t-val mono">0.0s</b></div>
              <div class="t-bar"><i class="t-fill"></i><span class="t-mark m2" style="left:20%">2s 문서</span><span class="t-mark m10" style="left:100%">10s 실무</span></div>
              <p class="t-note">시뮬레이션 연출값 · 문서 기준 약 2초, 실무 10초 이내</p>
            </div>
            <div class="phone"><div class="phone-head"></div><div class="phone-chat"></div></div>
          </section>
        </div>
        <p class="sim-info"></p>
      </div>
      <footer class="modal-foot">
        <div class="sim-legend"></div>
        <button type="button" class="btn" data-close>닫기</button>
      </footer>`;
    document.body.appendChild(dlg);
    stage = $(".sim-stage"); capEl = $(".a2p-cap"); infoEl = $(".sim-info");

    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest("[data-close]")) return close();
      const tb = e.target.closest("[data-tab]"); if (tb) return setTab(tb.dataset.tab);
      const ds = e.target.closest("[data-dest]"); if (ds) return setDest(ds.dataset.dest);
      const ty = e.target.closest("[data-type]"); if (ty) { setType(ty.dataset.type); if (auto) toggleAuto(); return; }
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (act === "send") a2pSend();
      if (act === "otp") otpRun(false);
      if (act === "fraud") otpRun(true);
      if (act === "auto") toggleAuto();
    });
    dlg.addEventListener("close", stop);
    new ResizeObserver(() => { const m = stage.clientWidth < 640 ? "v" : "h"; if (m !== mode) reset(); }).observe(stage);
  }

  function toggleAuto() {
    auto = !auto; autoT = 1.2;
    dlg.querySelectorAll('[data-act="auto"]').forEach((b) => { b.setAttribute("aria-pressed", String(auto)); b.textContent = auto ? "자동 재생 켜짐" : "자동 재생 꺼짐"; });
  }
  function setTab(t) {
    tab = t;
    dlg.querySelectorAll("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === t)));
    dlg.querySelectorAll("[data-panel]").forEach((p) => (p.hidden = p.dataset.panel !== t));
    reset();
  }
  function setDest(k) {
    dest = k;
    dlg.querySelectorAll("[data-dest]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.dest === k)));
    reset();
  }
  function setType(t) {
    type = t;
    dlg.querySelectorAll("[data-type]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.type === t)));
    // 국내 문자 기준 바이트: 한글 2byte, 영문·숫자 1byte
    const bytes = [...MSG[t].text].reduce((n, ch) => n + (ch.charCodeAt(0) > 0x7f ? 2 : 1), 0);
    $(".a2p-note").innerHTML =
      t === "sms" ? `단문 1건`
      : t === "lms" ? `장문 1건으로 도착 <span class="muted">· 일반 국제망은 90byte씩 ${Math.ceil(bytes / 90)}건으로 쪼개져 도착</span>`
      : `이미지 + 문구 1건으로 도착 <span class="muted">· 일반 국제망은 MMS 미지원</span>`;
  }

  // 탭·목적지·화면 방향이 바뀌면 진행 중인 흐름을 비우고 다시 그림
  function reset() {
    packets.forEach((p) => p.g.remove()); packets = []; timers = []; busy = false; autoT = 0.8;
    S = scene(tab, dest);
    draw(stage.clientWidth < 640 ? "v" : "h");
    capEl.textContent = "";
    const kr = dest === "kr", d = DEST[dest];
    const fromHtml = kr ? `<span class="ph-code">통신사 코드</span><b>+ 1588-0000</b>` : `<span class="ph-code">Sender ID</span><b>Zero∞</b>`;
    dlg.querySelectorAll(".phone-head").forEach((h) => (h.innerHTML = fromHtml));
    dlg.querySelectorAll(".phone-chat").forEach((c) => (c.innerHTML = ""));
    $(".a2p-from").innerHTML = kr ? `<b>대표번호</b> 1588-0000` : `<b>Sender ID</b> Zero∞ <span class="muted">· 대표번호 표시는 한국 경로 전용</span>`;
    $(".a2p-log").innerHTML = "";
    setType(type);
    $(".otp-field .cc").textContent = d.cc; $(".otp-field .num").textContent = d.num;
    resetOtpUi();
    $(".sim-legend").innerHTML = tab === "a2p"
      ? `<span><i class="dot lime"></i>발신 (MT)</span><span><i class="dot mint"></i>전달 결과 (DLR)</span><span><i class="dot amber"></i>답장 (MO)</span>`
      : `<span><i class="dot sky"></i>룩업 질의</span><span><i class="dot lime"></i>OTP 발송</span><span><i class="dot mint"></i>검증</span><span><i class="dot red"></i>차단</span>`;
  }

  /* ---------- 그리기 ---------- */
  function draw(m) {
    mode = m;
    const n = S.order.length;
    if (m === "h") {
      const a = 64, z = 1136;
      L = { w: 1200, h: 290, axis: 160, lane: 17, steps: S.order.map((_, i) => a + ((z - a) * i) / (n - 1)) };
    } else {
      L = { w: 420, axis: 110, lane: 17, steps: S.order.map((_, i) => 48 + i * 100) };
      L.h = L.steps[n - 1] + 64;
    }
    stage.innerHTML = "";
    svg = el("svg", { viewBox: `0 0 ${L.w} ${L.h}`, class: `sim-svg a2p ${m}`, role: "img", "aria-label": "국제 메시징 흐름도" }, stage);

    // 지역 구간
    const edge = (i, dir) => {
      if (dir < 0) return i === 0 ? 0 : (L.steps[i] + L.steps[i - 1]) / 2;
      return i === n - 1 ? (m === "h" ? L.w : L.h) : (L.steps[i] + L.steps[i + 1]) / 2;
    };
    S.bands.forEach((b, bi) => {
      const a = edge(S.order.indexOf(b.from), -1), z = edge(S.order.indexOf(b.to), 1);
      const g = el("g", { class: `band${b.hi ? " hi" : ""}${bi === 1 ? " us" : ""}` }, svg);
      if (m === "h") {
        el("rect", { x: a, y: 0, width: z - a, height: L.h, class: "band-bg" }, g);
        if (bi) el("line", { x1: a, y1: 14, x2: a, y2: L.h - 14, class: "band-edge" }, g);
        el("text", { x: a + 14, y: 28, class: "band-label" }, g).textContent = b.label;
        el("text", { x: a + 14, y: 44, class: "band-sub" }, g).textContent = b.sub;
      } else {
        el("rect", { x: 0, y: a, width: L.w, height: z - a, class: "band-bg" }, g);
        if (bi) el("line", { x1: 12, y1: a, x2: L.w - 12, y2: a, class: "band-edge" }, g);
        el("text", { x: L.w - 14, y: a + 24, class: "band-label", "text-anchor": "end" }, g).textContent = b.label;
        el("text", { x: L.w - 14, y: a + 40, class: "band-sub", "text-anchor": "end" }, g).textContent = b.sub;
      }
    });

    const lanePts = (lane, ids = S.order) => ids.map((id) => pt(id, lane).join(",")).join(" ");
    el("polyline", { points: lanePts(-1), class: "track" }, svg);
    el("polyline", { points: lanePts(1), class: "track" }, svg);
    el("polyline", { points: lanePts(-1), class: "flow" }, svg);
    el("polyline", { points: lanePts(1, S.order.slice().reverse()), class: `flow ${tab === "a2p" ? "mo" : "mint"}` }, svg);
    const [mx, my] = pt(S.order[1], -1), [ox, oy] = pt(S.order[1], 1), mid = pt(S.order[2]);
    const t1 = tab === "a2p" ? ["MT 발신 →", "MT ↓"] : ["요청 · 발송 →", "↓"];
    const t2 = tab === "a2p" ? ["← MO 답장", "MO ↑"] : ["← 응답 · 결과", "↑"];
    el("text", m === "h" ? { x: (mx + mid[0]) / 2, y: my - 8, class: "lane-tag", "text-anchor": "middle" } : { x: mx - 8, y: (my + mid[1]) / 2, class: "lane-tag", "text-anchor": "end" }, svg).textContent = m === "h" ? t1[0] : t1[1];
    el("text", m === "h" ? { x: (ox + mid[0]) / 2, y: oy + 18, class: `lane-tag ${tab === "a2p" ? "mo" : "mint"}`, "text-anchor": "middle" } : { x: ox + 8, y: (oy + mid[1]) / 2, class: `lane-tag ${tab === "a2p" ? "mo" : "mint"}` }, svg).textContent = m === "h" ? t2[0] : t2[1];

    for (const id of S.order) {
      const nd = NODES[id], [x, y] = pt(id);
      const label = id === "local" ? `${S.d.ko} MNO` : nd.label;
      const g = el("g", { class: `node n-${id}${id === "hub" ? " hero" : ""}`, transform: `translate(${x} ${y})`, tabindex: 0, role: "button", "aria-label": `${label}: ${nd.sub}` }, svg);
      if (id === "hub") el("circle", { r: 40, class: "ring" }, g);
      el("circle", { r: 31, class: "halo" }, g);
      el("circle", { r: 28, class: "disc" }, g);
      el("svg", { x: -11, y: -11, width: 22, height: 22, viewBox: "0 0 24 24", class: "ico" }, g).innerHTML = ICONS[nd.icon];
      const h = m === "h", off = id === "hub" ? 8 : 0;
      const at = h ? { x: 0, "text-anchor": "middle" } : { x: 44 + off, "text-anchor": "start" };
      el("text", { ...at, y: h ? 54 + off : -1, class: "n-label" }, g).textContent = label;
      el("text", { ...at, y: h ? 70 + off : 15, class: "n-sub" }, g).textContent = nd.sub;
      const show = () => { infoEl.innerHTML = `<b>${esc(label)}</b> ${esc(nd.desc)}`; };
      g.addEventListener("pointerenter", show); g.addEventListener("focus", show); g.addEventListener("click", show);
      nodeEls[id] = g;
    }
    gPk = el("g", { class: "packets" }, svg);
    infoEl.innerHTML = `<b>안내</b> 아이콘을 누르면 각 단계 설명이 나옵니다.`;
  }

  /* ---------- 패킷 엔진 ---------- */
  function flash(id, cls = "hit") {
    const g = nodeEls[id]; if (!g || !g.isConnected) return;
    g.classList.remove(cls); void g.getBBox(); g.classList.add(cls);
    clearTimeout(g["_t" + cls]); g["_t" + cls] = setTimeout(() => g.classList.remove(cls), 420);
  }
  function makePk(kind, shape) {
    const g = el("g", { class: `pk ${kind}${shape ? " big" : ""}` }, gPk);
    if (shape === "lms") { el("rect", { x: -9, y: -4, width: 18, height: 8, rx: 4, class: "pk-glow" }, g); el("rect", { x: -7, y: -2.6, width: 14, height: 5.2, rx: 2.6, class: "pk-core" }, g); }
    else if (shape === "mms") { el("rect", { x: -7, y: -7, width: 14, height: 14, rx: 3, class: "pk-glow" }, g); el("rect", { x: -4.5, y: -4.5, width: 9, height: 9, rx: 2, class: "pk-core" }, g); }
    else { el("circle", { r: shape ? 8 : 5, class: "pk-glow" }, g); el("circle", { r: shape ? 3.8 : 2, class: "pk-core" }, g); }
    return g;
  }
  function pathLen(ids, lane) {
    let s = 0;
    for (let i = 1; i < ids.length; i++) { const [a, b] = pt(ids[i - 1], lane), [c, d] = pt(ids[i], lane); s += Math.hypot(c - a, d - b); }
    return s;
  }
  // 경로를 따라 패킷을 보냄. cap(id, index)가 문자열을 돌려주면 캡션으로 표시
  function launch({ kind, ids, lane, speed = SPEED, shape, hit, cap, onArrive, onDone }) {
    const pts = ids.map((id) => pt(id, lane));
    packets.push({ kind, ids, pts, seg: 0, d: 0, speed, g: makePk(kind, shape), hit, cap, onArrive, onDone, x: pts[0][0], y: pts[0][1] });
  }
  function step(p, dt) {
    p.d += p.speed * dt;
    while (p.seg < p.pts.length - 1) {
      const [x1, y1] = p.pts[p.seg], [x2, y2] = p.pts[p.seg + 1];
      const len = Math.hypot(x2 - x1, y2 - y1);
      if (p.d < len) { const k = p.d / len; p.x = x1 + (x2 - x1) * k; p.y = y1 + (y2 - y1) * k; return; }
      p.d -= len; p.seg++;
      const id = p.ids[p.seg];
      if (p.hit) flash(id, p.hit);
      const c = p.cap?.(id, p.seg); if (c) capEl.textContent = c;
      p.onArrive?.(id);
    }
    p.done = true; p.g.remove(); p.onDone?.();
  }
  const numbered = (n, key) => (id) => `${CIRC[S.order.indexOf(id) + n] || "·"} ${NODES[id][key]}`;

  /* ---------- 공용 UI ---------- */
  function bubble(panel, side, html, cls = "") {
    const chat = $(`[data-panel="${panel}"] .phone-chat`);
    const b = document.createElement("div");
    b.className = `bubble ${side} ${cls}`;
    b.innerHTML = html;
    chat.appendChild(b);
    while (chat.children.length > 5) chat.firstChild.remove();
    requestAnimationFrame(() => b.classList.add("in"));
  }

  /* ---------- A2P 양방향 ---------- */
  function a2pSend() {
    if (busy || !running || tab !== "a2p") return;
    busy = true; $('[data-act="send"]').disabled = true;
    const id = ++seq, t = type, msg = MSG[t];
    const li = document.createElement("li");
    li.innerHTML = `<span class="mono">#${String(id).padStart(4, "0")}</span><span class="lg-msg">${esc(`${msg.name} · ${msg.text.split("\n")[0]}`)}</span><span class="chip">발송 요청</span>`;
    const log = $(".a2p-log"); log.prepend(li); while (log.children.length > 4) log.lastChild.remove();
    const chip = (text, cls) => { const c = li.querySelector(".chip"); c.textContent = text; c.className = `chip ${cls || ""}`; };
    flash("web");
    capEl.textContent = `① ${NODES.web.mt}`;
    const back = S.order.slice().reverse();
    launch({
      kind: "mt", ids: S.order, lane: -1, shape: t === "sms" ? true : t, hit: "hit", cap: numbered(0, "mt"),
      onDone: () => {
        const body = t === "mms" ? `<div class="mms-img" aria-hidden="true"></div>${esc(msg.text)}` : esc(msg.text).replace(/\n/g, "<br>");
        bubble("a2p", "in", `<span class="b-type">${msg.name}</span>${body}`);
        launch({ kind: "dlr", ids: back, lane: 1, speed: SPEED * 1.8, hit: "hit-dlr",
          cap: (nid) => (nid === "platform" ? "전달 결과(DLR) 회신 · 발송 건 상태 갱신" : ""),
          onArrive: (nid) => { if (nid === "platform") chip("전달 완료", "ok"); } });
        later(reduce ? 0.3 : 1.3, () => {
          const reply = REPLIES[(id - 1) % REPLIES.length];
          bubble("a2p", "out", esc(reply));
          launch({
            kind: "mo", ids: back, lane: 1, shape: true, hit: "hit-mo", cap: (nid) => `↩ ${NODES[nid].mo}`,
            onDone: () => {
              chip("답장 수신", "mo");
              const r = document.createElement("li"); r.className = "reply";
              r.innerHTML = `<span class="mono">↩</span><span class="lg-msg">${esc(reply)}</span><span class="chip mo">MO</span>`;
              li.after(r); flash("web", "hit-mo");
              later(0.4, () => { busy = false; $('[data-act="send"]').disabled = false; autoT = 2.2; });
            },
          });
        });
      },
    });
  }

  /* ---------- OTP · 룩업 ---------- */
  function resetOtpUi() {
    $(".otp-field .num").textContent = DEST[dest].num;
    dlg.querySelectorAll(".code-boxes span").forEach((s) => { s.textContent = ""; s.className = ""; });
    setStatus("인증번호를 요청하세요.");
    setLookup(null);
    setTimer(0, "");
    dlg.querySelectorAll('[data-act="otp"], [data-act="fraud"]').forEach((b) => (b.disabled = false));
    showOtpStats();
  }
  function showOtpStats() {
    $('[data-os="ok"]').textContent = otpStats.ok;
    $('[data-os="blocked"]').textContent = otpStats.blocked;
    const t = otpStats.times; $('[data-os="avg"]').textContent = t.length ? `${(t.reduce((a, b) => a + b, 0) / t.length).toFixed(1)}s` : "–";
  }
  function setStatus(text, cls = "") { const s = $(".otp-status"); s.textContent = text; s.className = `otp-status ${cls}`; }
  function setLookup(r, pending) {
    const st = $(".lk-state");
    st.textContent = pending ? "조회 중…" : r ? (r.valid ? "통과" : "차단") : "대기";
    st.className = `lk-state mono ${r ? (r.valid ? "ok" : "bad") : pending ? "run" : ""}`;
    const set = (k, v, cls = "") => { const dd = $(`[data-lk="${k}"]`); dd.textContent = v; dd.className = cls; };
    if (!r) { ["valid", "carrier", "ported", "roaming"].forEach((k) => set(k, pending ? "…" : "–")); return; }
    set("valid", r.valid ? "유효" : "무효 · 가상번호", r.valid ? "ok" : "bad");
    set("carrier", r.carrier); set("ported", r.ported); set("roaming", r.roaming, r.roaming.startsWith("로밍") ? "warn" : "");
  }
  function setTimer(sec, cls) {
    $(".t-val").textContent = `${sec.toFixed(1)}s`;
    $(".t-fill").style.width = `${Math.min(sec / 10, 1) * 100}%`;
    $(".timer").className = `timer ${cls || ""}`;
  }

  function otpRun(fraud) {
    if (busy || !running || tab !== "otp") return;
    busy = true;
    dlg.querySelectorAll('[data-act="otp"], [data-act="fraud"]').forEach((b) => (b.disabled = true));
    dlg.querySelectorAll(".code-boxes span").forEach((s) => { s.textContent = ""; s.className = ""; });
    setLookup(null); setTimer(0, "run");
    const d = DEST[dest];
    $(".otp-field .num").textContent = fraud ? "00-0000-0000" : d.num;
    setStatus(fraud ? "대량 요청 감지: 가짜 번호로 인증번호 요청" : "인증번호 요청", fraud ? "bad" : "");
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const target = 1.6 + Math.random() * 7.2; // 연출용 도착 시간 (초)
    const [svc, otp] = S.order;
    const toDest = S.order.slice(1, -1);            // otp → … → 목적지 MNO(HLR)
    const sendIds = S.order.slice(1);               // otp → … → 단말
    const tLookup = pathLen(toDest, -1) / (SPEED * 1.6) + pathLen(toDest.slice().reverse(), 1) / (SPEED * 1.6);
    const tSend = pathLen(sendIds, -1) / SPEED;
    const t0 = clock, total = tLookup + tSend;
    let timing = true;
    const tick = () => { if (!timing || !running) return; setTimer(Math.min(((clock - t0) / total) * target, target), "run"); later(0.05, tick); };
    tick();

    flash(svc);
    capEl.textContent = `① ${NODES.svc.mt}`;
    launch({
      kind: "mt", ids: [svc, otp], lane: -1, hit: "hit", cap: () => `② ${NODES.otp.mt}`,
      onDone: () => {
        setLookup(null, true);
        launch({
          kind: "lk", ids: toDest, lane: -1, speed: SPEED * 1.6, hit: "hit-lk",
          cap: (id) => `③ 룩업 · ${id === "hub" ? "Tier1 허브 경유" : id === toDest[toDest.length - 1] ? "목적지 HLR 질의" : NODES[id].label}`,
          onDone: () => launch({
            kind: "lk", ids: toDest.slice().reverse(), lane: 1, speed: SPEED * 1.6, hit: "hit-lk",
            cap: (id) => (id === otp ? "③ 룩업 결과 수신" : ""),
            onDone: () => {
              if (fraud) {
                timing = false; setTimer(0, "");
                setLookup({ valid: false, carrier: "확인 불가", ported: "–", roaming: "–" });
                flash(otp, "bad");
                capEl.textContent = "③ 룩업 결과 무효 → 발송 차단 · 문자 비용 0";
                setStatus("가짜 번호로 판단해 발송하지 않았습니다.", "bad");
                otpStats.blocked++; showOtpStats();
                later(1.8, () => { resetOtpUi(); busy = false; autoT = 1.6; });
                return;
              }
              const roam = Math.random() < 0.25;
              setLookup({
                valid: true,
                carrier: `${d.ko} ${CARRIERS[Math.floor(Math.random() * 3)]}`,
                ported: Math.random() < 0.3 ? "이동함 · 새 통신사로 라우팅" : "없음",
                roaming: roam ? `로밍 중 · 방문망으로 라우팅` : "국내",
              });
              launch({
                kind: "mt", ids: sendIds, lane: -1, shape: true, hit: "hit",
                cap: (id) => `④ OTP 발송 · ${id === "local" ? `${d.ko} MNO` : NODES[id].label}`,
                onDone: () => {
                  timing = false; setTimer(target, target <= 10 ? "done" : "late");
                  otpStats.times.push(target); showOtpStats();
                  bubble("otp", "in", `<span class="b-type">OTP</span>[Zero∞] 인증번호 <b class="otp-code">${code}</b><br>3분 안에 입력해 주세요.`);
                  setStatus(`인증번호 도착 · ${target.toFixed(1)}초`, "ok");
                  // 사용자가 한 자리씩 입력
                  const boxes = dlg.querySelectorAll(".code-boxes span");
                  [...code].forEach((ch, i) => later(0.6 + i * 0.16, () => { boxes[i].textContent = ch; boxes[i].className = "on"; }));
                  later(0.6 + 6 * 0.16 + 0.2, () => {
                    capEl.textContent = "⑤ 사용자가 인증번호 입력 → 검증 요청";
                    launch({
                      kind: "vf", ids: [svc, otp], lane: -1, hit: "hit-dlr",
                      onDone: () => launch({
                        kind: "vf", ids: [otp, svc], lane: 1, hit: "hit-dlr",
                        cap: (id) => (id === svc ? "⑥ 검증 통과 · 일치 · 유효시간 안 → 로그인 완료" : ""),
                        onDone: () => {
                          boxes.forEach((b) => (b.className = "ok"));
                          setStatus("인증 완료 · 로그인되었습니다.", "ok");
                          otpStats.ok++; showOtpStats();
                          later(2.2, () => { resetOtpUi(); busy = false; autoT = 1.4; });
                        },
                      }),
                    });
                  });
                },
              });
            },
          }),
        });
      },
    });
  }

  /* ---------- 루프 ---------- */
  function loop(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05) * (reduce ? 0.6 : 1);
    last = now; clock += dt;

    // 배경 트래픽
    ambientT -= dt;
    if (ambientT <= 0) {
      ambientT = 0.35 + Math.random() * 0.5;
      const back = Math.random() < 0.35, ids = S.order.slice(1);
      launch({ kind: back ? "amb mo" : "amb", ids: back ? ids.slice().reverse() : ids, lane: back ? 1 : -1, speed: SPEED * (0.8 + Math.random() * 0.4) });
    }
    // 자동 재생
    if (auto && !busy) {
      autoT -= dt;
      if (autoT <= 0) {
        if (tab === "a2p") { setType(["sms", "lms", "mms"][seq % 3]); a2pSend(); }
        else { const n = otpStats.ok + otpStats.blocked; otpRun(n % 4 === 3); }
      }
    }
    // 예약 실행
    const due = timers.filter((t) => t.at <= clock);
    timers = timers.filter((t) => t.at > clock);
    due.forEach((t) => t.fn());

    for (const p of packets) if (!p.done) step(p, dt);
    packets = packets.filter((p) => !p.done);
    for (const p of packets) p.g.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    raf = requestAnimationFrame(loop);
  }

  let opener = null;
  function open(from) {
    if (!dlg) build();
    opener = from || null;
    dlg.showModal();
    document.documentElement.classList.add("modal-open");
    running = true; last = performance.now();
    setTab(tab);
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }
  function close() { if (dlg?.open) dlg.close(); }
  function stop() {
    running = false; cancelAnimationFrame(raf);
    document.documentElement.classList.remove("modal-open");
    opener?.focus?.();
  }

  window.ZIDemos = Object.assign(window.ZIDemos || {}, { a2p: { open, close } });
})();
