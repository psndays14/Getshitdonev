const DB_KEY = "zaf_bat_os_v1";
const APP_VERSION = "v1.0.2";
const APP_UPDATED_AT = "2026-04-04";


const seedData = {
  leads: [
    { id: uid(), full_name: "Yassine Bennani", profile_type: "HNWI_MA", city: "Casablanca", budget: 8500000, source: "REFERRAL", status: "NEW", owner: "Sara", notes: "Recherche villa quartier Californie." },
    { id: uid(), full_name: "Nadia El Idrissi", profile_type: "MRE", city: "Rabat", budget: 6200000, source: "PARTNER", status: "CONTACTED", owner: "Anas", notes: "Basée à Paris, visite prévue ce mois." },
    { id: uid(), full_name: "Karim Ait Lahcen", profile_type: "MRE", city: "Marrakech", budget: 4300000, source: "EVENT", status: "MEETING_SET", owner: "Sara", notes: "Projet résidence secondaire." }
  ],
  qualifications: [
    { id: uid(), lead_id: null, budget_score: 22, intent_score: 18, timeline_score: 16, solvency_score: 20, total_score: 76, priority: "HIGH", decision: "PROCESS", notes: "Bon potentiel MRE." }
  ],
  projects: [
    { id: uid(), lead_id: null, code: "PRJ-101", title: "Villa Californie Signature", city: "Casablanca", value: 9800000, stage: "IN_PROGRESS", manager: "Ilyas", start_date: "2026-03-10", target_date: "2026-09-20" },
    { id: uid(), lead_id: null, code: "PRJ-102", title: "Riad Prestige", city: "Marrakech", value: 5600000, stage: "PLANNING", manager: "Meryem", start_date: "2026-04-15", target_date: "2026-12-10" }
  ],
  reports: [
    { id: uid(), week_start: "2026-03-30", week_end: "2026-04-05", project_ids: [], revenue_pipeline: 15400000, summary: "Semaine stable.", risks: "Retard fournisseur sur un lot.", decisions: "Prioriser sourcing alternatif.", next_actions: "Point lundi 09:00.", notes: "Semaine stable, 1 conversion prévue." }
  ],
  events: []
};

const storage = createStorage();
let db = loadDB();
let uiState = { leadEditingId: null, projectEditingId: null, qualificationEditingId: null, leadSearch: "", leadStatusFilter: "ALL", selectedLeadId: null, selectedProjectId: null };

document.body.classList.add("js");
init();

function init() {
  const buildNode = byId("build-info");
  if (buildNode) buildNode.textContent = `Build ${APP_VERSION} — updated ${APP_UPDATED_AT}`;
  bindNav();
  renderNavigationContext("dashboard");
  renderForms();
  bindBackupActions();
  renderAll();
  navigateFromHash();
  window.addEventListener("hashchange", navigateFromHash);
}


