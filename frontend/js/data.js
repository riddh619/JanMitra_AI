// JanMitra AI Mock Database and Decision Support Logic

// 1. Census 2011 Village Dataset (30 curated villages with infrastructure gaps)
const VILLAGE_DATASET = [
  {
    name: "Rampur",
    population: 18500,
    phcs: 0,
    distance_to_nearest_phc_km: 16,
    schools: 1,
    water_supply: "Poor (High Arsenic, Handpumps Dry)",
    road_condition: "Poor (Mud track, unpaved)",
    maternal_health_incidents: "High"
  },
  {
    name: "Dhamaspur",
    population: 9200,
    phcs: 0,
    distance_to_nearest_phc_km: 12,
    schools: 0,
    distance_to_nearest_school_km: 7,
    water_supply: "Fair (Well water only)",
    road_condition: "Poor (Severely broken asphalt)",
    maternal_health_incidents: "Medium"
  },
  {
    name: "Bishanpur",
    population: 14200,
    phcs: 1,
    distance_to_nearest_phc_km: 0,
    schools: 0,
    distance_to_nearest_school_km: 9,
    water_supply: "Poor (Borewell dried, high fluoride)",
    road_condition: "Fair (Paved with major potholes)",
    maternal_health_incidents: "Low"
  },
  {
    name: "Kalyanpur",
    population: 22000,
    phcs: 0,
    distance_to_nearest_phc_km: 21,
    schools: 2,
    water_supply: "Fair (Piped water 2 hours/day)",
    road_condition: "Poor (Dirt road, floods during monsoon)",
    maternal_health_incidents: "High"
  },
  {
    name: "Chandpur",
    population: 4500,
    phcs: 0,
    distance_to_nearest_phc_km: 8,
    schools: 1,
    water_supply: "Good (Tap water available)",
    road_condition: "Good (Fully blacktopped)",
    maternal_health_incidents: "Low"
  },
  {
    name: "Sultanpur",
    population: 11000,
    phcs: 0,
    distance_to_nearest_phc_km: 14,
    schools: 0,
    distance_to_nearest_school_km: 6,
    water_supply: "Poor (No pipe network, tanker dependent)",
    road_condition: "Fair (Gravel road)",
    maternal_health_incidents: "Medium"
  },
  {
    name: "Haripur",
    population: 16700,
    phcs: 1,
    distance_to_nearest_phc_km: 0,
    schools: 3,
    water_supply: "Fair (Handpumps & wells)",
    road_condition: "Good (Concrete village roads)",
    maternal_health_incidents: "Low"
  },
  {
    name: "Gopalpur",
    population: 24500,
    phcs: 0,
    distance_to_nearest_phc_km: 19,
    schools: 1,
    water_supply: "Poor (Contaminated pond water used)",
    road_condition: "Poor (Unconnected, seasonal accessibility)",
    maternal_health_incidents: "High"
  },
  {
    name: "Mohanpur",
    population: 3100,
    phcs: 0,
    distance_to_nearest_phc_km: 6,
    schools: 1,
    water_supply: "Good (Common borewell)",
    road_condition: "Fair (Worn asphalt)",
    maternal_health_incidents: "Low"
  },
  {
    name: "Shivpur",
    population: 13900,
    phcs: 0,
    distance_to_nearest_phc_km: 11,
    schools: 0,
    distance_to_nearest_school_km: 8,
    water_supply: "Poor (High salinity)",
    road_condition: "Poor (Unpaved dirt road)",
    maternal_health_incidents: "Medium"
  },
  {
    name: "Fatehpur",
    population: 8600,
    phcs: 0,
    distance_to_nearest_phc_km: 9,
    schools: 2,
    water_supply: "Good (Piped water)",
    road_condition: "Good (Paved road)",
    maternal_health_incidents: "Low"
  },
  {
    name: "Vikrampur",
    population: 19500,
    phcs: 0,
    distance_to_nearest_phc_km: 18,
    schools: 1,
    water_supply: "Poor (Open wells only, cholera risk)",
    road_condition: "Fair (Dilapidated single lane asphalt)",
    maternal_health_incidents: "High"
  },
  {
    name: "Mirzapur",
    population: 5800,
    phcs: 0,
    distance_to_nearest_phc_km: 15,
    schools: 0,
    distance_to_nearest_school_km: 10,
    water_supply: "Fair (Tube wells)",
    road_condition: "Poor (Loose gravel, dangerous curves)",
    maternal_health_incidents: "Medium"
  },
  {
    name: "Karanpur",
    population: 12100,
    phcs: 1,
    distance_to_nearest_phc_km: 0,
    schools: 2,
    water_supply: "Fair (Mixed sources)",
    road_condition: "Good (Paved road)",
    maternal_health_incidents: "Low"
  },
  {
    name: "Rajpur",
    population: 17200,
    phcs: 0,
    distance_to_nearest_phc_km: 22,
    schools: 1,
    water_supply: "Poor (No functional wells)",
    road_condition: "Poor (Washed away by river flooding)",
    maternal_health_incidents: "High"
  }
];

