// JanMitra AI - MP Dashboard Application Logic

document.addEventListener("DOMContentLoaded", () => {
  const db = window.JanMitraDB;
  if (!db) {
    console.error("JanMitraDB mock database not found.");
    return;
  }

  // State Management
  let submissions = [];
  let selectedSubmission = null;
  let activeFilters = {
    village: "all",
    category: "all",
    search: ""
  };
  
  // Track actioned (sanctioned) submissions in localStorage
  let sanctionedIds = JSON.parse(localStorage.getItem("janmitra_sanctioned") || "[]");

  // Elements
  const prioritiesList = document.getElementById("priorities-list");
  const filterVillage = document.getElementById("filter-village");
  const filterCategory = document.getElementById("filter-category");
  const searchInput = document.getElementById("search-input");

  // KPI elements
  const kpiTotal = document.getElementById("kpi-total");
  const kpiHigh = document.getElementById("kpi-high");
  const kpiVillages = document.getElementById("kpi-villages");
  const kpiActioned = document.getElementById("kpi-actioned");

  // Detail panel elements
  const detailPlaceholder = document.getElementById("detail-placeholder");
  const detailView = document.getElementById("detail-view");
  const detailCategory = document.getElementById("detail-category");
  const detailPriorityBadge = document.getElementById("detail-priority-badge");
  const detailHeading = document.getElementById("detail-heading");
  const detailMeta = document.getElementById("detail-meta");
  const detailSummary = document.getElementById("detail-summary");
  const detailOriginalText = document.getElementById("detail-original-text");
  const detailImageBox = document.getElementById("detail-image-box");
  const detailImage = document.getElementById("detail-image");
  const censusPop = document.getElementById("census-pop");
  const censusPhc = document.getElementById("census-phc");
  const censusRoads = document.getElementById("census-roads");
  const censusWater = document.getElementById("census-water");
  const detailScoreTitle = document.getElementById("detail-score-title");
  const detailScoreList = document.getElementById("detail-score-list");
  const detailAction = document.getElementById("detail-action");
  
  // Interactivity Buttons
  const btnSanction = document.getElementById("btn-sanction");
  const btnSurvey = document.getElementById("btn-survey");

  // Initialize
  function init() {
    loadSubmissions();
    populateVillageFilter();
    calculateSidebarInsights();
    updateKPIs();
    renderList();

    // Event Listeners
    filterVillage.addEventListener("change", (e) => {
      activeFilters.village = e.target.value;
      renderList();
    });

    filterCategory.addEventListener("change", (e) => {
      activeFilters.category = e.target.value;
      renderList();
    });

    searchInput.addEventListener("input", (e) => {
      activeFilters.search = e.target.value.toLowerCase();
      renderList();
    });

    btnSanction.addEventListener("click", handleSanctionToggle);
    btnSurvey.addEventListener("click", handleSurveyDispatch);
  }

  // Load submissions from mock DB and process priorities
  function loadSubmissions() {
    const rawSubs = db.getSubmissions();
    
    // Process priority scores dynamically on the fly
    submissions = rawSubs.map(sub => {
      const evaluation = db.calculatePriority(sub.category, sub.suggestion, sub.village, rawSubs);
      return {
        ...sub,
        priority: evaluation.priority,
        priorityScore: evaluation.priorityScore,
        summary: evaluation.summary,
        estimated_impact: evaluation.estimated_impact,
        reasoning: evaluation.reasoning,
        recommended_action: evaluation.recommended_action,
        villageDetails: evaluation.villageDetails
      };
    });

    // Sort by priority score DESC
    submissions.sort((a, b) => b.priorityScore - a.priorityScore);
  }

  // Populate filter village dropdown
  function populateVillageFilter() {
    db.villages.sort((a, b) => a.name.localeCompare(b.name)).forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.name;
      opt.textContent = v.name;
      filterVillage.appendChild(opt);
    });
  }

  // Calculate static insights counts
  function calculateSidebarInsights() {
    const totalNoPhc = db.villages.filter(v => v.phcs === 0).length;
    const totalWaterPoor = db.villages.filter(v => v.water_supply.includes("Poor")).length;
    const totalNoSchool = db.villages.filter(v => v.schools === 0).length;

    document.getElementById("insights-no-phc").textContent = totalNoPhc;
    document.getElementById("insights-water-poor").textContent = totalWaterPoor;
    document.getElementById("insights-no-school").textContent = totalNoSchool;
  }

  // Calculate KPIs
  function updateKPIs() {
    kpiTotal.textContent = submissions.length;
    
    const highPriorityCount = submissions.filter(s => s.priorityScore >= 80).length;
    kpiHigh.textContent = highPriorityCount;

    const uniqueVillages = [...new Set(submissions.map(s => s.village))].length;
    kpiVillages.textContent = uniqueVillages;

    kpiActioned.textContent = sanctionedIds.length;
  }

  // Render priority card list
  function renderList() {
    prioritiesList.innerHTML = "";
    
    const filtered = submissions.filter(sub => {
      // 1. Village filter
      if (activeFilters.village !== "all" && sub.village !== activeFilters.village) {
        return false;
      }
      // 2. Category filter
      if (activeFilters.category !== "all" && sub.category !== activeFilters.category) {
        return false;
      }
      // 3. Keyword Search
      if (activeFilters.search) {
        const query = activeFilters.search;
        const matchesName = sub.citizenName && sub.citizenName.toLowerCase().includes(query);
        const matchesVillage = sub.village.toLowerCase().includes(query);
        const matchesCategory = sub.category.toLowerCase().includes(query);
        const matchesText = sub.suggestion.toLowerCase().includes(query);
        return matchesName || matchesVillage || matchesCategory || matchesText;
      }
      return true;
    });

    if (filtered.length === 0) {
      prioritiesList.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 40px 20px;">
          No priorities match current filters.
        </div>
      `;
      return;
    }

    filtered.forEach(sub => {
      const isSelected = selectedSubmission && selectedSubmission.id === sub.id;
      const isSanctioned = sanctionedIds.includes(sub.id);
      
      const card = document.createElement("div");
      card.className = `priority-card ${isSelected ? 'selected' : ''}`;
      
      // Determine priority color class
      let scoreColorClass = "score-low";
      if (sub.priorityScore >= 80) scoreColorClass = "score-high";
      else if (sub.priorityScore >= 50) scoreColorClass = "score-medium";

      card.innerHTML = `
        <div class="card-details">
          <div class="card-meta">
            <span class="card-category">${sub.category}</span>
            <span class="card-village">📍 ${sub.village}</span>
            ${isSanctioned ? '<span style="font-size: 0.75rem; background-color: var(--priority-low-bg); color: var(--priority-low-text); border: 1px solid var(--priority-low-border); padding: 2px 6px; border-radius: 4px; font-weight: bold;">Sanctioned</span>' : ''}
          </div>
          <div class="card-summary">${sub.summary}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
            Submitted by: ${sub.citizenName || 'Anonymous'} | ${formatDate(sub.timestamp)}
          </div>
        </div>
        <div class="card-score-container">
          <span class="card-score ${scoreColorClass}">${sub.priorityScore}</span>
          <span class="card-score-label">Priority</span>
        </div>
      `;

      card.addEventListener("click", () => selectCard(sub));
      prioritiesList.appendChild(card);
    });

    // If we have an active selection, make sure its card selection border is synced
    if (selectedSubmission) {
      // Re-find in case data updated
      const currentSelected = submissions.find(s => s.id === selectedSubmission.id);
      if (currentSelected) {
        showDetail(currentSelected);
      }
    }
  }

  function selectCard(sub) {
    selectedSubmission = sub;
    
    // Highlight correct card in DOM
    const cards = prioritiesList.querySelectorAll(".priority-card");
    // Simple re-render list is cleaner to sync selection and sanctioned status badges
    renderList();
  }

  // Populate detail panel values
  function showDetail(sub) {
    detailPlaceholder.style.display = "none";
    detailView.style.display = "flex";

    // Set Header
    detailCategory.textContent = sub.category;
    detailHeading.textContent = `Address ${sub.category.toLowerCase()} development in ${sub.village}`;
    detailMeta.textContent = `Submitted by: ${sub.citizenName || 'Anonymous'} | Village: ${sub.village} | Mapped: ${formatDate(sub.timestamp)}`;
    
    // Priority Score Badge
    detailPriorityBadge.textContent = `${sub.priority} Priority`;
    detailPriorityBadge.className = `badge badge-${sub.priority.toLowerCase()}`;

    // Score details
    detailScoreTitle.textContent = `${sub.priorityScore}/100`;
    detailScoreList.innerHTML = "";
    sub.reasoning.forEach(line => {
      const li = document.createElement("li");
      li.textContent = line;
      detailScoreList.appendChild(li);
    });

    // AI summary
    detailSummary.textContent = sub.summary;
    detailOriginalText.textContent = `"${sub.suggestion}"`;

    // Supporting Photo Preview
    if (sub.imageUrl) {
      detailImage.src = sub.imageUrl;
      detailImageBox.style.display = "block";
    } else {
      detailImageBox.style.display = "none";
    }

    // Census Grid values
    const details = sub.villageDetails;
    censusPop.textContent = details.population.toLocaleString();
    censusPhc.textContent = details.phcs > 0 ? `${details.phcs} PHCs` : `None (Nearest: ${details.distance_to_nearest_phc_km} km)`;
    censusRoads.textContent = details.road_condition;
    censusWater.textContent = details.water_supply;

    // Actions
    detailAction.textContent = sub.recommended_action;

    // Sync button state
    const isSanctioned = sanctionedIds.includes(sub.id);
    if (isSanctioned) {
      btnSanction.innerHTML = "<span>✔</span> Allocation Sanctioned";
      btnSanction.style.backgroundColor = "var(--priority-low-icon)";
      btnSanction.style.borderColor = "var(--priority-low-border)";
    } else {
      btnSanction.innerHTML = "<span>⚖️</span> Sanction Allocation";
      btnSanction.style.backgroundColor = "var(--color-primary)";
      btnSanction.style.borderColor = "transparent";
    }
  }

  // Action Handlers
  function handleSanctionToggle() {
    if (!selectedSubmission) return;
    
    const index = sanctionedIds.indexOf(selectedSubmission.id);
    if (index > -1) {
      // Unsanction
      sanctionedIds.splice(index, 1);
      alert(`Allocation revoked for ${selectedSubmission.village} ${selectedSubmission.category.toLowerCase()} project.`);
    } else {
      // Sanction
      sanctionedIds.push(selectedSubmission.id);
      alert(`MP Allocation APPROVED!\n\nSanctioned Budget & Resources allocated to: ${selectedSubmission.village}.\n\nDirective sent to Block Development Officer.`);
    }

    localStorage.setItem("janmitra_sanctioned", JSON.stringify(sanctionedIds));
    updateKPIs();
    renderList();
  }

  function handleSurveyDispatch() {
    if (!selectedSubmission) return;
    alert(`Survey dispatched!\n\nConstituency Planning Team has been directed to conduct a site survey in ${selectedSubmission.village} regarding the ${selectedSubmission.category.toLowerCase()} issue.\n\nEstimated ETA: 4 business days.`);
  }

  // Format date helper
  function formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHrs = Math.round(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  // Run initialization
  init();
});
