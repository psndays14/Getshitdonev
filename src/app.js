const DB_KEY = "zaf_bat_os_v1";

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
    { id: uid(), week_start: "2026-03-30", week_end: "2026-04-05", project_ids: [], revenue_pipeline: 15400000, notes: "Semaine stable, 1 conversion prévue." }
  ]
};

let db = loadDB();
let uiState = { leadEditingId: null, projectEditingId: null, qualificationEditingId: null, leadSearch: "", leadStatusFilter: "ALL" };

init();

function init() {
  bindNav();
  renderForms();
  bindBackupActions();
  renderAll();
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) return hydrateSeed();
  try {
    const parsed = JSON.parse(raw);
    return ensureSchema(parsed);
  } catch {
    return hydrateSeed();
  }
}

function hydrateSeed() {
  const seeded = structuredClone(seedData);
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
    reports: Array.isArray(candidate.reports) ? candidate.reports : []
  };
}

function persist(next = db) {
  db = next;
  localStorage.setItem(DB_KEY, JSON.stringify(db));
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
    projects: byId("projects-screen"),
    reports: byId("reports-screen"),
    documents: byId("documents-screen"),
    backup: byId("backup-screen")
  };

  buttons.forEach((btn) => btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[btn.dataset.screen].classList.add("active");
    byId("screen-title").textContent = btn.textContent;
  }));
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

  if (uiState.leadEditingId) db.leads = db.leads.map((l) => l.id === payload.id ? payload : l);
  else db.leads.unshift(payload);

  persist();
  e.target.reset();
  uiState.leadEditingId = null;
  renderAll();
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

  if (uiState.qualificationEditingId) db.qualifications = db.qualifications.map((q) => q.id === payload.id ? payload : q);
  else db.qualifications.unshift(payload);

  db.leads = db.leads.map((lead) => lead.id === payload.lead_id
    ? { ...lead, status: payload.decision === "PROCESS" ? "CONTACTED" : lead.status }
    : lead
  );

  persist();
  e.target.reset();
  uiState.qualificationEditingId = null;
  renderAll();
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
    target_date: f.get("target_date")
  };

  if (uiState.projectEditingId) db.projects = db.projects.map((p) => p.id === payload.id ? payload : p);
  else db.projects.unshift(payload);

  if (payload.lead_id) {
    db.leads = db.leads.map((lead) => lead.id === payload.lead_id ? { ...lead, status: "CONVERTED" } : lead);
  }

  persist();
  e.target.reset();
  uiState.projectEditingId = null;
  renderAll();
}

function onReportSubmit(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const project_ids = Array.from(byId("report-project-select").selectedOptions).map((o) => o.value);
  db.reports.unshift({
    id: uid(),
    week_start: f.get("week_start"),
    week_end: f.get("week_end"),
    revenue_pipeline: Number(f.get("revenue_pipeline") || 0),
    project_ids,
    notes: f.get("notes").trim()
  });

  persist();
  e.target.reset();
  renderAll();
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
      <tr>
        <td>${lead.full_name}</td>
        <td>${lead.profile_type}</td>
        <td>${lead.city}</td>
        <td>${formatMad(lead.budget)}</td>
        <td><span class="status ${badgeClass(lead.status)}">${lead.status}</span></td>
        <td class="actions">
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
    <tr>
      <td>${p.code}</td>
      <td>${p.title}</td>
      <td>${p.city}</td>
      <td>${formatMad(p.value)}</td>
      <td><span class="status ${badgeClass(p.stage)}">${p.stage}</span></td>
      <td class="actions">
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
      <td>${formatMad(r.revenue_pipeline)}</td>
      <td class="actions"><button onclick="deleteReport('${r.id}')">Supprimer</button></td>
    </tr>`;
  }).join("") || `<tr><td colspan="4">Aucun report.</td></tr>`;
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
}

function deleteReport(id) {
  if (!confirm("Supprimer ce reporting ?")) return;
  db.reports = db.reports.filter((r) => r.id !== id);
  persist();
  renderAll();
}

function field(labelText, input) {
  return `<label>${labelText}${input}</label>`;
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