// 2. Pre-loaded Seed Suggestions (Simulated existing database)
const SEED_SUGGESTIONS = [
  {
    id: "req_1",
    citizenName: "Ramesh Prasad",
    village: "Rampur",
    category: "Healthcare",
    suggestion: "We have no doctor or clinic in Rampur. Last week a pregnant woman had to be carried on a cot for 16 kilometers to the town hospital. We desperately need a primary health sub-centre here.",
    timestamp: "2026-07-08T09:30:00Z",
    imageUrl: ""
  },
  {
    id: "req_2",
    citizenName: "Bishanpur",
    village: "Bishanpur",
    category: "Water Supply",
    suggestion: "The main borewell in Bishanpur is pumping yellow, salty water. Children are falling sick with stomach infections. We need a modern water purification plant or connection to the municipal supply line.",
    timestamp: "2026-07-08T10:15:00Z",
    imageUrl: ""
  },
  {
    id: "req_3",
    citizenName: "Sanjay Kumar",
    village: "Dhamaspur",
    category: "Roads",
    suggestion: "The 5-kilometer dirt track connecting Dhamaspur to the main highway has completely disintegrated. During the current rains, it has turned into deep mud. Public transport buses have stopped coming to our village.",
    timestamp: "2026-07-07T14:22:00Z",
    imageUrl: ""
  },
  {
    id: "req_4",
    citizenName: "Preeti Singh",
    village: "Kalyanpur",
    category: "Healthcare",
    suggestion: "Our village has 22,000 residents but the nearest clinic is 21 kilometers away. Many senior citizens cannot travel this distance for basic checks or medicines. Please help establish a PHC.",
    timestamp: "2026-07-07T16:45:00Z",
    imageUrl: ""
  },
  {
    id: "req_5",
    citizenName: "Vikram Mahto",
    village: "Dhamaspur",
    category: "Education",
    suggestion: "Dhamaspur has no primary school. Our children have to walk 7 kilometers across fields and highway crossings just to attend classes. It is very unsafe for young boys and girls.",
    timestamp: "2026-07-06T11:05:00Z",
    imageUrl: ""
  },
  {
    id: "req_6",
    citizenName: "Rajesh Paswan",
    village: "Gopalpur",
    category: "Water Supply",
    suggestion: "Drinking water is scarce in Gopalpur. The water tables have gone down and current hand pumps only yield mud. Villagers are drinking from an open pond which animals also use.",
    timestamp: "2026-07-06T08:12:00Z",
    imageUrl: ""
  }
];

