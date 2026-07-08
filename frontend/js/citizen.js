// JanMitra AI - Citizen Intake & Agentic Pipeline Simulator

document.addEventListener("DOMContentLoaded", () => {
  const db = window.JanMitraDB;
  if (!db) {
    console.error("JanMitraDB is not initialized.");
    return;
  }

  // 1. Populate Village Dropdown
  const villageSelect = document.getElementById("village-select");
  db.villages.sort((a, b) => a.name.localeCompare(b.name)).forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.name;
    opt.textContent = `${v.name} (Pop: ${v.population.toLocaleString()})`;
    villageSelect.appendChild(opt);
  });

  // 2. Drag & Drop / File Input Handling
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");
  const previewBox = document.getElementById("preview-box");
  const imagePreview = document.getElementById("image-preview");
  const removeImgBtn = document.getElementById("remove-img-btn");
  let base64Image = "";

  dropZone.addEventListener("click", () => fileInput.click());

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "var(--color-primary)";
    dropZone.style.backgroundColor = "var(--color-primary-light)";
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "var(--border-color)";
    dropZone.style.backgroundColor = "var(--bg-secondary)";
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "var(--border-color)";
    dropZone.style.backgroundColor = "var(--bg-secondary)";
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  });

  removeImgBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    base64Image = "";
    imagePreview.src = "";
    previewBox.style.display = "none";
    dropZone.style.display = "block";
    fileInput.value = "";
  });

  function handleImageFile(file) {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG/JPG).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      base64Image = e.target.result;
      imagePreview.src = base64Image;
      dropZone.style.display = "none";
      previewBox.style.display = "block";
    };
    reader.readAsDataURL(file);
  }

  // 3. Form Submit & Agent Pipeline Animation Simulation
  const form = document.getElementById("citizen-form");
  const modal = document.getElementById("pipeline-modal");
  const consoleLogs = document.getElementById("console-logs");
  const pipelineSuccess = document.getElementById("pipeline-success");
  const successSummary = document.getElementById("success-summary");
  const redirectBtn = document.getElementById("dashboard-redirect-btn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Gather form values
    const name = document.getElementById("citizen-name").value.trim() || "Anonymous Citizen";
    const village = villageSelect.value;
    const category = document.getElementById("category-select").value;
    const suggestion = document.getElementById("suggestion-text").value.trim();

    if (!village || !category || !suggestion) {
      alert("Please fill in all required fields.");
      return;
    }

    // Show modal and start simulation
    modal.classList.add("active");
    consoleLogs.innerHTML = "";
    pipelineSuccess.style.display = "none";
    
    // Reset Stepper
    resetStepper();

    // Trigger sequential simulation steps
    runPipelineSimulation(name, village, category, suggestion);
  });

  function logToConsole(message, type = "") {
    const line = document.createElement("div");
    line.className = `console-line ${type}`;
    // Timestamp
    const time = new Date().toLocaleTimeString();
    line.innerHTML = `<span style="color: #64748b">[${time}]</span> ${message}`;
    consoleLogs.appendChild(line);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
  }

  function resetStepper() {
    const steps = ["step-classify", "step-retrieve", "step-cluster", "step-score", "step-generate"];
    steps.forEach((id, idx) => {
      const el = document.getElementById(id);
      el.className = "step-node";
      if (idx === 0) el.classList.add("active");
    });
  }

  function setStepState(stepId, state) {
    // state: 'active' | 'completed'
    const el = document.getElementById(stepId);
    if (!el) return;
    el.className = "step-node";
    if (state === "active") el.classList.add("active");
    if (state === "completed") el.classList.add("completed");
  }

  function runPipelineSimulation(name, village, category, suggestion) {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Retrieve actual statistics of this village from DB for logs
    const villageInfo = db.villages.find(v => v.name === village) || {};
    
    // Simulate step execution asynchronously
    (async () => {
      // --- STEP 1: CLASSIFY ---
      logToConsole("Initializing pipeline coordinator...", "system");
      await sleep(600);
      logToConsole("Spawning Translation & Intent Classification Agent...");
      await sleep(500);
      logToConsole(`Analyzing input suggestion: "${suggestion.substring(0, 60)}..."`);
      await sleep(600);
      logToConsole(`Category mapped: <span style="font-weight: bold;">${category}</span>`, "accent");
      logToConsole("Translating regional dialects... Detected: English. Translation not required.");
      setStepState("step-classify", "completed");
      setStepState("step-retrieve", "active");

      // --- STEP 2: RETRIEVE ---
      await sleep(800);
      logToConsole("Spawning Census Retrieval Agent...", "system");
      await sleep(400);
      logToConsole(`Searching official Census 2011 CSV data for village: "${village}"`);
      await sleep(700);
      
      logToConsole(`Grounding Context Retrieved successfully:`, "success");
      logToConsole(` - Population: ${villageInfo.population.toLocaleString()}`);
      if (category === "Healthcare") {
        logToConsole(` - Primary Health Centres (PHC) inside village: ${villageInfo.phcs}`);
        logToConsole(` - Distance to nearest PHC: ${villageInfo.distance_to_nearest_phc_km} km`);
      } else if (category === "Water Supply") {
        logToConsole(` - Drinking Water Infrastructure: ${villageInfo.water_supply}`);
      } else if (category === "Roads") {
        logToConsole(` - Arterial Road Status: ${villageInfo.road_condition}`);
      } else if (category === "Education") {
        logToConsole(` - Schools inside village: ${villageInfo.schools}`);
        if (villageInfo.schools === 0) {
          logToConsole(` - Distance to nearest primary/secondary school: ${villageInfo.distance_to_nearest_school_km} km`);
        }
      }
      setStepState("step-retrieve", "completed");
      setStepState("step-cluster", "active");

      // --- STEP 3: CLUSTER ---
      await sleep(900);
      logToConsole("Spawning Duplicate & Clustering Agent...", "system");
      await sleep(500);
      logToConsole(`Searching historic complaints repository for category "${category}" in "${village}"...`);
      await sleep(600);
      
      // Look up in current localstorage database
      const existing = db.getSubmissions();
      const matchCount = existing.filter(s => s.village === village && s.category === category).length;
      
      if (matchCount > 0) {
        logToConsole(`Cluster Detected: Found ${matchCount} similar ongoing concerns from ${village}.`, "accent");
        logToConsole("Merging request telemetry with constituency folder ID: mst_" + village.substring(0, 3).toLowerCase());
      } else {
        logToConsole("No direct duplicates found. Creating new priority cluster entry.", "success");
      }
      setStepState("step-cluster", "completed");
      setStepState("step-score", "active");

      // --- STEP 4: SCORE ---
      await sleep(800);
      logToConsole("Spawning Impact & Urgency Scorer Agent...", "system");
      await sleep(400);
      logToConsole("Initiating multi-parameter scoring algorithm...");
      await sleep(800);

      // Run our actual priority calculator so persistent data matches our simulation logs
      const evaluation = db.calculatePriority(category, suggestion, village, existing);
      
      evaluation.reasoning.forEach(reason => {
        logToConsole(reason);
      });
      logToConsole(`Priority Score calculated: <strong style="color: #f43f5e">${evaluation.priorityScore}/100</strong> (${evaluation.priority.toUpperCase()})`, "accent");
      setStepState("step-score", "completed");
      setStepState("step-generate", "active");

      // --- STEP 5: PUBLISH ---
      await sleep(700);
      logToConsole("Spawning Recommendation Generator Agent...", "system");
      await sleep(500);
      logToConsole("Synthesizing context, census statistics, and suggestions...");
      await sleep(600);
      logToConsole(`Suggested Action: "${evaluation.recommended_action}"`);
      await sleep(400);
      logToConsole("Constructing finalized structured JSON payload...", "system");
      
      // Save suggestion to localStorage database
      const finalPayload = {
        citizenName: name,
        village: village,
        category: category,
        suggestion: suggestion,
        imageUrl: base64Image
      };
      
      db.addSubmission(finalPayload);
      
      logToConsole("JSON payload saved successfully to decision-support cache.", "success");
      setStepState("step-generate", "completed");

      // Show completion details
      await sleep(800);
      document.getElementById("pipeline-steps").style.display = "none";
      consoleLogs.style.display = "none";
      document.querySelector(".pipeline-header").style.display = "none";
      
      // Render success screen details
      successSummary.innerHTML = `Your suggestion has been analyzed and ranked with a Priority Score of <strong class="score-${evaluation.priority.toLowerCase()}" style="font-size: 1.15rem;">${evaluation.priorityScore}/100</strong>.<br><br>The decision-support database has updated. The MP's dashboard has placed this issue in the <strong>${evaluation.priority} Priority</strong> queue.`;
      pipelineSuccess.style.display = "block";
    })();
  }

  // Redirect button handler
  redirectBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });
});
