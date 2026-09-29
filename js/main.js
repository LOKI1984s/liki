(() => {
  const d = PORTFOLIO;
  const p = d.profile;
  const page = document.body.dataset.page;
  const $ = (id) => document.getElementById(id);
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const link = (href, text, cls = "") =>
    href ? `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : `<span class="${cls}">${esc(text)}</span>`;
  const accent = (s) => esc(s).replace(/\*(.+?)\*/g, '<em class="grad">$1</em>');
  const email = (p.contacts.find((c) => c.label.toLowerCase() === "email") || {}).href || "";
  const arrow = `<svg class="arr" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5 4h7v7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;

  const PAGES = [
    { key: "skills", href: "skills.html", label: "기술", en: "Skills", lead: "지표를 읽고, 실험하고, 자동화하는 도구들" },
    { key: "history", href: "history.html", label: "연혁", en: "Timeline", lead: "경력 · 학력 · 교육 · 자격" },
    { key: "dev", href: "dev.html", label: "개발", en: "Build", lead: "성장을 반복 가능한 시스템으로 만드는 방법" },
    { key: "projects", href: "projects.html", label: "프로젝트", en: "Case Studies", lead: "문제 → 가설 → 실험 → 성과" },
    { key: "references", href: "references.html", label: "레퍼런스", en: "References", lead: "글 · 발표 · 추천" },
  ];
  const num = (i) => String(i + 1).padStart(2, "0");
  const idx = PAGES.findIndex((x) => x.key === page);

  /* ---------- Nav ---------- */
  $("nav").innerHTML = `
    <nav class="nav">
      <a href="index.html" class="brand"><span class="brand-dot"></span>${esc(p.name)}</a>
      <ul class="menu">
        ${PAGES.map((x) => `<li><a href="${x.href}"${x.key === page ? ' class="active" aria-current="page"' : ""}>${x.label}</a></li>`).join("")}
      </ul>
      ${email ? `<a class="btn btn-sm" href="${esc(email)}">Contact</a>` : ""}
      <button class="menu-toggle" aria-label="메뉴" aria-expanded="false"><span></span><span></span></button>
    </nav>`;
  const toggle = document.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", open);
  });
  document.title = idx >= 0 ? `${PAGES[idx].label} — ${p.name}` : `${p.name} — ${p.role}`;

  /* ---------- Blocks ---------- */
  const metricCell = (m) => `
    <div class="metric">
      <div class="metric-value" data-count="${esc(m.value)}">${esc(m.value)}</div>
      <div class="metric-label">${esc(m.label)}</div>
    </div>`;

  const meter = (lv) =>
    lv ? `<span class="meter" aria-label="${lv}/5">${Array.from({ length: 5 }, (_, i) => `<i${i < lv ? ' class="on"' : ""}></i>`).join("")}</span>` : "";

  const allSkills = d.skills.flatMap((g) => g.items.map((s) => s.name));

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
      const pr = d.projects[0];
      const h = d.history[0];
      return `
        <section class="hero">
          ${p.status ? `<p class="status reveal"><span class="pulse"></span>${esc(p.status)}</p>` : ""}
          <p class="eyebrow reveal">${esc(p.role)} · ${esc(p.name)} <span class="muted">${esc(p.nameEn)}</span></p>
          <h1 class="hero-title reveal">${accent(p.headline)}</h1>
          <p class="hero-summary reveal">${esc(p.summary)}</p>
          <div class="hero-cta reveal">
            <a class="btn btn-primary" href="projects.html">케이스 스터디 ${arrow}</a>
            ${email ? `<a class="btn" href="${esc(email)}">연락하기</a>` : ""}
          </div>
        </section>

        ${p.metrics?.length ? `<section class="metrics reveal">${p.metrics.map(metricCell).join("")}</section>` : ""}

        <section class="bento">
          <a href="projects.html" class="card card-lg reveal">
            <div class="card-top"><span class="mono">04</span>Case Studies ${arrow}</div>
            ${pr ? `
              <h3 class="card-title">${esc(pr.title)}</h3>
              <p class="card-text">${esc(pr.summary)}</p>
              <div class="mini-metrics">${(pr.metrics || []).map((m) => `<div><b data-count="${esc(m.value)}">${esc(m.value)}</b><span>${esc(m.label)}</span></div>`).join("")}</div>
              <svg class="spark" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true">
                <defs><linearGradient id="sg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".35"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
                <path d="M0 72 C40 70 60 66 90 60 S140 52 170 40 S230 20 300 6 V80 H0Z" fill="url(#sg)"/>
                <path class="spark-line" d="M0 72 C40 70 60 66 90 60 S140 52 170 40 S230 20 300 6" fill="none" stroke="var(--accent)" stroke-width="2"/>
              </svg>` : ""}
          </a>
          <a href="skills.html" class="card reveal">
            <div class="card-top"><span class="mono">01</span>Skills ${arrow}</div>
            <p class="card-big">${allSkills.length}<small>tools</small></p>
            <div class="chips">${allSkills.slice(0, 6).map((s) => `<span>${esc(s)}</span>`).join("")}</div>
          </a>
          <a href="history.html" class="card reveal">
            <div class="card-top"><span class="mono">02</span>Timeline ${arrow}</div>
            ${h ? `<p class="mono muted small">${esc(h.period)}</p><h3 class="card-title">${esc(h.title)}</h3><p class="card-text">${esc(h.sub)}</p>` : ""}
          </a>
          <a href="dev.html" class="card card-md reveal">
            <div class="card-top"><span class="mono">03</span>Build ${arrow}</div>
            <ul class="card-list">${d.dev.map((v) => `<li>${esc(v.title)}</li>`).join("")}</ul>
          </a>
          <a href="references.html" class="card card-md reveal">
            <div class="card-top"><span class="mono">05</span>References ${arrow}</div>
            <ul class="card-list">${d.references.map((r) => `<li><span class="tag">${esc(r.type)}</span>${esc(r.title)}</li>`).join("")}</ul>
          </a>
        </section>

        <section class="marquee" aria-hidden="true">
          <div class="marquee-track">${[...allSkills, ...allSkills].map((s) => `<span>${esc(s)}</span>`).join("")}</div>
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
          </div>
        </li>`).join("")}</ol>`;
    },

    dev() {
      return pageHead() + `<div class="dev">${d.dev.map((v, i) => `
        <article class="card reveal">
          <div class="card-top"><span class="mono">${num(i)}</span></div>
          <h3 class="card-title">${esc(v.title)}</h3>
          <p class="card-text">${esc(v.desc)}</p>
        </article>`).join("")}</div>`;
    },

    projects() {
      return pageHead() + `<div class="projects">${d.projects.map((pr, i) => {
        const links = pr.links.filter((l) => l.href);
        return `
        <article class="project card reveal">
          <div class="project-side">
            <span class="mono accent">Case ${num(i)}</span>
            <h2>${esc(pr.title)}</h2>
            <p class="project-summary">${esc(pr.summary)}</p>
            <dl class="meta">
              <dt>기간</dt><dd class="mono">${esc(pr.period)}</dd>
              <dt>구성</dt><dd>${esc(pr.team)}</dd>
              <dt>역할</dt><dd>${esc(pr.role)}</dd>
            </dl>
            <div class="chips">${pr.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
            ${links.length ? `<p class="links">${links.map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ${arrow}</a>`).join("")}</p>` : ""}
          </div>
          <div class="project-main">
            ${pr.image ? `<img class="project-img" src="${esc(pr.image)}" alt="${esc(pr.title)}">` : ""}
            ${pr.metrics?.length ? `<div class="metrics metrics-sm">${pr.metrics.map(metricCell).join("")}</div>` : ""}
            <ol class="steps">${pr.points.map((x) => {
              const m = x.match(/^\[([^\]]+)\]\s*(.*)$/);
              return m && m[2] ? `<li><span class="step-k">${esc(m[1])}</span><span>${esc(m[2])}</span></li>` : `<li><span>${esc(x)}</span></li>`;
            }).join("")}</ol>
          </div>
        </article>`;
      }).join("")}</div>`;
    },

    references() {
      return pageHead() + `<ul class="refs">${d.references.map((r) => `
        <li class="reveal">
          <${r.href ? `a href="${esc(r.href)}" target="_blank" rel="noopener"` : "div"} class="ref">
            <span class="tag">${esc(r.type)}</span>
            <span class="ref-body"><b>${esc(r.title)}</b>${r.desc ? `<span class="muted">${esc(r.desc)}</span>` : ""}</span>
            ${r.href ? arrow : ""}
          </${r.href ? "a" : "div"}>
        </li>`).join("")}</ul>`;
    },
  };

  $("content").innerHTML = render[page]();

  /* ---------- Footer ---------- */
  const prev = idx > 0 ? PAGES[idx - 1] : idx === 0 ? { href: "index.html", label: "홈" } : null;
  const next = idx >= 0 && idx < PAGES.length - 1 ? PAGES[idx + 1] : null;
  $("footer").innerHTML = `
    ${idx >= 0 ? `
      <nav class="pager">
        ${prev ? `<a href="${prev.href}"><small>Prev</small>${prev.label}</a>` : "<span></span>"}
        ${next ? `<a href="${next.href}" class="next"><small>Next</small>${next.label}</a>` : "<span></span>"}
      </nav>` : ""}
    <section class="cta reveal">
      <p class="eyebrow">Let's grow</p>
      <h2>다음 성장 실험을<br><em class="grad">함께 설계합니다.</em></h2>
      <ul class="contacts">
        ${p.contacts.map((c) => `<li><span class="muted">${esc(c.label)}</span>${link(c.href, c.value)}</li>`).join("")}
      </ul>
    </section>
    <p class="copy"><span>© ${new Date().getFullYear()} ${esc(p.name)}</span><span class="mono">${esc(p.role)}</span></p>`;

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