// 3. Coordinator Logic to classify issues, retrieve stats, find duplicates, and calculate priority score
function calculateMockPriority(category, text, villageName, existingSubmissions = []) {
  // Find village data
  const village = VILLAGE_DATASET.find(v => v.name.toLowerCase() === villageName.toLowerCase()) || {
    name: villageName,
    population: 5000,
    phcs: 1,
    distance_to_nearest_phc_km: 0,
    schools: 1,
    water_supply: "Fair",
    road_condition: "Fair",
    maternal_health_incidents: "Low"
  };

  // Duplicate Check Simulation (similar category in same village)
  const similarRequests = existingSubmissions.filter(s => 
    s.village.toLowerCase() === villageName.toLowerCase() &&
    s.category.toLowerCase() === category.toLowerCase()
  );
  
  const relatedCount = similarRequests.length + 1; // including the current one

  // Scoring Logic: Start with a base score
  let score = 30;
  let checklist = [];

  // A. Population Weight (Max 20 points)
  // Higher population means more people affected
  const popPoints = Math.min(20, Math.round((village.population / 25000) * 20));
  score += popPoints;
  checklist.push(`✔ Population Impact: +${popPoints} pts (Village population: ${village.population.toLocaleString()})`);

  // B. Issue Volume / Urgency Weight (Max 15 points)
  const dupPoints = Math.min(15, (relatedCount - 1) * 5);
  if (dupPoints > 0) {
    score += dupPoints;
    checklist.push(`✔ Request Volume: +${dupPoints} pts (${relatedCount} similar requests from this village)`);
  } else {
    checklist.push(`✔ Request Volume: +0 pts (First request of this category from this village)`);
  }

  // C. Category Specific Census Checks
  if (category === "Healthcare") {
    if (village.phcs === 0) {
      score += 20;
      checklist.push(`✔ Critical Infrastructure Gap: +20 pts (No Primary Health Centre in village)`);
      
      const distancePoints = Math.min(15, Math.round(village.distance_to_nearest_phc_km * 0.75));
      score += distancePoints;
      checklist.push(`✔ Extreme Remoteness: +${distancePoints} pts (Nearest clinic is ${village.distance_to_nearest_phc_km} km away)`);
    } else {
      checklist.push(`✔ Infrastructure Present: PHC already exists in village (no gap penalty)`);
    }
    if (village.maternal_health_incidents === "High") {
      score += 10;
      checklist.push(`✔ Health Vulnerability: +10 pts (High maternal health risk profile)`);
    }
  } 
  
  else if (category === "Water Supply") {
    if (village.water_supply.includes("Poor")) {
      score += 25;
      checklist.push(`✔ Vital Need Gap: +25 pts (Water quality classified as Poor/Contaminated)`);
    } else if (village.water_supply.includes("Fair")) {
      score += 12;
      checklist.push(`✔ Moderate Need Gap: +12 pts (Water access limited or intermittent)`);
    } else {
      checklist.push(`✔ Infrastructure Present: Water supply infrastructure classified as Good`);
    }
  } 
  
  else if (category === "Roads") {
    if (village.road_condition.includes("Poor")) {
      score += 22;
      checklist.push(`✔ Accessibility Gap: +22 pts (Road status is Poor/Unpaved)`);
    } else if (village.road_condition.includes("Fair")) {
      score += 10;
      checklist.push(`✔ Moderate Accessibility Gap: +10 pts (Road has minor tarmac but major damage)`);
    } else {
      checklist.push(`✔ Infrastructure Present: Road access classified as Good`);
    }
  } 
  
  else if (category === "Education") {
    if (village.schools === 0) {
      score += 20;
      checklist.push(`✔ Critical Infrastructure Gap: +20 pts (No school within village boundaries)`);
      
      const schoolDistancePoints = Math.min(15, Math.round((village.distance_to_nearest_school_km || 5) * 1.5));
      score += schoolDistancePoints;
      checklist.push(`✔ Education Distance: +${schoolDistancePoints} pts (Nearest school is ${village.distance_to_nearest_school_km || 5} km away)`);
    } else if (village.schools === 1) {
      score += 8;
      checklist.push(`✔ Limited Education Facilities: +8 pts (Only 1 primary school for entire population)`);
    } else {
      checklist.push(`✔ Infrastructure Present: Multi-school capacity exists (${village.schools} schools)`);
    }
  } 
  
  else {
    // Other categories (Electricity, Sanitation, etc.)
    score += 10; // general infrastructure weight
    checklist.push(`✔ Basic Amenity Request: +10 pts`);
  }

  // Ensure score stays in bounds
  score = Math.min(100, Math.max(10, score));

  // Determine priority classification
  let priority = "Low";
  if (score >= 80) priority = "High";
  else if (score >= 50) priority = "Medium";

  // Formulate AI Summary
  let summary = `Establishment/renovation request for ${category.toLowerCase()} in ${villageName}.`;
  if (category === "Healthcare") {
    summary = `Urgent demand to establish a Health Sub-centre in ${villageName} due to extreme isolation (${village.distance_to_nearest_phc_km} km to nearest care) impacting a population of ${village.population.toLocaleString()}.`;
  } else if (category === "Water Supply") {
    summary = `Critical clean drinking water intervention required in ${villageName} to address the current contaminated/dried water source status impacting ${village.population.toLocaleString()} citizens.`;
  } else if (category === "Roads") {
    summary = `Reconstruction of arterial connectivity roads requested for ${villageName} to prevent monsoon flooding isolation and re-establish transport routes.`;
  } else if (category === "Education") {
    summary = `Request to construct a primary/secondary school in ${villageName} so children do not have to travel dangerous distances of ${village.distance_to_nearest_school_km || 5} km.`;
  }

  // Action Recommendation Generator
  let recommended_action = "";
  if (category === "Healthcare") {
    recommended_action = `Direct the District Health Officer to issue a feasibility report for establishing a primary sub-centre in ${villageName}. In the interim, schedule a weekly mobile medical van to visit the village starting next Monday.`;
  } else if (category === "Water Supply") {
    recommended_action = `Sanction immediate installation of a community RO Water Purification Plant under the National Rural Drinking Water Program (NRDWP) and initiate survey for piped main connection.`;
  } else if (category === "Roads") {
    recommended_action = `Submit a proposal to include the ${villageName} arterial road under the Pradhan Mantri Gram Sadak Yojana (PMGSY) scheme. Allocate emergency local area development (MPLADS) funds for gravel filling of mud patches.`;
  } else if (category === "Education") {
    recommended_action = `Initiate discussions with the State Education Ministry to set up a new Government Primary School in ${villageName}. In the interim, coordinate with local block administration to provide a student shuttle service.`;
  } else {
    recommended_action = `Direct the Block Development Officer (BDO) to conduct a spot assessment of ${villageName} within 7 business days and file a grievance remediation report.`;
  }

  return {
    category: category,
    priority: priority,
    priorityScore: score,
    summary: summary,
    estimated_impact: `Affects ~${village.population.toLocaleString()} villagers`,
    related_existing_requests: relatedCount,
    recommended_action: recommended_action,
    reasoning: checklist,
    villageDetails: village
  };
}

// 4. Persistence helper functions
function getSubmissions() {
  const custom = localStorage.getItem("janmitra_submissions");
  if (!custom) {
    localStorage.setItem("janmitra_submissions", JSON.stringify(SEED_SUGGESTIONS));
    return SEED_SUGGESTIONS;
  }
  return JSON.parse(custom);
}

function addSubmission(newSub) {
  const subs = getSubmissions();
  newSub.id = `req_${Date.now()}`;
  newSub.timestamp = new Date().toISOString();
  subs.unshift(newSub); // Add to beginning of array
  localStorage.setItem("janmitra_submissions", JSON.stringify(subs));
  return newSub;
}

// Export references for browser usage (since we are using vanilla JS in direct script tags, we attach them to window)
window.JanMitraDB = {
  villages: VILLAGE_DATASET,
  getSubmissions: getSubmissions,
  addSubmission: addSubmission,
  calculatePriority: calculateMockPriority
};
