(() => {
  const d = PORTFOLIO;
  const $ = (id) => document.getElementById(id);
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const link = (href, text, cls = "") =>
    href ? `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : `<span class="${cls}">${esc(text)}</span>`;
  const hide = (id) => { const el = $(id); if (el) el.hidden = true; };

  // Profile
  const p = d.profile;
  document.title = `${p.name} — Portfolio`;
  $("brand").textContent = p.name;
  $("hero").innerHTML = `
    ${p.photo ? `<img class="hero-photo" src="${esc(p.photo)}" alt="${esc(p.name)}">` : ""}
    <div>
      <p class="hero-role">${esc(p.role)}</p>
      <h1 class="hero-name">${esc(p.name)}<small>${esc(p.nameEn)}</small></h1>
      <p class="hero-summary">${esc(p.summary)}</p>
      <ul class="contacts">
        ${p.contacts.map((c) => `<li><b>${esc(c.label)}</b>${link(c.href, c.value)}</li>`).join("")}
      </ul>
    </div>`;

  // 01 Skills
  if (!d.skills.length) hide("skills");
  $("skills-list").innerHTML = d.skills.map((g) => `
    <div class="skill-group">
      <h3>${esc(g.category)}</h3>
      <ul>
        ${g.items.map((s) => `
          <li>
            <div class="skill-head">
              <span>${esc(s.name)}</span>
              ${s.level ? `<span class="meter" aria-label="${s.level}/5">${"<i class=on></i>".repeat(s.level)}${"<i></i>".repeat(5 - s.level)}</span>` : ""}
            </div>
            ${s.note ? `<p>${esc(s.note)}</p>` : ""}
          </li>`).join("")}
      </ul>
    </div>`).join("");

  // 02 History
  if (!d.history.length) hide("history");
  $("history-list").innerHTML = d.history.map((h) => `
    <li>
      <div class="tl-period">${esc(h.period)}</div>
      <div class="tl-body">
        <span class="tag">${esc(h.type)}</span>
        <h3>${esc(h.title)}</h3>
        ${h.sub ? `<p class="muted">${esc(h.sub)}</p>` : ""}
        ${h.desc ? `<p>${esc(h.desc)}</p>` : ""}
      </div>
    </li>`).join("");

  // 03 Dev
  if (!d.dev.length) hide("dev");
  $("dev-list").innerHTML = d.dev.map((v) => `
    <article class="card">
      <h3>${esc(v.title)}</h3>
      <p>${esc(v.desc)}</p>
    </article>`).join("");

  // 04 Projects
  if (!d.projects.length) hide("projects");
  $("project-list").innerHTML = d.projects.map((pr) => `
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
        ${pr.links.filter((l) => l.href).length ? `<p class="links">${pr.links.filter((l) => l.href).map((l) => link(l.href, l.label + " ↗")).join("")}</p>` : ""}
      </div>
    </article>`).join("");

  // 05 References
  if (!d.references.length) hide("references");
  $("ref-list").innerHTML = d.references.map((r) => `
    <li>
      <span class="tag">${esc(r.type)}</span>
      <div>
        ${link(r.href, r.title, "ref-title")}
        ${r.desc ? `<p class="muted">${esc(r.desc)}</p>` : ""}
      </div>
    </li>`).join("");

  $("footer").innerHTML = `© ${new Date().getFullYear()} ${esc(p.name)}`;
})();
