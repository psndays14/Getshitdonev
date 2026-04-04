const leads = [
  { name: "Yassine B.", type: "HNWI_MA", city: "Casablanca", budget: 8500000, status: "NEW", owner: "Sara" },
  { name: "Nadia E.", type: "MRE", city: "Rabat", budget: 6200000, status: "MEETING_SET", owner: "Anas" },
  { name: "Hicham L.", type: "MRE", city: "Marrakech", budget: 4100000, status: "CONTACTED", owner: "Sara" }
];

const projects = [
  { code: "PRJ-001", title: "Villa Californie", city: "Casablanca", value: 9800000, stage: "IN_PROGRESS", pm: "Ilyas" },
  { code: "PRJ-002", title: "Riad Signature", city: "Marrakech", value: 5300000, stage: "PLANNING", pm: "Meryem" },
  { code: "PRJ-003", title: "Penthouse Marina", city: "Tanger", value: 7400000, stage: "BLOCKED", pm: "Ilyas" }
];

const formatMad = (v) => new Intl.NumberFormat("fr-MA").format(v);

function statusClass(status) {
  if (["NEW", "DELIVERED"].includes(status)) return "new";
  if (["BLOCKED", "LOST"].includes(status)) return "blocked";
  return "progress";
}

function renderLeads() {
  const body = document.getElementById("leads-body");
  body.innerHTML = leads.map((lead) => `
    <tr>
      <td>${lead.name}</td>
      <td>${lead.type}</td>
      <td>${lead.city}</td>
      <td>${formatMad(lead.budget)}</td>
      <td><span class="status ${statusClass(lead.status)}">${lead.status}</span></td>
      <td>${lead.owner}</td>
    </tr>
  `).join("");

  document.getElementById("kpi-new-leads").textContent = leads.filter(l => l.status === "NEW").length;
  document.getElementById("kpi-qualified").textContent = leads.filter(l => l.status !== "NEW").length;
  document.getElementById("kpi-pipeline").textContent = formatMad(leads.reduce((s, l) => s + l.budget, 0));
}

function renderProjects() {
  const body = document.getElementById("projects-body");
  body.innerHTML = projects.map((project) => `
    <tr>
      <td>${project.code}</td>
      <td>${project.title}</td>
      <td>${project.city}</td>
      <td>${formatMad(project.value)}</td>
      <td><span class="status ${statusClass(project.stage)}">${project.stage}</span></td>
      <td>${project.pm}</td>
    </tr>
  `).join("");

  document.getElementById("kpi-active-projects").textContent = projects.filter(p => p.stage === "IN_PROGRESS").length;
  document.getElementById("kpi-blocked-projects").textContent = projects.filter(p => p.stage === "BLOCKED").length;
  document.getElementById("kpi-project-value").textContent = formatMad(projects.reduce((s, p) => s + p.value, 0));
}

function initNavigation() {
  const buttons = document.querySelectorAll(".nav-btn[data-screen]");
  const screens = {
    leads: document.getElementById("leads-screen"),
    projects: document.getElementById("projects-screen")
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      Object.values(screens).forEach((screen) => screen.classList.remove("active"));
      screens[btn.dataset.screen].classList.add("active");

      document.getElementById("screen-title").textContent = btn.textContent;
    });
  });
}

renderLeads();
renderProjects();
initNavigation();
