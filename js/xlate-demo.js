/*
 * AI 동시번역 메시징 중계 — 인터랙티브 데모 (사업 모델 페이지 · 제휴 모델 팝업)
 * 한국 고객 ↔ 현지 파트너가 각자 모국어로 문자를 보내면, 중계 서버가
 * 수신 → 언어 감지 → 번역 → 발송을 거쳐 상대 언어로 전달한다. 원문은 함께 보관된다.
 * 버튼의 data-scene 값으로 시작 시나리오를 고른다.
 */
(() => {
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

  const SCENES = [
    {
      tab: "구매대행 · 중국", a: { name: "한국 고객", num: "+82 10-••••-2481", lang: "KO" },
      b: { name: "현지 판매자", num: "+86 138-••••-5520", lang: "ZH" },
      msgs: [
        ["a", "안녕하세요, 이 가방 검은색 재고 있나요?", "您好，这款包还有黑色的库存吗？"],
        ["b", "네, 검은색은 3개 남아 있어요. 오늘 주문하시면 내일 발송해요.", "有的，黑色还有3个，今天下单明天发货。"],
        ["a", "그럼 2개 주문할게요. 한국까지 배송비는 얼마예요?", "那我订2个。寄到韩国的运费是多少？"],
        ["b", "2개 합배송하면 배송비는 35위안이에요.", "两个一起寄，运费是35元人民币。"],
      ],
    },
    {
      tab: "해외직구 CS · 베트남", a: { name: "한국 고객", num: "+82 10-••••-7730", lang: "KO" },
      b: { name: "현지 판매자", num: "+84 90-••••-118", lang: "VI" },
      msgs: [
        ["a", "주문한 상품이 아직 도착하지 않았어요. 언제 오나요?", "Sản phẩm tôi đặt vẫn chưa đến. Khi nào thì tới ạ?"],
        ["b", "주문하신 상품은 통관 중이며, 2일 안에 도착할 예정이에요.", "Đơn hàng của bạn đang ở hải quan, dự kiến giao trong 2 ngày tới."],
        ["a", "감사합니다. 도착하면 문자로 알려주세요.", "Cảm ơn. Khi hàng đến, hãy nhắn tin cho tôi nhé."],
        ["b", "네, 배송되는 즉시 문자로 알려드릴게요.", "Vâng, chúng tôi sẽ gửi tin nhắn ngay khi giao hàng."],
      ],
    },
    {
      tab: "유학 상담 · 미국", a: { name: "한국 학생", num: "+82 10-••••-0915", lang: "KO" },
      b: { name: "현지 어학원", num: "+1 213-•••-4402", lang: "EN" },
      msgs: [
        ["a", "9월 학기 등록 마감이 언제인가요?", "When is the registration deadline for the September term?"],
        ["b", "마감은 7월 31일이에요. 신청서를 보내드릴까요?", "The deadline is July 31. Would you like us to send the application form?"],
        ["a", "네, 보내주세요. 기숙사도 신청할 수 있나요?", "Yes, please send it. Can I also apply for the dormitory?"],
        ["b", "네, 같은 신청서에서 기숙사도 함께 신청할 수 있어요.", "Yes, you can apply for housing on the same form."],
      ],
    },
  ];
  const PIPE = ["수신", "언어 감지", "번역 · 용어집", "발송"];

  let dlg, opener = null, scene = 0, run = 0, count = 0;
  const $ = (s) => dlg.querySelector(s);

  function build() {
    dlg = document.createElement("dialog");
    dlg.className = "modal";
    dlg.setAttribute("aria-labelledby", "xl-title");
    dlg.innerHTML = `
      <header class="modal-head">
        <div>
          <p class="eyebrow"><span class="mono">PARTNERSHIP</span>Interactive</p>
          <h2 id="xl-title">AI 동시번역 메시징 중계</h2>
          <p class="modal-sub">각자 모국어로 보내고 각자 모국어로 받습니다</p>
        </div>
        <button type="button" class="icon-btn" data-close aria-label="닫기">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </header>
      <div class="modal-body">
        <div class="tabs" role="tablist">${SCENES.map((s, i) => `
          <button type="button" class="tab" role="tab" data-scene="${i}">${esc(s.tab)}</button>`).join("")}
        </div>
        <div class="xl-grid">
          <div class="phone xl-phone" data-side="a">
            <div class="phone-head"><b class="xl-name-a"></b><span class="chip mono xl-lang-a"></span></div>
            <p class="xl-num mono xl-num-a"></p>
            <div class="phone-chat xl-chat-a"></div>
          </div>
          <div class="a2p-console xl-relay">
            <p class="panel-head mono">AI RELAY</p>
            <div class="xl-pair mono"><span class="xl-from">KO</span><i></i><span class="xl-to">ZH</span></div>
            <ol class="xl-pipe">${PIPE.map((p) => `<li>${p}</li>`).join("")}</ol>
            <div class="xl-stats">
              <div><span>번역 전달</span><b class="mono xl-count">0</b></div>
              <div><span>원문 보관</span><b class="mono">ON</b></div>
            </div>
            <p class="xl-note">번호 매핑으로 두 사람의 대화가 하나의 스레드로 이어집니다. 확신이 낮은 번역은 상담원 검수로 넘깁니다.</p>
          </div>
          <div class="phone xl-phone" data-side="b">
            <div class="phone-head"><b class="xl-name-b"></b><span class="chip mono xl-lang-b"></span></div>
            <p class="xl-num mono xl-num-b"></p>
            <div class="phone-chat xl-chat-b"></div>
          </div>
        </div>
      </div>
      <footer class="modal-foot">
        <div class="sim-controls">
          <button type="button" class="btn btn-sm-o" data-act="replay">다시 재생</button>
        </div>
        <button type="button" class="btn" data-close>닫기</button>
      </footer>`;
    document.body.appendChild(dlg);
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest("[data-close]")) return close();
      const t = e.target.closest(".tab");
      if (t) return play(+t.dataset.scene);
      if (e.target.closest('[data-act="replay"]')) play(scene);
    });
    dlg.addEventListener("close", () => {
      run++;
      document.documentElement.classList.remove("modal-open");
      opener?.focus?.();
    });
  }

  const bubble = (chat, out, text, orig) => {
    const b = document.createElement("div");
    b.className = `bubble${out ? " out" : ""}`;
    b.innerHTML = esc(text) + (orig ? `<span class="xl-orig">원문 · ${esc(orig)}</span>` : "");
    chat.appendChild(b);
    requestAnimationFrame(() => b.classList.add("in"));
    chat.scrollTop = chat.scrollHeight;
  };

  async function play(i) {
    scene = i;
    const id = ++run, sc = SCENES[i];
    count = 0;
    dlg.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(+t.dataset.scene === i)));
    for (const k of ["a", "b"]) {
      $(`.xl-name-${k}`).textContent = sc[k].name;
      $(`.xl-lang-${k}`).textContent = sc[k].lang;
      $(`.xl-num-${k}`).textContent = sc[k].num;
      $(`.xl-chat-${k}`).innerHTML = "";
    }
    $(".xl-count").textContent = "0";
    const pipe = [...dlg.querySelectorAll(".xl-pipe li")];
    pipe.forEach((li) => (li.className = ""));

    for (const [from, ko, foreign] of sc.msgs) {
      await wait(900);
      if (id !== run) return;
      const to = from === "a" ? "b" : "a";
      const sent = from === "a" ? ko : foreign, got = from === "a" ? foreign : ko;
      bubble($(`.xl-chat-${from}`), true, sent);
      $(".xl-from").textContent = sc[from].lang;
      $(".xl-to").textContent = sc[to].lang;
      $(".xl-pair").classList.toggle("rev", from === "b");
      for (let s = 0; s < pipe.length; s++) {
        pipe.forEach((li, j) => (li.className = j < s ? "done" : j === s ? "now" : ""));
        await wait(320);
        if (id !== run) return;
      }
      pipe.forEach((li) => (li.className = "done"));
      bubble($(`.xl-chat-${to}`), false, got, sent);
      $(".xl-count").textContent = String(++count);
    }
  }

  function open(from) {
    if (!dlg) build();
    opener = from || null;
    dlg.showModal();
    document.documentElement.classList.add("modal-open");
    const s = +(from?.dataset?.scene ?? 0);
    play(Number.isInteger(s) && SCENES[s] ? s : 0);
  }
  function close() { if (dlg?.open) dlg.close(); }

  window.ZIDemos = Object.assign(window.ZIDemos || {}, { xlate: { open, close } });
})();
