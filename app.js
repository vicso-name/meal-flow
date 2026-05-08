const DEFAULT_SETTINGS = {
  meals: [
    { id: "breakfast", name: "Breakfast", time: "09:00", type: "meal" },
    { id: "lunch", name: "Lunch", time: "14:00", type: "meal" },
    { id: "dinner", name: "Dinner", time: "19:00", type: "meal" },
  ],
  snackMode: "vegetables",
  snackTime: "16:30",
};

const STORAGE_KEY = "meal-flow-settings-v1";

const elements = {
  settingsToggle: document.getElementById("settingsToggle"),
  settingsPanel: document.getElementById("settingsPanel"),
  nextMealTitle: document.getElementById("nextMealTitle"),
  timer: document.getElementById("timer"),
  hint: document.getElementById("hint"),
  statusPill: document.getElementById("statusPill"),
  mealDoneBtn: document.getElementById("mealDoneBtn"),
  progressFill: document.getElementById("progressFill"),
  currentWindowLabel: document.getElementById("currentWindowLabel"),
  nextWindowLabel: document.getElementById("nextWindowLabel"),
  breakfastTime: document.getElementById("breakfastTime"),
  lunchTime: document.getElementById("lunchTime"),
  dinnerTime: document.getElementById("dinnerTime"),
  snackMode: document.getElementById("snackMode"),
  snackTime: document.getElementById("snackTime"),
  customSnackRow: document.getElementById("customSnackRow"),
  saveBtn: document.getElementById("saveBtn"),
  resetBtn: document.getElementById("resetBtn"),
};

let settings = loadSettings();

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(DEFAULT_SETTINGS);
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function parseTimeToDate(time, dayOffset = 0) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function getSchedule() {
  const schedule = [...settings.meals];

  if (settings.snackMode === "custom") {
    schedule.push({
      id: "snack",
      name: "Snack",
      time: settings.snackTime,
      type: "snack",
    });
  }

  return schedule.sort((a, b) => a.time.localeCompare(b.time));
}

function getNextItem() {
  const now = new Date();
  const todayItems = getSchedule().map((item) => ({
    ...item,
    date: parseTimeToDate(item.time),
  }));

  const nextToday = todayItems.find((item) => item.date > now);
  if (nextToday) return nextToday;

  const firstTomorrow = getSchedule()[0];
  return {
    ...firstTomorrow,
    date: parseTimeToDate(firstTomorrow.time, 1),
  };
}

function getPreviousItem(nextItem) {
  const now = new Date();
  const schedule = getSchedule();
  const todayItems = schedule.map((item) => ({
    ...item,
    date: parseTimeToDate(item.time),
  }));

  const pastItems = todayItems.filter((item) => item.date <= now);
  if (pastItems.length) return pastItems[pastItems.length - 1];

  const lastYesterday = schedule[schedule.length - 1];
  return {
    ...lastYesterday,
    date: parseTimeToDate(lastYesterday.time, -1),
  };
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function getHint(nextItem) {
  if (nextItem.type === "snack") {
    return "Snack window is coming. Keep it simple: vegetables, tea, water, or your planned snack.";
  }

  if (settings.snackMode === "none") {
    return "Focus window. No random snacks. Water, tea or coffee are okay.";
  }

  if (settings.snackMode === "vegetables") {
    return "No random snacks. Water, tea, coffee or vegetables are okay.";
  }

  return "Focus window. Stay with the plan until the next scheduled meal or snack.";
}

function updateUI() {
  const now = new Date();
  const nextItem = getNextItem();
  const previousItem = getPreviousItem(nextItem);
  const diff = nextItem.date - now;

  elements.nextMealTitle.textContent = `${nextItem.name} at ${nextItem.time}`;
  elements.timer.textContent = formatCountdown(diff);
  elements.hint.textContent = getHint(nextItem);

  elements.statusPill.textContent = nextItem.type === "snack" ? "Snack window next" : "Focus window";
  elements.mealDoneBtn.textContent = nextItem.type === "snack" ? "Snack done" : "I ate";

  const totalWindow = nextItem.date - previousItem.date;
  const elapsed = now - previousItem.date;
  const progress = Math.min(100, Math.max(0, (elapsed / totalWindow) * 100));
  elements.progressFill.style.width = `${progress}%`;

  elements.currentWindowLabel.textContent = previousItem.name;
  elements.nextWindowLabel.textContent = nextItem.name;
}

function syncForm() {
  elements.breakfastTime.value = settings.meals.find((m) => m.id === "breakfast").time;
  elements.lunchTime.value = settings.meals.find((m) => m.id === "lunch").time;
  elements.dinnerTime.value = settings.meals.find((m) => m.id === "dinner").time;
  elements.snackMode.value = settings.snackMode;
  elements.snackTime.value = settings.snackTime;
  toggleSnackRow();
}

function toggleSnackRow() {
  elements.customSnackRow.classList.toggle("hidden", elements.snackMode.value !== "custom");
}

function applyFormSettings() {
  settings.meals = [
    { id: "breakfast", name: "Breakfast", time: elements.breakfastTime.value || "09:00", type: "meal" },
    { id: "lunch", name: "Lunch", time: elements.lunchTime.value || "14:00", type: "meal" },
    { id: "dinner", name: "Dinner", time: elements.dinnerTime.value || "19:00", type: "meal" },
  ];

  settings.snackMode = elements.snackMode.value;
  settings.snackTime = elements.snackTime.value || "16:30";

  saveSettings();
  updateUI();
}

elements.settingsToggle.addEventListener("click", () => {
  elements.settingsPanel.classList.toggle("hidden");
});

elements.snackMode.addEventListener("change", toggleSnackRow);

elements.saveBtn.addEventListener("click", () => {
  applyFormSettings();
  elements.settingsPanel.classList.add("hidden");
});

elements.resetBtn.addEventListener("click", () => {
  settings = structuredClone(DEFAULT_SETTINGS);
  saveSettings();
  syncForm();
  updateUI();
});

elements.mealDoneBtn.addEventListener("click", () => {
  const nextItem = getNextItem();
  elements.statusPill.textContent = "Logged";
  elements.hint.textContent = `${nextItem.name} marked as done. Stay calm and return to focus.`;
  setTimeout(updateUI, 1800);
});

syncForm();
updateUI();
setInterval(updateUI, 1000);
