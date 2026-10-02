/*
 * A.R.M — 이메일 → RCS → AI 자동응답 인터랙티브 데모 (사업 모델 페이지 팝업)
 * 고객 단말에서 보이는 5단계(메일 수신 → 열람 → 상담 신청 → 시스템 처리 → RCS 상담)를
 * 업종별 페르소나(의료 · 법률 · VIP)로 재생하고, 신뢰도가 낮은 질문은 상담원 이관을 보여준다.
 * 목표 수치 · 투자 조건은 넣지 않는다 (원본 자료 CONFIDENTIAL).
 */
(() => {
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

  const PERSONAS = {
    med: {
      label: "의료", brand: "OOO 클리닉", agent: "상담실장", mail: "멤버십 고객 전용 실시간 문자 상담 안내",
      chat: [
        ["in", "안녕하세요, OOO 클리닉 상담실장입니다. 신청해 주셔서 감사합니다. 어떤 부분이 궁금하세요?"],
        ["out", "눈매 교정 상담을 받아보고 싶어요."],
        ["in", "네, 정확한 안내는 원장님 대면 상담에서 드려요. 이번 주 상담 가능 시간은 화요일 11시, 목요일 15시입니다."],
        ["out", "목요일 3시로 할게요."],
      ],
      hard: "지난주 시술 부위가 붓고 아파요. 괜찮은 건가요?",
      slot: "목요일 15:00 · 원장 대면 상담",
    },
    law: {
      label: "법률", brand: "OOO 법률사무소", agent: "상담 사무장", mail: "비공개 문자 법률 상담 안내",
      chat: [
        ["in", "안녕하세요, OOO 법률사무소 상담 사무장입니다. 상담 내용은 담당 변호사 외에는 공유되지 않습니다."],
        ["out", "이혼 관련 상담을 받고 싶어요."],
        ["in", "네, 사건 내용은 변호사 상담에서 자세히 들을게요. 이번 주 가능 시간은 수요일 10시, 금요일 16시입니다."],
        ["out", "금요일 4시요."],
      ],
      hard: "상대방이 재산을 빼돌린 것 같은데 지금 바로 막을 수 있나요?",
      slot: "금요일 16:00 · 변호사 상담",
    },
    vip: {
      label: "VIP", brand: "OOO 프라이빗 라운지", agent: "전담 컨시어지", mail: "멤버십 전용 컨시어지 문자 상담 오픈",
      chat: [
        ["in", "안녕하세요, 전담 컨시어지입니다. 필요하신 일을 편하게 말씀해 주세요."],
        ["out", "다음 주 자산관리 상담을 잡고 싶어요."],
        ["in", "네, 담당 PB와 연결해 드릴게요. 가능한 시간은 월요일 14시, 수요일 10시입니다."],
        ["out", "월요일 2시로 부탁드려요."],
      ],
      hard: "지금 보유한 해외 주식을 전부 팔아야 할까요?",
      slot: "월요일 14:00 · 담당 PB 상담",
    },
  };

  const STEPS = [
    {
      k: "메일 수신", title: "STEP 01 · 이메일 푸시",
      cards: [
        ["TRIGGER", "관리자 화면에서 발송하면 <b>수신 동의한 고객 DB</b>에만 개인화 이메일이 나갑니다."],
        ["PUSH", "고객 휴대폰 잠금화면에 알림이 뜹니다. 광고 문구 대신 <b>'실시간 상담 가능'</b> 한 줄로 부담을 낮춥니다."],
      ],
      chips: ["수신동의 DB 전용", "AI 문구 생성", "광고법 키워드 필터"],
    },
    {
      k: "메일 열람", title: "STEP 02 · 버튼 하나짜리 이메일",
      cards: [
        ["CONTENT", "긴 설명 없이 <b>핵심 4줄 + 버튼 1개</b>. 웹페이지로 보내지 않고 바로 상담 신청으로 연결합니다."],
        ["WHY", "랜딩페이지 · 전화 상담 단계에서 고관여 고객이 가장 많이 이탈합니다. 그 단계를 없애는 것이 이 모델의 핵심입니다."],
      ],
      chips: ["24시간 상담", "전화 불필요", "비밀 보장"],
    },
    {
      k: "상담 신청", title: "STEP 03 · 입력 2개",
      cards: [
        ["FORM", "이름과 전화번호 <b>두 칸만</b> 받습니다. 개인정보 수집 · 마케팅 활용 동의를 같은 단계에서 받습니다."],
        ["DATA", "신청 즉시 암호화 저장되고, 전화번호가 <b>RCS 발송 큐</b>로 넘어갑니다."],
      ],
      chips: ["입력 2칸", "동의 레이어", "암호화 저장"],
    },
    {
      k: "시스템 처리", title: "STEP 04 · 자동 발송",
      cards: [
        ["PIPELINE", "신청 접수, 동의 확인, 업종별 전용 번호 매핑, <b>A2P RCS 발송</b> 순서로 처리됩니다. 고객은 아무것도 누르지 않아도 됩니다."],
        ["A2P", "시스템이 고객에게 직접 보내는 방식이라, 고객이 앱을 찾거나 번호를 저장할 필요가 없습니다."],
      ],
      chips: ["자동 발송", "통신사 직연동", "전용 번호"],
    },
    {
      k: "RCS 상담", title: "STEP 05 · 문자창에서 AI 상담 · 예약 확정",
      cards: [
        ["LOCK-IN", "기본 문자 앱에 <b>통신사 인증 브랜드 채널</b>로 도착합니다. 앱 설치 · 회원가입이 없습니다."],
        ["AI + FALLBACK", "업종별 AI 페르소나가 24시간 응대하고 예약 가능 시간을 먼저 제안합니다. <b>확신이 낮은 질문은 사람에게 넘깁니다.</b>"],
      ],
      chips: ["24/7 응대", "예약 슬롯 제안", "상담원 이관"],
    },
  ];

  const LOG = [
    ["RECV", "상담 신청 접수"],
    ["CONSENT", "수신 · 활용 동의 확인"],
    ["STORE", "암호화 저장"],
    ["MAP", "업종 전용 번호 매핑"],
    ["RCS", "A2P RCS 발송 요청"],
    ["DONE", "고객 단말 도착"],
  ];

  let dlg, opener = null, step = 0, persona = "med", run = 0;
  const $ = (s) => dlg.querySelector(s);

  function build() {
    dlg = document.createElement("dialog");
    dlg.className = "modal";
    dlg.setAttribute("aria-labelledby", "arm-title");
    dlg.innerHTML = `
      <header class="modal-head">
        <div>
          <p class="eyebrow"><span class="mono">MODEL</span>Interactive</p>
          <h2 id="arm-title">A.R.M 자동응답 마케팅</h2>
          <p class="modal-sub">이메일 한 통이 예약 확정까지 이어지는 흐름</p>
        </div>
        <button type="button" class="icon-btn" data-close aria-label="닫기">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </header>
      <div class="modal-body">
        <div class="demo-bar">
          <div class="dest"><span class="mono">업종</span>
            <div class="seg" role="radiogroup" aria-label="업종">${Object.entries(PERSONAS).map(([k, p]) => `
              <button type="button" role="radio" data-p="${k}" aria-checked="${k === persona}">${p.label}</button>`).join("")}
            </div>
          </div>
        </div>
        <div class="arm-grid">
          <ol class="arm-steps">${STEPS.map((s, i) => `
            <li data-s="${i}"><button type="button" data-go="${i}"><i class="mono">0${i + 1}</i>${s.k}</button></li>`).join("")}
          </ol>
          <div class="phone arm-phone"><div class="arm-screen" aria-live="polite"></div></div>
          <div class="a2p-console arm-panel">
            <p class="panel-head mono arm-title"></p>
            <div class="arm-cards"></div>
            <div class="chips arm-chips"></div>
          </div>
        </div>
      </div>
      <footer class="modal-foot">
        <div class="sim-controls">
          <button type="button" class="btn btn-sm-o" data-act="prev">이전</button>
          <button type="button" class="btn btn-sm-o" data-act="next">다음</button>
          <button type="button" class="btn btn-sm-o" data-act="hard" hidden>어려운 질문 보내기</button>
        </div>
        <button type="button" class="btn" data-close>닫기</button>
      </footer>`;
    document.body.appendChild(dlg);

    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest("[data-close]")) return close();
      const go = e.target.closest("[data-go]");
      if (go) return goTo(+go.dataset.go);
      const pb = e.target.closest("[data-p]");
      if (pb) { persona = pb.dataset.p; dlg.querySelectorAll("[data-p]").forEach((b) => b.setAttribute("aria-checked", String(b === pb))); return goTo(step); }
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (act === "prev") goTo(step - 1);
      if (act === "next") goTo(step === STEPS.length - 1 ? 0 : step + 1);
      if (act === "hard") hard();
      if (e.target.closest("[data-next]")) goTo(step + 1);
    });
    dlg.addEventListener("close", () => {
      run++;
      document.documentElement.classList.remove("modal-open");
      opener?.focus?.();
    });
  }

  /* ---------- 단말 화면 ---------- */
  const screens = {
    0: (p) => `
      <div class="arm-lock">
        <p class="arm-time mono">14:32</p>
        <p class="arm-date">토요일</p>
        <button type="button" class="arm-noti" data-next>
          <span class="arm-noti-top"><b>✉ 메일</b><span class="mono">지금</span></span>
          <b>${esc(p.brand)}</b>
          <span>${esc(p.mail)}</span>
        </button>
        <p class="arm-hint mono">알림을 눌러 보세요</p>
      </div>`,
    1: (p) => `
      <div class="arm-mail">
        <p class="arm-from"><b>${esc(p.brand)}</b><span class="mono">받은편지함</span></p>
        <h4>지금 바로 문자로 상담하세요</h4>
        <ul>
          <li>24시간 바로 답변</li>
          <li>전화 없이 문자로만</li>
          <li>상담 내용 비밀 보장</li>
          <li>${esc(p.agent)} 1:1 연결</li>
        </ul>
        <button type="button" class="btn btn-primary arm-cta" data-next>실시간 상담 신청</button>
        <p class="arm-fine">수신 동의 고객에게 발송 · 수신거부</p>
      </div>`,
    2: (p) => `
      <div class="arm-form">
        <p class="arm-from"><b>${esc(p.brand)}</b><span class="mono">상담 신청</span></p>
        <div class="arm-field"><span>이름</span><b>홍길동</b></div>
        <div class="arm-field"><span>전화번호</span><b class="mono">010-••••-1234</b></div>
        <p class="arm-fine">✓ 개인정보 수집 · 마케팅 활용 동의</p>
        <button type="button" class="btn btn-primary arm-cta" data-next>신청하기</button>
      </div>`,
    3: () => `
      <div class="arm-sys">
        <p class="panel-head mono">SYSTEM</p>
        <ul class="arm-log">${LOG.map(([k, t]) => `<li><span class="mono">${k}</span>${t}</li>`).join("")}</ul>
        <div class="t-bar"><div class="t-fill arm-fill"></div></div>
      </div>`,
    4: (p) => `
      <div class="phone-head arm-rcs-head"><b>${esc(p.brand)}</b><span class="chip ok">인증 채널</span></div>
      <div class="phone-chat arm-chat"></div>`,
  };

  function goTo(s) {
    if (s < 0 || s >= STEPS.length) return;
    step = s;
    const id = ++run, p = PERSONAS[persona], st = STEPS[s];
    dlg.querySelectorAll(".arm-steps li").forEach((li) => {
      const i = +li.dataset.s;
      li.className = i === s ? "now" : i < s ? "done" : "";
    });
    $(".arm-screen").innerHTML = screens[s](p);
    $(".arm-title").textContent = st.title;
    $(".arm-cards").innerHTML = st.cards.map(([t, b]) => `<div class="arm-card"><p class="mono">${t}</p><p>${b}</p></div>`).join("");
    $(".arm-chips").innerHTML = st.chips.map((c) => `<span>${esc(c)}</span>`).join("");
    $('[data-act="prev"]').disabled = s === 0;
    $('[data-act="next"]').textContent = s === STEPS.length - 1 ? "처음부터" : "다음";
    $('[data-act="hard"]').hidden = s !== 4;
    $('[data-act="hard"]').disabled = true;
    if (s === 3) playLog(id);
    if (s === 4) playChat(id, p);
  }

  async function playLog(id) {
    const items = dlg.querySelectorAll(".arm-log li"), fill = $(".arm-fill");
    for (let i = 0; i < items.length; i++) {
      await wait(380);
      if (id !== run) return;
      items[i].classList.add("on");
      fill.style.width = `${((i + 1) / items.length) * 100}%`;
    }
    await wait(700);
    if (id === run) goTo(4);
  }

  const bubble = (chat, side, html, cls = "") => {
    const b = document.createElement("div");
    b.className = `bubble ${side === "out" ? "out" : ""} ${cls}`;
    b.innerHTML = html;
    chat.appendChild(b);
    requestAnimationFrame(() => b.classList.add("in"));
    return b;
  };

  async function playChat(id, p) {
    const chat = $(".arm-chat");
    for (const [side, text] of p.chat) {
      await wait(side === "in" ? 900 : 700);
      if (id !== run) return;
      bubble(chat, side, esc(text));
    }
    await wait(800);
    if (id !== run) return;
    bubble(chat, "in", `<b>✓ 예약이 확정되었습니다</b><br><span class="arm-fine">${esc(p.slot)} · 전날 알림을 보내드려요</span>`, "arm-confirm");
    $('[data-act="hard"]').disabled = false;
  }

  async function hard() {
    const id = run, p = PERSONAS[persona], chat = $(".arm-chat");
    $('[data-act="hard"]').disabled = true;
    bubble(chat, "out", esc(p.hard));
    await wait(700);
    if (id !== run) return;
    bubble(chat, "in", `<span class="chip mo">AI 확신 낮음 · 상담원 이관</span>`, "arm-sysmsg");
    await wait(700);
    if (id !== run) return;
    bubble(chat, "in", "이 질문은 담당자가 직접 확인하고 답변드릴게요. 잠시만 기다려 주세요.");
    chat.scrollTop = chat.scrollHeight;
  }

  function open(from) {
    if (!dlg) build();
    opener = from || null;
    dlg.showModal();
    document.documentElement.classList.add("modal-open");
    goTo(0);
  }
  function close() { if (dlg?.open) dlg.close(); }

  window.ZIDemos = Object.assign(window.ZIDemos || {}, { arm: { open, close } });
})();
