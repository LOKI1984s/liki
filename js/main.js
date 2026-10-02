(() => {
  const d = PORTFOLIO;
  const p = d.profile;
  const page = document.body.dataset.page;
  const $ = (id) => document.getElementById(id);
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const link = (href, text, cls = "") =>
    href ? `<a class="${cls}" href="${esc(href)}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ""}>${esc(text)}</a>` : `<span class="${cls}">${esc(text)}</span>`;
  const accent = (s) => esc(s).replace(/\*(.+?)\*/g, '<em class="grad">$1</em>');
  const arrow = `<svg class="arr" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5 4h7v7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;

  const PAGES = [
    { key: "models", href: "models.html", label: "사업 모델", en: "Business Models", lead: "문제, 모델, 구조, 수익으로 정리한 초기 모델링과 서비스 기획 사례" },
    { key: "partners", href: "partners.html", label: "제휴·실적", en: "Partnerships", lead: "통신사 · 글로벌 파트너 제휴와 공급 레퍼런스" },
    { key: "history", href: "history.html", label: "경력", en: "Career", lead: "회사별 직급과 담당 업무" },
    { key: "skills", href: "skills.html", label: "역량", en: "Capabilities", lead: "사업을 설계하고 연결하는 방법" },
    { key: "contact", href: "contact.html", label: "연락", en: "Contact", lead: "다음 사업 모델을 함께 설계합니다" },
  ];
  const num = (i) => String(i + 1).padStart(2, "0");
  // 방문자 카운터 배지: 오늘 / 전체 (로컬 미리보기는 -local 키로 따로 집계해 실제 수치를 늘리지 않음)
  const counter = () => {
    const c = p.counter;
    if (!c?.key) return "";
    const key = location.hostname.endsWith("github.io") ? c.key : `${c.key}-local`;
    const q = new URLSearchParams({ view: "today-total", style: "flat-square", label: c.label || "VISITORS", color: "2f3d0f", labelColor: "16181b" });
    return `<img class="hits" src="https://hits.sh/${key}.svg?${q}" alt="방문자 수 (오늘 / 전체)" height="20" referrerpolicy="no-referrer">`;
  };
  // 사업 모델 카드 버튼: 데모 버튼 + (있으면) 서류 바로 보기 버튼
  const actions = (pr) => `
    <div class="model-actions">
      <button type="button" class="btn btn-sm model-demo" data-demo="${esc(pr.demo)}">
        <span class="live"><span class="pulse"></span></span>${esc(pr.demoLabel || "구조 보기")} ${arrow}
      </button>
      ${(pr.showcase?.docs || []).map((dc, di) => `
      <button type="button" class="btn btn-sm model-demo model-doc" data-demo="${esc(pr.demo)}" data-doc="${di}">${esc(dc.button || dc.title)} ${arrow}</button>`).join("")}
    </div>`;
  const idx = PAGES.findIndex((x) => x.key === page);

  /* ---------- Nav ---------- */
  $("nav").innerHTML = `
    <nav class="nav">
      <a href="index.html" class="brand" aria-label="${esc(p.brand)} 홈"><span class="brand-mark">${esc(p.mark)}</span><span class="brand-name">${esc(p.brand)}</span>${p.tagline ? `<span class="brand-tag">${esc(p.tagline)}</span>` : ""}</a>
      <ul class="menu">
        ${PAGES.map((x) => `<li><a href="${x.href}" data-key="${x.key}"${x.key === page ? ' class="active" aria-current="page"' : ""}>${x.label}</a></li>`).join("")}
      </ul>
      <button class="menu-toggle" aria-label="메뉴" aria-expanded="false"><span></span><span></span></button>
    </nav>`;
  const toggle = document.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", open);
  });
  document.title = idx >= 0 ? `${PAGES[idx].label} | ${p.brand}` : `${p.brand} | ${p.tagline || p.role}`;

  /* ---------- Blocks ---------- */
  const metricCell = (m) => `
    <div class="metric">
      <div class="metric-value" data-count="${esc(m.value)}">${esc(m.value)}</div>
      <div class="metric-label">${esc(m.label)}</div>
    </div>`;

  const meter = (lv) =>
    lv ? `<span class="meter" aria-label="${lv}/5">${Array.from({ length: 5 }, (_, i) => `<i${i < lv ? ' class="on"' : ""}></i>`).join("")}</span>` : "";


  const pageHead = () => {
    const x = PAGES[idx];
    return `
      <header class="page-head reveal">
        <p class="eyebrow"><span class="mono">${num(idx)} / ${num(PAGES.length - 1)}</span>${x.en}</p>
        <h1>${x.label}</h1>
        <p class="lead">${x.lead}</p>
      </header>`;
  };

  const render = {
    home() {
      return `
        <section class="intro">
          <div class="intro-text">
            <p class="eyebrow rise" style="--i:0"><span class="mono">&gt;_</span><span class="typer" aria-live="polite"></span><span class="caret"></span></p>
            <h1 class="intro-name">${p.brand.split(" ").map((w) => `<span data-scramble="${esc(w)}">${esc(w)}</span>`).join("")}</h1>
            <p class="intro-by rise" style="--i:1">${esc(p.tagline || p.role)}</p>
            <p class="intro-headline rise" style="--i:2">${accent(p.headline)}</p>
            ${p.stats?.length ? `<dl class="intro-stats rise" style="--i:2">${p.stats.map((s) => `
              <div><dt class="mono" data-count="${esc(s.value)}">${esc(s.value)}</dt><dd>${esc(s.label)}</dd></div>`).join("")}
            </dl>` : ""}
            <nav class="intro-index" aria-label="페이지">
              ${PAGES.map((x, i) => `
                <a href="${x.href}" data-key="${x.key}" class="rise" style="--i:${3 + i}">
                  <span class="mono">${num(i)}</span>
                  <b>${x.label}</b>
                  <span class="en">${x.en}</span>
                  ${arrow}
                </a>`).join("")}
            </nav>
          </div>
          <div class="hud hud-l mono rise" style="--i:6">
            <span>SYS // ${esc(p.mark)}</span>
            <span>KST <b id="hud-clock">--:--:--</b></span>
            ${counter()}
          </div>
          <div class="hud hud-r mono rise" style="--i:6">
            <span>PARTICLES <b id="hud-n">0</b></span>
            <span>FPS <b id="hud-fps">0</b></span>
            <span class="hud-hint">CLICK TO PULSE</span>
          </div>
        </section>`;
    },

    skills() {
      return pageHead() + `<div class="skills">${d.skills.map((g, gi) => `
        <section class="skill-group card reveal">
          <div class="card-top"><span class="mono">${num(gi)}</span>${esc(g.category)}</div>
          <ul>${g.items.map((s) => `
            <li>
              <div class="skill-head"><span>${esc(s.name)}</span>${meter(s.level)}</div>
              ${s.note ? `<p>${esc(s.note)}</p>` : ""}
              ${s.cases?.length || s.partners ? `<p class="skill-cases">${(s.cases || []).filter((ci) => d.models[ci]).map((ci) =>
                `<a href="models.html#model-${num(ci)}">${esc(d.models[ci].short || d.models[ci].title)}</a>`).join("")}${s.partners ? `<a href="partners.html">제휴·실적</a>` : ""}</p>` : ""}
            </li>`).join("")}
          </ul>
        </section>`).join("")}</div>`;
    },

    history() {
      return pageHead() + `<ol class="timeline">${d.history.map((h) => `
        <li class="reveal">
          <div class="tl-period mono">${esc(h.period)}</div>
          <div class="tl-body">
            <span class="tag">${esc(h.type)}</span>
            <h3>${esc(h.title)}</h3>
            ${h.sub ? `<p class="muted">${esc(h.sub)}</p>` : ""}
            ${h.desc ? `<p class="tl-desc">${esc(h.desc)}</p>` : ""}
            ${h.tasks?.length ? `<ul class="tl-tasks">${h.tasks.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
          </div>
        </li>`).join("")}</ol>`;
    },

    models() {
      return pageHead() + `<div class="projects">${d.models.map((pr, i) => `
        <article class="project card reveal" id="model-${num(i)}">
          <div class="project-side">
            <span class="mono accent">Model ${num(i)} · ${esc(pr.field)}</span>
            <h2>${esc(pr.title)}</h2>
            <p class="project-summary">${esc(pr.summary)}</p>
            <dl class="meta">
              <dt>기간</dt><dd class="mono">${esc(pr.period)}</dd>
              <dt>역할</dt><dd>${esc(pr.role)}</dd>
            </dl>
            <div class="chips">${pr.chips.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
            ${pr.demo && !pr.showcase?.docs?.length ? actions(pr) : ""}
          </div>
          <div class="project-main">
            ${pr.image ? `<img class="project-img" src="${esc(pr.image)}" alt="${esc(pr.title)}">` : ""}
            ${pr.metrics?.length ? `<div class="metrics metrics-sm">${pr.metrics.map(metricCell).join("")}</div>` : ""}
            <ol class="steps">${pr.points.map((x) => {
              const m = x.match(/^\[([^\]]+)\]\s*(.*)$/);
              return m && m[2] ? `<li><span class="step-k">${esc(m[1])}</span><span>${esc(m[2])}</span></li>` : `<li><span>${esc(x)}</span></li>`;
            }).join("")}</ol>
          </div>
          ${pr.demo && pr.showcase?.docs?.length ? `<div class="project-foot">${actions(pr)}</div>` : ""}
        </article>`).join("")}</div>` + (d.partnerships?.length ? `
        <section class="pm-section">
          <header class="pm-head reveal">
            <p class="eyebrow"><span class="mono">+${d.partnerships.length}</span>Partnership Models</p>
            <h2>${esc(d.partnershipsIntro?.title || "")}</h2>
            <p class="lead">${esc(d.partnershipsIntro?.lead || "")}</p>
          </header>
          <div class="pmodels">${d.partnerships.map((pm, i) => `
            <article class="card pm reveal">
              <div class="card-top"><span class="mono">P${num(i)}</span><span class="pm-field">${esc(pm.field)}</span></div>
              <span class="pm-tag mono">Open for Partnership</span>
              <h3 class="card-title">${esc(pm.title)}</h3>
              <p class="card-text">${esc(pm.summary)}</p>
              ${pm.targets?.length ? `<div class="pm-targets"><p>적용 대상</p><ul>${pm.targets.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>` : ""}
              <ol class="steps">${pm.points.map((x) => {
                const m = x.match(/^\[([^\]]+)\]\s*(.*)$/);
                return m ? `<li${m[1] === "제휴" ? ' class="pm-deal"' : ""}><span class="step-k">${esc(m[1])}</span><span>${esc(m[2])}</span></li>` : `<li><span>${esc(x)}</span></li>`;
              }).join("")}</ol>
              <div class="pm-foot">
                <div class="chips">${pm.chips.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
                ${pm.demo ? `<button type="button" class="btn btn-sm model-demo" data-demo="${esc(pm.demo)}"${pm.demoScene != null ? ` data-scene="${pm.demoScene}"` : ""}>
                  <span class="live"><span class="pulse"></span></span>${esc(pm.demoLabel || "구조 보기")} ${arrow}
                </button>` : ""}
              </div>
            </article>`).join("")}
          </div>
        </section>` : "");
    },

    partners() {
      const count = (g) => g.items.reduce((n, r) => n + r.name.split(" · ").length, 0);
      const [lead, ...rest] = d.partners;
      const group = (g, gi, wide) => `
        <section class="card pt-group reveal${wide ? " pt-wide" : ""}">
          <div class="card-top"><span class="mono">${num(gi)}</span>${esc(g.category)}<span class="pt-count mono">${count(g)}</span></div>
          <ul class="pt-list">${[...g.items].sort((x, y) => parseInt(y.year) - parseInt(x.year)).map((r) => `
            <li>
              <span class="pt-year mono">${esc(r.year)}</span>
              <span class="pt-body"><b>${esc(r.name)}</b>${r.desc ? `<span>${esc(r.desc)}</span>` : ""}</span>
            </li>`).join("")}
          </ul>
        </section>`;
      return pageHead() + `
        <div class="metrics pt-metrics reveal">${d.partners.filter((g) => g.metric !== false).map((g) => metricCell({ value: String(count(g)), label: g.category })).join("")}</div>
        <div class="pt-grid">
          ${lead ? group(lead, 0, true) : ""}
          ${[0, 1].map((c) => `<div class="pt-col">${rest.map((g, i) => (i % 2 === c ? group(g, i + 1) : "")).join("")}</div>`).join("")}
        </div>
        <p class="pt-note muted small">제휴 · 공급 관계만 표기합니다. 계약 조건과 금액은 공개하지 않습니다.</p>`;
    },

    contact() {
      return pageHead() + `
        <section class="card contact-card reveal">
          <p class="project-summary">${esc(p.summary)}</p>
          <ul class="contacts">
            ${p.contacts.map((c) => `<li><span class="muted">${esc(c.label)}</span>${link(c.href, c.value)}</li>`).join("")}
          </ul>
          ${p.resume ? `<a class="btn btn-primary" href="${esc(p.resume)}" download>이력서 PDF ${arrow}</a>` : ""}
        </section>`;
    },
  };

  $("content").innerHTML = render[page]();

  /* ---------- Footer ---------- */
  const prev = idx > 0 ? PAGES[idx - 1] : idx === 0 ? { href: "index.html", label: "홈" } : null;
  const next = idx >= 0 && idx < PAGES.length - 1 ? PAGES[idx + 1] : null;
  if (page === "home") $("footer").remove();
  else $("footer").innerHTML = `
    ${idx >= 0 ? `
      <nav class="pager">
        ${prev ? `<a href="${prev.href}"><small>Prev</small>${prev.label}</a>` : "<span></span>"}
        ${next ? `<a href="${next.href}" class="next"><small>Next</small>${next.label}</a>` : "<span></span>"}
      </nav>` : ""}
    ${page === "contact" ? "" : `
    <section class="cta reveal">
      <p class="eyebrow">Let's build</p>
      <h2>다음 사업 모델을<br><em class="grad">함께 설계합니다.</em></h2>
      <ul class="contacts">
        ${p.contacts.map((c) => `<li><span class="muted">${esc(c.label)}</span>${link(c.href, c.value)}</li>`).join("")}
      </ul>
    </section>`}
    <p class="copy"><span>© ${new Date().getFullYear()} ${esc(p.name)}</span>${counter()}<span class="mono">${esc(p.role)}</span></p>`;

  /* ---------- Motion ---------- */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Count-up: 실제 숫자일 때만 (대괄호 자리표시자는 그대로)
  const countUp = (el) => {
    const raw = el.dataset.count;
    const m = raw.match(/^([^\d\[]*)(\d[\d,]*\.?\d*)(.*)$/);
    if (!m || reduce) return;
    const [, pre, n, post] = m;
    const target = parseFloat(n.replace(/,/g, ""));
    const dec = (n.split(".")[1] || "").length;
    const comma = n.includes(",");
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 1400);
      const v = target * (1 - Math.pow(1 - k, 4));
      let s = v.toFixed(dec);
      if (comma) s = Number(s).toLocaleString("en-US", { minimumFractionDigits: dec });
      el.textContent = pre + s + post;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      e.target.querySelectorAll("[data-count]").forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.setProperty("--d", `${Math.min(i, 6) * 60}ms`);
    io.observe(el);
  });

  if (page === "home") {
    setTimeout(() => document.querySelectorAll(".intro-stats [data-count]").forEach(countUp), 600);

    // 이름 디코딩(스크램블) 효과
    const GLYPHS = "!<>-_\\/[]{}—=+*^?#01ABCDEF";
    document.querySelectorAll("[data-scramble]").forEach((el) => {
      const text = el.dataset.scramble;
      if (reduce) return;
      let frame = 0;
      const total = 42;
      const run = () => {
        el.textContent = [...text].map((ch, i) => {
          if (ch === " ") return " ";
          return frame > (i / text.length) * total * 0.7 + 8 ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }).join("");
        if (frame++ < total) requestAnimationFrame(run);
        else el.textContent = text;
      };
      setTimeout(run, 250);
    });

    // 역할 타이핑 순환
    const typer = document.querySelector(".typer");
    const roles = p.roles?.length ? p.roles : [p.role];
    if (typer) {
      if (reduce) typer.textContent = roles[0];
      else {
        let ri = 0, ci = 0, del = false;
        const loop = () => {
          const word = roles[ri];
          typer.textContent = word.slice(0, ci);
          if (!del && ci === word.length) { del = true; return setTimeout(loop, 1800); }
          if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
          ci += del ? -1 : 1;
          setTimeout(loop, del ? 35 : 70);
        };
        setTimeout(loop, 700);
      }
    }

    // HUD 시계 (KST)
    const clock = $("hud-clock");
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick(); setInterval(tick, 1000);
  }

  // 인터랙티브 데모 팝업
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-demo]");
    if (b) window.ZIDemos?.[b.dataset.demo]?.open(b);
  });

  // 페이지 전환: 내부 페이지 링크는 화면을 덮은 뒤 이동 (홈은 ∞가 0으로 빨려 들어감)
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === "_blank") return;
    const href = a.getAttribute("href");
    if (!/^(\.\/|[\w-]+\.html)$/.test(href)) return;
    e.preventDefault();
    if (document.body.classList.contains("leaving")) return;
    document.body.classList.add("leaving");
    dispatchEvent(new CustomEvent("zi:leave", { detail: { key: a.dataset.key || "" } }));
    const wait = reduce ? 0 : page === "home" && document.body.classList.contains("gl-ready") ? 720 : 320;
    setTimeout(() => { location.href = a.href; }, wait);
  });
  addEventListener("pageshow", (e) => { if (e.persisted) document.body.classList.remove("leaving"); });

  // 카드 스포트라이트
  document.querySelectorAll(".card").forEach((c) => {
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${e.clientX - r.left}px`);
      c.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  // 스크롤 시 네비 상태
  const onScroll = () => document.body.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