function createStorage() {
  try {
    const testKey = "__zaf_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return localStorage;
  } catch {
    const memory = {};
    return {
      getItem: (k) => (k in memory ? memory[k] : null),
      setItem: (k, v) => { memory[k] = String(v); },
      removeItem: (k) => { delete memory[k]; }
    };
  }
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function loadDB() {
  const raw = storage.getItem(DB_KEY);
  if (!raw) return hydrateSeed();
  try {
    const parsed = JSON.parse(raw);
    return ensureSchema(parsed);
  } catch {
    return hydrateSeed();
  }
}

function deepClone(obj) {
  try {
    if (typeof structuredClone === "function") return structuredClone(obj);
  } catch {}
  return JSON.parse(JSON.stringify(obj));
}

function hydrateSeed() {
  const seeded = deepClone(seedData);
  const leadForQual = seeded.leads[1]?.id || null;
  const leadForProject = seeded.leads[0]?.id || null;
  seeded.qualifications[0].lead_id = leadForQual;
  seeded.projects[0].lead_id = leadForProject;
  seeded.reports[0].project_ids = [seeded.projects[0].id];
  persist(seeded);
  return seeded;
}

function ensureSchema(candidate) {
  return {
    leads: Array.isArray(candidate.leads) ? candidate.leads : [],
    qualifications: Array.isArray(candidate.qualifications) ? candidate.qualifications : [],
    projects: Array.isArray(candidate.projects) ? candidate.projects : [],
    reports: Array.isArray(candidate.reports) ? candidate.reports : [],
    events: Array.isArray(candidate.events) ? candidate.events : []
  };
}

function persist(next = db) {
  db = next;
  storage.setItem(DB_KEY, JSON.stringify(db));
}

function formatMad(v) {
  return new Intl.NumberFormat("fr-MA").format(Number(v || 0));
}

function badgeClass(status) {
  if (["NEW", "CONVERTED", "PROCESS", "DELIVERED", "HIGH", "IN_PROGRESS"].includes(status)) return "ok";
  if (["BLOCKED", "DROP", "LOW", "LOST"].includes(status)) return "bad";
  return "warn";
}

function bindNav() {
  const buttons = document.querySelectorAll(".nav-btn[data-screen]");
  const screens = {
    dashboard: byId("dashboard-screen"),
    leads: byId("leads-screen"),
    qualifications: byId("qualifications-screen"),
    offers: byId("offers-screen"),
    projects: byId("projects-screen"),
    reports: byId("reports-screen"),
    documents: byId("documents-screen"),
    backup: byId("backup-screen")
  };

  buttons.forEach((btn) => btn.addEventListener("click", (e) => {
    e.preventDefault();
    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[btn.dataset.screen].classList.add("active");
    byId("screen-title").textContent = btn.textContent;
    renderNavigationContext(btn.dataset.screen);
    window.location.hash = `${btn.dataset.screen}-screen`;
  }));
}

function navigateFromHash() {
  const raw = (window.location.hash || "").replace("#", "");
  if (!raw.endsWith("-screen")) return;
  const screen = raw.replace("-screen", "");
  const target = document.querySelector(`.nav-btn[data-screen="${screen}"]`);
  if (target) target.click();
}

function renderNavigationContext(screen) {
  const mapping = {
    dashboard: { bc: "Pilotage / Dashboard", action: { label: "New lead", fn: () => goTo("leads") } },
    leads: { bc: "Commercial / Leads", action: { label: "New lead", fn: () => byId("lead-form").scrollIntoView({ behavior: "smooth" }) } },
    qualifications: { bc: "Commercial / Qualification", action: { label: "Qualifier lead", fn: () => byId("qualification-form").scrollIntoView({ behavior: "smooth" }) } },
    offers: { bc: "Commercial / Offers", action: { label: "Open documents", fn: () => goTo("documents") } },
    projects: { bc: "Projets / Active projects", action: { label: "New project", fn: () => byId("project-form").scrollIntoView({ behavior: "smooth" }) } },
    reports: { bc: "Projets / Weekly reports", action: { label: "Create report", fn: () => byId("report-form").scrollIntoView({ behavior: "smooth" }) } },
    documents: { bc: "Opérations / Documents", action: { label: "Generate document", fn: () => byId("document-form").scrollIntoView({ behavior: "smooth" }) } },
    backup: { bc: "Opérations / Data backup", action: { label: "Export JSON", fn: () => byId("export-btn").click() } }
  };
  const meta = mapping[screen];
  if (!meta) return;
  byId("breadcrumb").textContent = meta.bc;
  const btn = byId("primary-action");
  btn.textContent = meta.action.label;
  btn.onclick = meta.action.fn;
}

function goTo(screen) {
  const target = document.querySelector(`.nav-btn[data-screen=\"${screen}\"]`);
  if (target) target.click();
}

function renderForms() {
  byId("lead-form").innerHTML = `
    ${field("Nom complet", `<input name="full_name" required />`)}
    ${field("Type", `<select name="profile_type"><option value="HNWI_MA">HNWI_MA</option><option value="MRE">MRE</option></select>`)}
    ${field("Ville", `<input name="city" required />`)}
    ${field("Budget MAD", `<input name="budget" type="number" min="0" required />`)}
    ${field("Source", `<select name="source"><option>REFERRAL</option><option>EVENT</option><option>DIGITAL</option><option>PARTNER</option></select>`)}
    ${field("Owner", `<input name="owner" required />`)}
    ${field("Statut", `<select name="status"><option>NEW</option><option>CONTACTED</option><option>MEETING_SET</option><option>CONVERTED</option><option>LOST</option></select>`)}
    ${field("Notes", `<textarea name="notes" rows="2"></textarea>`)}
    <div class="inline-form"><button type="submit">Enregistrer lead</button><button type="button" id="lead-cancel-edit">Annuler édition</button></div>
  `;

  byId("lead-filters").innerHTML = `
    <label>Recherche<input id="lead-search" placeholder="Nom, ville, owner" /></label>
    <label>Statut
      <select id="lead-status-filter">
        <option value="ALL">Tous</option><option>NEW</option><option>CONTACTED</option><option>MEETING_SET</option><option>CONVERTED</option><option>LOST</option>
      </select>
    </label>
  `;

  byId("qualification-form").innerHTML = `
    ${field("Lead", `<select name="lead_id" id="qualification-lead-select" required></select>`)}
    ${field("Budget score", `<input name="budget_score" type="number" min="0" max="25" required />`)}
    ${field("Intent score", `<input name="intent_score" type="number" min="0" max="25" required />`)}
    ${field("Timeline score", `<input name="timeline_score" type="number" min="0" max="25" required />`)}
    ${field("Solvency score", `<input name="solvency_score" type="number" min="0" max="25" required />`)}
    ${field("Décision", `<select name="decision"><option>PROCESS</option><option>NURTURE</option><option>DROP</option></select>`)}
    ${field("Notes", `<textarea name="notes" rows="2"></textarea>`)}
    <div class="inline-form"><button type="submit">Enregistrer qualification</button><button type="button" id="qualification-cancel-edit">Annuler édition</button></div>
  `;

  byId("project-form").innerHTML = `
    ${field("Lead source (optionnel)", `<select name="lead_id" id="project-lead-select"><option value="">Aucun</option></select>`)}
    ${field("Code projet", `<input name="code" required />`)}
    ${field("Titre", `<input name="title" required />`)}
    ${field("Ville", `<input name="city" required />`)}
    ${field("Valeur MAD", `<input name="value" type="number" min="0" required />`)}
    ${field("Étape", `<select name="stage"><option>PLANNING</option><option>IN_PROGRESS</option><option>BLOCKED</option><option>DELIVERED</option></select>`)}
    ${field("Chef de projet", `<input name="manager" required />`)}
    ${field("Début", `<input name="start_date" type="date" required />`)}
    ${field("Cible livraison", `<input name="target_date" type="date" required />`)}
    <div class="inline-form"><button type="submit">Enregistrer projet</button><button type="button" id="project-cancel-edit">Annuler édition</button></div>
  `;

  byId("report-form").innerHTML = `
    ${field("Semaine début", `<input name="week_start" type="date" required />`)}
    ${field("Semaine fin", `<input name="week_end" type="date" required />`)}
    ${field("Pipeline MAD", `<input name="revenue_pipeline" type="number" min="0" required />`)}
    ${field("Projets liés", `<select id="report-project-select" name="project_ids" multiple size="4"></select>`)}
    ${field("Synthèse", `<textarea name="summary" rows="2" required></textarea>`)}
    ${field("Risques", `<textarea name="risks" rows="2" required></textarea>`)}
    ${field("Décisions", `<textarea name="decisions" rows="2" required></textarea>`)}
    ${field("Next actions", `<textarea name="next_actions" rows="2" required></textarea>`)}
    ${field("Notes", `<textarea name="notes" rows="2"></textarea>`)}
    <div class="inline-form"><button type="submit">Créer report</button></div>
  `;

  byId("document-form").innerHTML = `
    ${field("Type document", `<select name="doc_type"><option value="visit_summary">Compte-rendu visite</option><option value="premium_proposal">Proposition premium</option><option value="weekly_report">Reporting hebdo</option></select>`)}
    ${field("Lead", `<select name="lead_id" id="document-lead-select"><option value="">--</option></select>`)}
    ${field("Projet", `<select name="project_id" id="document-project-select"><option value="">--</option></select>`)}
    ${field("Report", `<select name="report_id" id="document-report-select"><option value="">--</option></select>`)}
    <div class="inline-form"><button type="submit">Générer vue imprimable</button></div>
  `;

  bindForms();
}

function bindForms() {
  byId("lead-form").onsubmit = onLeadSubmit;
  byId("lead-cancel-edit").onclick = () => { uiState.leadEditingId = null; byId("lead-form").reset(); };
  byId("lead-search").oninput = (e) => { uiState.leadSearch = e.target.value.toLowerCase(); renderLeadsTable(); };
  byId("lead-status-filter").onchange = (e) => { uiState.leadStatusFilter = e.target.value; renderLeadsTable(); };

  byId("qualification-form").onsubmit = onQualificationSubmit;
  byId("qualification-cancel-edit").onclick = () => { uiState.qualificationEditingId = null; byId("qualification-form").reset(); };

  byId("project-form").onsubmit = onProjectSubmit;
  byId("project-cancel-edit").onclick = () => { uiState.projectEditingId = null; byId("project-form").reset(); };

  byId("report-form").onsubmit = onReportSubmit;
  byId("document-form").onsubmit = onGenerateDocument;
}

function onLeadSubmit(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const payload = {
    id: uiState.leadEditingId || uid(),
    full_name: f.get("full_name").trim(),
    profile_type: f.get("profile_type"),
    city: f.get("city").trim(),
    budget: Number(f.get("budget") || 0),
    source: f.get("source"),
    status: f.get("status"),
    owner: f.get("owner").trim(),
    notes: f.get("notes").trim()
  };
  if (!payload.full_name || !payload.city || !payload.owner || payload.budget <= 0) return alert("Lead invalide: champs obligatoires.");

  if (uiState.leadEditingId) db.leads = db.leads.map((l) => l.id === payload.id ? payload : l);
  else db.leads.unshift(payload);
  addEvent("lead", payload.id, uiState.leadEditingId ? "updated" : "created", `${payload.full_name} (${payload.city})`);

  persist();
  e.target.reset();
  uiState.leadEditingId = null;
  renderAll();
  toast("Lead enregistré.");
}

function onQualificationSubmit(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const total = ["budget_score", "intent_score", "timeline_score", "solvency_score"].reduce((sum, k) => sum + Number(f.get(k) || 0), 0);
  const priority = total >= 75 ? "HIGH" : total >= 50 ? "MEDIUM" : "LOW";
  const payload = {
    id: uiState.qualificationEditingId || uid(),
    lead_id: f.get("lead_id"),
    budget_score: Number(f.get("budget_score")),
    intent_score: Number(f.get("intent_score")),
    timeline_score: Number(f.get("timeline_score")),
    solvency_score: Number(f.get("solvency_score")),
    total_score: total,
    priority,
    decision: f.get("decision"),
    notes: f.get("notes").trim()
  };
  if (!db.leads.find((l) => l.id === payload.lead_id)) return alert("Lead introuvable.");

  if (uiState.qualificationEditingId) db.qualifications = db.qualifications.map((q) => q.id === payload.id ? payload : q);
  else db.qualifications.unshift(payload);
  addEvent("qualification", payload.id, uiState.qualificationEditingId ? "updated" : "created", `lead:${payload.lead_id} score:${payload.total_score}`);

  db.leads = db.leads.map((lead) => lead.id === payload.lead_id
    ? { ...lead, status: payload.decision === "PROCESS" ? "CONTACTED" : lead.status }
    : lead
  );

  persist();
  e.target.reset();
  uiState.qualificationEditingId = null;
  renderAll();
  toast("Qualification enregistrée.");
}

function onProjectSubmit(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const payload = {
    id: uiState.projectEditingId || uid(),
    lead_id: f.get("lead_id") || null,
    code: f.get("code").trim(),
    title: f.get("title").trim(),
    city: f.get("city").trim(),
    value: Number(f.get("value") || 0),
    stage: f.get("stage"),
    manager: f.get("manager").trim(),
    start_date: f.get("start_date"),
    target_date: f.get("target_date"),
    tasks: uiState.projectEditingId ? (db.projects.find((x) => x.id === uiState.projectEditingId)?.tasks || []) : [
      { id: uid(), title: "Kickoff client", status: "TODO" },
      { id: uid(), title: "Validation budget", status: "TODO" }
    ]
  };
  if (!payload.title || !payload.code || !payload.city || payload.value <= 0) return alert("Projet invalide: champs obligatoires manquants.");
  if (payload.start_date > payload.target_date) return alert("Dates projet incohérentes.");

  if (uiState.projectEditingId) db.projects = db.projects.map((p) => p.id === payload.id ? payload : p);
  else db.projects.unshift(payload);

  if (payload.lead_id) {
    db.leads = db.leads.map((lead) => lead.id === payload.lead_id ? { ...lead, status: "CONVERTED" } : lead);
    addEvent("conversion", payload.id, "lead_to_project", `lead:${payload.lead_id} -> project:${payload.code}`);
  }
  addEvent("project", payload.id, uiState.projectEditingId ? "updated" : "created", `${payload.code}`);

  persist();
  e.target.reset();
  uiState.projectEditingId = null;
  renderAll();
  toast("Projet enregistré.");
}

function onReportSubmit(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const project_ids = Array.from(byId("report-project-select").selectedOptions).map((o) => o.value);
  const week_start = f.get("week_start");
  const week_end = f.get("week_end");
  if (week_end < week_start) return alert("Période hebdomadaire incohérente.");
  db.reports.unshift({
    id: uid(),
    week_start,
    week_end,
    revenue_pipeline: Number(f.get("revenue_pipeline") || 0),
    project_ids,
    summary: f.get("summary").trim(),
    risks: f.get("risks").trim(),
    decisions: f.get("decisions").trim(),
    next_actions: f.get("next_actions").trim(),
    notes: f.get("notes").trim()
  });
  addEvent("report", db.reports[0].id, "created", `${week_start}→${week_end}`);

  persist();
  e.target.reset();
  renderAll();
  toast("Report créé.");
}

function onGenerateDocument(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const type = f.get("doc_type");
  const lead = db.leads.find((l) => l.id === f.get("lead_id"));
  const project = db.projects.find((p) => p.id === f.get("project_id"));
  const report = db.reports.find((r) => r.id === f.get("report_id"));

  let title = "Document ZAF BAT";
  let body = "";

  if (type === "visit_summary") {
    if (!lead) return alert("Sélectionnez un lead pour générer le compte-rendu de visite.");
    title = `Compte-rendu de visite — ${lead.full_name}`;
    body = `<p>Client: ${lead.full_name} (${lead.profile_type})</p><p>Ville: ${lead.city}</p><p>Budget: ${formatMad(lead.budget)} MAD</p><p>Notes: ${lead.notes || "-"}</p>`;
  }

  if (type === "premium_proposal") {
    if (!project) return alert("Sélectionnez un projet pour générer la proposition premium.");
    title = `Proposition Premium — ${project.title}`;
    body = `<p>Projet: ${project.title} (${project.code})</p><p>Ville: ${project.city}</p><p>Valeur estimée: ${formatMad(project.value)} MAD</p><p>Manager: ${project.manager}</p><p>Étape: ${project.stage}</p>`;
  }

  if (type === "weekly_report") {
    if (!report) return alert("Sélectionnez un report pour générer le reporting hebdo.");
    const linkedProjects = report.project_ids.map((id) => db.projects.find((p) => p.id === id)?.title).filter(Boolean);
    title = `Reporting hebdomadaire — ${report.week_start} / ${report.week_end}`;
    body = `<p>Période: ${report.week_start} → ${report.week_end}</p><p>Pipeline: ${formatMad(report.revenue_pipeline)} MAD</p><p>Projets liés: ${linkedProjects.join(", ") || "Aucun"}</p><p>Notes: ${report.notes || "-"}</p>`;
  }

  const printable = window.open("", "_blank");
  printable.document.write(`<!doctype html><html><head><title>${title}</title><style>body{font-family:Arial;padding:30px;}h1{margin-top:0}</style></head><body><h1>${title}</h1>${body}<hr/><p>ZAF BAT OS v1</p><script>window.onload=()=>window.print()</script></body></html>`);
  printable.document.close();
}

function bindBackupActions() {
  byId("export-btn").onclick = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `zaf-bat-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  byId("import-input").onchange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = ensureSchema(JSON.parse(text));
      persist(parsed);
      renderAll();
      alert("Import réussi.");
    } catch {
      alert("Format JSON invalide.");
    }
  };

  byId("reset-btn").onclick = () => {
    if (!confirm("Réinitialiser les données locales avec les données seed ?")) return;
    db = hydrateSeed();
    renderAll();
  };
}

function renderAll() {
  renderDashboard();
  renderLeadSelects();
  renderProjectSelects();
  renderReportSelects();
  renderLeadsTable();
  renderQualificationsTable();
  renderProjectsTable();
  renderReportsTable();
  renderOffersTable();
  renderLeadDetail();
  renderProjectDetail();
}

function renderDashboard() {
  const totalLeads = db.leads.length;
  const qualified = db.qualifications.length;
  const activeProjects = db.projects.filter((p) => ["PLANNING", "IN_PROGRESS"].includes(p.stage)).length;
  const pipeline = db.projects.reduce((s, p) => s + Number(p.value || 0), 0);

  byId("dashboard-kpis").innerHTML = `
    <article class="card"><p>Leads</p><strong>${totalLeads}</strong></article>
    <article class="card"><p>Opportunités qualifiées</p><strong>${qualified}</strong></article>
    <article class="card"><p>Projets actifs</p><strong>${activeProjects}</strong></article>
    <article class="card"><p>Pipeline (MAD)</p><strong>${formatMad(pipeline)}</strong></article>
  `;

  const grouped = db.leads.reduce((acc, lead) => ({ ...acc, [lead.status]: (acc[lead.status] || 0) + 1 }), {});
  byId("pipeline-overview").innerHTML = Object.entries(grouped)
    .map(([status, count]) => `<span class="status ${badgeClass(status)}">${status}: ${count}</span>`)
    .join(" ");
}

function renderLeadsTable() {
  const rows = db.leads
    .filter((lead) => {
      const query = `${lead.full_name} ${lead.city} ${lead.owner}`.toLowerCase();
      const textOk = query.includes(uiState.leadSearch);
      const statusOk = uiState.leadStatusFilter === "ALL" || lead.status === uiState.leadStatusFilter;
      return textOk && statusOk;
    })
    .map((lead) => `
      <tr onclick="selectLead('${lead.id}')">
        <td>${lead.full_name}</td>
        <td>${lead.profile_type}</td>
        <td>${lead.city}</td>
        <td>${formatMad(lead.budget)}</td>
        <td><span class="status ${badgeClass(lead.status)}">${lead.status}</span></td>
        <td class="actions" onclick="event.stopPropagation()">
          <button onclick="selectLead('${lead.id}')">Voir</button>
          <button onclick="editLead('${lead.id}')">Éditer</button>
          <button onclick="deleteLead('${lead.id}')">Supprimer</button>
          <button onclick="prefillQualification('${lead.id}')">Qualifier</button>
          <button onclick="convertLeadToProject('${lead.id}')">Convertir</button>
        </td>
      </tr>
    `)
    .join("");
  byId("leads-body").innerHTML = rows || `<tr><td colspan="6">Aucun lead trouvé.</td></tr>`;
}

function renderQualificationsTable() {
  byId("qualifications-body").innerHTML = db.qualifications.map((q) => {
    const lead = db.leads.find((l) => l.id === q.lead_id);
    return `<tr>
      <td>${lead ? lead.full_name : "Lead supprimé"}</td>
      <td>${q.total_score}/100</td>
      <td><span class="status ${badgeClass(q.priority)}">${q.priority}</span></td>
      <td><span class="status ${badgeClass(q.decision)}">${q.decision}</span></td>
      <td class="actions">
        <button onclick="editQualification('${q.id}')">Éditer</button>
        <button onclick="deleteQualification('${q.id}')">Supprimer</button>
        ${lead ? `<button onclick="convertLeadToProject('${lead.id}')">Créer projet</button>` : ""}
      </td>
    </tr>`;
  }).join("") || `<tr><td colspan="5">Aucune qualification.</td></tr>`;
}

function renderProjectsTable() {
  byId("projects-body").innerHTML = db.projects.map((p) => `
    <tr onclick="selectProject('${p.id}')">
      <td>${p.code}</td>
      <td>${p.title}</td>
      <td>${p.city}</td>
      <td>${formatMad(p.value)}</td>
      <td><span class="status ${badgeClass(p.stage)}">${p.stage}</span></td>
      <td class="actions" onclick="event.stopPropagation()">
        <button onclick="selectProject('${p.id}')">Voir</button>
        <button onclick="progressProjectStage('${p.id}')">Avancer</button>
        <button onclick="toggleProjectBlocked('${p.id}')">${p.stage === "BLOCKED" ? "Débloquer" : "Bloquer"}</button>
        <button onclick="editProject('${p.id}')">Éditer</button>
        <button onclick="deleteProject('${p.id}')">Supprimer</button>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="6">Aucun projet.</td></tr>`;
}

function renderReportsTable() {
  byId("reports-body").innerHTML = db.reports.map((r) => {
    const count = r.project_ids.length;
    return `<tr>
      <td>${r.week_start} → ${r.week_end}</td>
      <td>${count}</td>
      <td>${formatMad(r.revenue_pipeline)}<br/><small>${r.summary || "-"}</small></td>
      <td class="actions"><button onclick="deleteReport('${r.id}')">Supprimer</button></td>
    </tr>`;
  }).join("") || `<tr><td colspan="4">Aucun report.</td></tr>`;
}

function renderOffersTable() {
  const rows = db.qualifications
    .filter((q) => q.decision === "PROCESS")
    .map((q) => {
      const lead = db.leads.find((l) => l.id === q.lead_id);
      if (!lead) return "";
      return `<tr>
        <td>${lead.full_name}</td>
        <td>${q.total_score}/100</td>
        <td><span class="status ${badgeClass(q.decision)}">${q.decision}</span></td>
        <td class="actions">
          <button onclick="selectLead('${lead.id}');goTo('leads')">Ouvrir lead</button>
          <button onclick="convertLeadToProject('${lead.id}');goTo('projects')">Convertir projet</button>
          <button onclick="openPremiumProposalForLead('${lead.id}')">Proposition premium</button>
        </td>
      </tr>`;
    }).join("");
  byId("offers-body").innerHTML = rows || `<tr><td colspan="4">Aucune opportunité qualifiée. Étape suivante: qualifier un lead depuis Commercial / Leads.</td></tr>`;
}

function renderLeadSelects() {
  const opts = db.leads.map((l) => `<option value="${l.id}">${l.full_name} — ${l.city}</option>`).join("");
  byId("qualification-lead-select").innerHTML = opts;
  byId("project-lead-select").innerHTML = `<option value="">Aucun</option>${opts}`;
  byId("document-lead-select").innerHTML = `<option value="">--</option>${opts}`;
}

function renderProjectSelects() {
  const opts = db.projects.map((p) => `<option value="${p.id}">${p.code} — ${p.title}</option>`).join("");
  byId("report-project-select").innerHTML = opts;
  byId("document-project-select").innerHTML = `<option value="">--</option>${opts}`;
}

function renderReportSelects() {
  const opts = db.reports.map((r) => `<option value="${r.id}">${r.week_start} → ${r.week_end}</option>`).join("");
  byId("document-report-select").innerHTML = `<option value="">--</option>${opts}`;
}

function editLead(id) {
  const lead = db.leads.find((l) => l.id === id);
  if (!lead) return;
  uiState.leadEditingId = id;
  const form = byId("lead-form");
  Object.entries(lead).forEach(([k, v]) => { if (form.elements[k]) form.elements[k].value = v ?? ""; });
}

function deleteLead(id) {
  if (!confirm("Supprimer ce lead ?")) return;
  db.leads = db.leads.filter((l) => l.id !== id);
  db.qualifications = db.qualifications.filter((q) => q.lead_id !== id);
  persist();
  renderAll();
  toast("Lead supprimé.");
}

function prefillQualification(leadId) {
  byId("qualification-lead-select").value = leadId;
  document.querySelector('[data-screen="qualifications"]').click();
}

function editQualification(id) {
  const q = db.qualifications.find((x) => x.id === id);
  if (!q) return;
  uiState.qualificationEditingId = id;
  const form = byId("qualification-form");
  Object.entries(q).forEach(([k, v]) => { if (form.elements[k]) form.elements[k].value = v ?? ""; });
}

function deleteQualification(id) {
  if (!confirm("Supprimer cette qualification ?")) return;
  db.qualifications = db.qualifications.filter((q) => q.id !== id);
  persist();
  renderAll();
  toast("Qualification supprimée.");
}

function convertLeadToProject(leadId) {
  const q = db.qualifications.find((x) => x.lead_id === leadId && x.decision === "PROCESS");
  if (!q) return alert("Le lead doit être qualifié avec décision PROCESS avant conversion.");
  byId("project-lead-select").value = leadId;
  document.querySelector('[data-screen="projects"]').click();
}

function editProject(id) {
  const p = db.projects.find((x) => x.id === id);
  if (!p) return;
  uiState.projectEditingId = id;
  const form = byId("project-form");
  Object.entries(p).forEach(([k, v]) => { if (form.elements[k]) form.elements[k].value = v ?? ""; });
}

function deleteProject(id) {
  if (!confirm("Supprimer ce projet ?")) return;
  db.projects = db.projects.filter((p) => p.id !== id);
  db.reports = db.reports.map((r) => ({ ...r, project_ids: r.project_ids.filter((pid) => pid !== id) }));
  persist();
  renderAll();
  toast("Projet supprimé.");
}

function deleteReport(id) {
  if (!confirm("Supprimer ce reporting ?")) return;
  db.reports = db.reports.filter((r) => r.id !== id);
  persist();
  renderAll();
  toast("Report supprimé.");
}

function addEvent(entity_type, entity_id, action, details) {
  db.events.unshift({ id: uid(), entity_type, entity_id, action, details, created_at: new Date().toISOString() });
}

function selectLead(id) {
  uiState.selectedLeadId = id;
  renderLeadDetail();
}

function selectProject(id) {
  uiState.selectedProjectId = id;
  renderProjectDetail();
}

function renderLeadDetail() {
  const box = byId("lead-detail");
  if (!box) return;
  const lead = db.leads.find((l) => l.id === uiState.selectedLeadId) || db.leads[0];
  if (!lead) return box.innerHTML = "Aucun lead.";
  uiState.selectedLeadId = lead.id;
  const qual = db.qualifications.find((q) => q.lead_id === lead.id);
  const timeline = db.events.filter((e) => e.details?.includes(`lead:${lead.id}`) || e.entity_id === lead.id).slice(0, 8);
  box.innerHTML = `
    <div class="detail-grid">
      <div class="detail-item"><strong>${lead.full_name}</strong><br/>${lead.profile_type} · ${lead.city}</div>
      <div class="detail-item">Budget: ${formatMad(lead.budget)} MAD<br/>Statut: <span class="status ${badgeClass(lead.status)}">${lead.status}</span></div>
      <div class="detail-item">Source: ${lead.source}<br/>Owner: ${lead.owner}</div>
      <div class="detail-item">Qualification: ${qual ? `${qual.total_score}/100 (${qual.decision})` : "non qualifié"}</div>
    </div>
    <div class="inline-form" style="margin-top:8px;">
      <button onclick="prefillQualification('${lead.id}');goTo('qualifications')">Qualifier ce lead</button>
      <button onclick="convertLeadToProject('${lead.id}');goTo('projects')">Convertir en projet</button>
    </div>
    <div class="timeline">${timeline.map((t) => `<div class="timeline-entry">${t.created_at.slice(0, 16).replace("T", " ")} · ${t.action} · ${t.details}</div>`).join("") || "<div class='timeline-entry'>Aucun historique</div>"}</div>
  `;
}

function renderProjectDetail() {
  const box = byId("project-detail");
  if (!box) return;
  const project = db.projects.find((p) => p.id === uiState.selectedProjectId) || db.projects[0];
  if (!project) return box.innerHTML = "Aucun projet.";
  uiState.selectedProjectId = project.id;
  const lead = db.leads.find((l) => l.id === project.lead_id);
  const timeline = db.events.filter((e) => e.entity_id === project.id).slice(0, 8);
  box.innerHTML = `
    <div class="detail-grid">
      <div class="detail-item"><strong>${project.code}</strong><br/>${project.title}</div>
      <div class="detail-item">Étape: <span class="status ${badgeClass(project.stage)}">${project.stage}</span><br/>Valeur: ${formatMad(project.value)} MAD</div>
      <div class="detail-item">Lead origine: ${lead ? lead.full_name : "N/A"}</div>
      <div class="detail-item">Dates: ${project.start_date} → ${project.target_date}</div>
    </div>
    <h4>Tâches</h4>
    <div class="timeline">${(project.tasks || []).map((task) => `<div class="timeline-entry">${task.title} · ${task.status} <button onclick="cycleTaskStatus('${project.id}','${task.id}')">changer</button></div>`).join("") || "<div class='timeline-entry'>Aucune tâche</div>"}</div>
    <h4>Historique</h4>
    <div class="timeline">${timeline.map((t) => `<div class="timeline-entry">${t.created_at.slice(0, 16).replace("T", " ")} · ${t.action} · ${t.details}</div>`).join("") || "<div class='timeline-entry'>Aucun historique</div>"}</div>
    <div class="inline-form" style="margin-top:8px;">
      <button onclick="openReportForProject('${project.id}')">Créer weekly report</button>
      <button onclick="openDocumentForProject('${project.id}')">Générer document</button>
    </div>
  `;
}

function openReportForProject(projectId) {
  goTo("reports");
  setTimeout(() => {
    const select = byId("report-project-select");
    Array.from(select.options).forEach((o) => { o.selected = o.value === projectId; });
    select.scrollIntoView({ behavior: "smooth" });
  }, 50);
}

function openDocumentForProject(projectId) {
  goTo("documents");
  setTimeout(() => {
    byId("document-project-select").value = projectId;
    byId("document-form").elements.doc_type.value = "premium_proposal";
    byId("document-form").scrollIntoView({ behavior: "smooth" });
  }, 50);
}

function openPremiumProposalForLead(leadId) {
  const project = db.projects.find((p) => p.lead_id === leadId);
  if (!project) return alert("Aucun projet lié. Convertissez d'abord le lead.");
  openDocumentForProject(project.id);
}

function progressProjectStage(projectId) {
  const order = ["PLANNING", "IN_PROGRESS", "DELIVERED"];
  db.projects = db.projects.map((p) => {
    if (p.id !== projectId || p.stage === "BLOCKED") return p;
    const idx = order.indexOf(p.stage);
    const next = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : p.stage;
    if (next !== p.stage) addEvent("project", p.id, "stage_progress", `${p.stage} -> ${next}`);
    return { ...p, stage: next };
  });
  persist();
  renderAll();
}

function toggleProjectBlocked(projectId) {
  db.projects = db.projects.map((p) => {
    if (p.id !== projectId) return p;
    const next = p.stage === "BLOCKED" ? "IN_PROGRESS" : "BLOCKED";
    addEvent("project", p.id, "stage_toggle", `${p.stage} -> ${next}`);
    return { ...p, stage: next };
  });
  persist();
  renderAll();
}

function cycleTaskStatus(projectId, taskId) {
  const order = ["TODO", "DOING", "DONE"];
  db.projects = db.projects.map((p) => {
    if (p.id !== projectId) return p;
    const tasks = (p.tasks || []).map((t) => {
      if (t.id !== taskId) return t;
      const next = order[(order.indexOf(t.status) + 1) % order.length];
      addEvent("project_task", projectId, "task_progress", `${t.title}: ${t.status} -> ${next}`);
      return { ...t, status: next };
    });
    return { ...p, tasks };
  });
  persist();
  renderProjectDetail();
}

function field(labelText, input) {
  return `<label>${labelText}${input}</label>`;
}

function toast(message) {
  let node = document.getElementById("toast");
  if (!node) {
    node = document.createElement("div");
    node.id = "toast";
    node.style.cssText = "position:fixed;right:16px;bottom:16px;padding:10px 12px;background:#10192b;color:#eaf0ff;border:1px solid rgba(255,255,255,.2);border-radius:10px;z-index:9999;font-size:12px;";
    document.body.appendChild(node);
  }
  node.textContent = message;
  node.style.display = "block";
  clearTimeout(window.__zafToastTimer);
  window.__zafToastTimer = setTimeout(() => { node.style.display = "none"; }, 1800);
}

function byId(id) {
  return document.getElementById(id);
}

window.editLead = editLead;
window.deleteLead = deleteLead;
window.prefillQualification = prefillQualification;
window.editQualification = editQualification;
window.deleteQualification = deleteQualification;
window.convertLeadToProject = convertLeadToProject;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.deleteReport = deleteReport;
window.selectLead = selectLead;
window.selectProject = selectProject;
window.progressProjectStage = progressProjectStage;
window.toggleProjectBlocked = toggleProjectBlocked;
window.cycleTaskStatus = cycleTaskStatus;
window.goTo = goTo;
window.openPremiumProposalForLead = openPremiumProposalForLead;
window.openReportForProject = openReportForProject;
window.openDocumentForProject = openDocumentForProject;
