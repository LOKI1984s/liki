(() => {
  const d = PORTFOLIO;
  const page = document.body.dataset.page;
  const $ = (id) => document.getElementById(id);
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const link = (href, text, cls = "") =>
    href ? `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : `<span class="${cls}">${esc(text)}</span>`;

  const PAGES = [
    { key: "skills", href: "skills.html", label: "기술", num: "01", desc: "사용 언어·프레임워크·도구" },
    { key: "history", href: "history.html", label: "연혁", num: "02", desc: "경력·학력·교육·자격" },
    { key: "dev", href: "dev.html", label: "개발", num: "03", desc: "개발 원칙과 활동" },
    { key: "projects", href: "projects.html", label: "프로젝트", num: "04", desc: "문제·해결·성과" },
    { key: "references", href: "references.html", label: "레퍼런스", num: "05", desc: "글·발표·추천" },
  ];

  const p = d.profile;

  // Nav
  $("nav").innerHTML = `
    <a href="index.html" class="brand">${esc(p.name)}</a>
    <button class="menu-toggle" aria-label="메뉴" aria-expanded="false">☰</button>
    <ul class="menu">
      ${PAGES.map((x) => `<li><a href="${x.href}"${x.key === page ? ' class="active" aria-current="page"' : ""}>${x.label}</a></li>`).join("")}
    </ul>`;
  const toggle = document.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = document.querySelector(".menu").classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  const current = PAGES.find((x) => x.key === page);
  document.title = current ? `${current.label} — ${p.name}` : `${p.name} — Portfolio`;

  const render = {
    home() {
      return `
        ${p.photo ? `<img class="hero-photo" src="${esc(p.photo)}" alt="${esc(p.name)}">` : ""}
        <p class="hero-role">${esc(p.role)}</p>
        <h1 class="hero-name">${esc(p.name)}<small>${esc(p.nameEn)}</small></h1>
        <p class="hero-summary">${esc(p.summary)}</p>
        <ul class="contacts">
          ${p.contacts.map((c) => `<li><b>${esc(c.label)}</b>${link(c.href, c.value)}</li>`).join("")}
        </ul>
        <nav class="index">
          ${PAGES.map((x) => `
            <a href="${x.href}" class="index-item">
              <span class="index-num">${x.num}</span>
              <span class="index-label">${x.label}</span>
              <span class="index-desc">${x.desc}</span>
              <span class="index-arrow">→</span>
            </a>`).join("")}
        </nav>`;
    },

    skills() {
      return `<div class="skills">${d.skills.map((g) => `
        <div class="skill-group">
          <h3>${esc(g.category)}</h3>
          <ul>${g.items.map((s) => `
            <li>
              <div class="skill-head">
                <span>${esc(s.name)}</span>
                ${s.level ? `<span class="meter" aria-label="${s.level}/5">${"<i class=on></i>".repeat(s.level)}${"<i></i>".repeat(5 - s.level)}</span>` : ""}
              </div>
              ${s.note ? `<p>${esc(s.note)}</p>` : ""}
            </li>`).join("")}
          </ul>
        </div>`).join("")}</div>`;
    },

    history() {
      return `<ol class="timeline">${d.history.map((h) => `
        <li>
          <div class="tl-period">${esc(h.period)}</div>
          <div class="tl-body">
            <span class="tag">${esc(h.type)}</span>
            <h3>${esc(h.title)}</h3>
            ${h.sub ? `<p class="muted">${esc(h.sub)}</p>` : ""}
            ${h.desc ? `<p>${esc(h.desc)}</p>` : ""}
          </div>
        </li>`).join("")}</ol>`;
    },

    dev() {
      return `<div class="dev">${d.dev.map((v) => `
        <article class="card">
          <h3>${esc(v.title)}</h3>
          <p>${esc(v.desc)}</p>
        </article>`).join("")}</div>`;
    },

    projects() {
      return `<div class="projects">${d.projects.map((pr) => {
        const links = pr.links.filter((l) => l.href);
        return `
        <article class="project">
          ${pr.image ? `<img class="project-img" src="${esc(pr.image)}" alt="${esc(pr.title)}">` : ""}
          <div class="project-body">
            <header>
              <h3>${esc(pr.title)}</h3>
              <p class="muted">${[pr.period, pr.team].filter(Boolean).map(esc).join(" · ")}</p>
            </header>
            <p class="project-summary">${esc(pr.summary)}</p>
            <dl class="meta">
              <dt>역할</dt><dd>${esc(pr.role)}</dd>
              <dt>기술</dt><dd class="chips">${pr.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</dd>
            </dl>
            <ul class="points">${pr.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            ${links.length ? `<p class="links">${links.map((l) => link(l.href, l.label + " ↗")).join("")}</p>` : ""}
          </div>
        </article>`;
      }).join("")}</div>`;
    },

    references() {
      return `<ul class="refs">${d.references.map((r) => `
        <li>
          <span class="tag">${esc(r.type)}</span>
          <div>
            ${link(r.href, r.title, "ref-title")}
            ${r.desc ? `<p class="muted">${esc(r.desc)}</p>` : ""}
          </div>
        </li>`).join("")}</ul>`;
    },
  };

  $("content").innerHTML = render[page]();

  // 이전/다음 페이지
  const i = PAGES.findIndex((x) => x.key === page);
  const pager = i < 0 ? "" : `
    <nav class="pager">
      ${i > 0 ? `<a href="${PAGES[i - 1].href}">← ${PAGES[i - 1].label}</a>` : `<a href="index.html">← 홈</a>`}
      ${i < PAGES.length - 1 ? `<a href="${PAGES[i + 1].href}">${PAGES[i + 1].label} →</a>` : ""}
    </nav>`;
  $("footer").innerHTML = `${pager}<p>© ${new Date().getFullYear()} ${esc(p.name)}</p>`;
})();
