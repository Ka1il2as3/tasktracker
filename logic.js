/* ---------- DOM references ---------- */
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const message = document.getElementById("message");

const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const pendingCount = document.getElementById("pending-count");

const filterButtons = document.querySelectorAll("[data-filter]");
const themeToggle = document.getElementById("theme-toggle");

/* ---------- State ---------- */
let tasks = loadTasks();
let currentFilter = "all";

/* ---------- Toast helper ---------- */
function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ---------- Load tasks from localStorage ---------- */
function loadTasks() {
  try {
    const saved = localStorage.getItem("task-tracker-tasks");
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(task =>
      task &&
      typeof task.id === "string" &&
      typeof task.text === "string" &&
      task.text.trim().length > 0 &&
      typeof task.completed === "boolean"
    );
  } catch {
    return [];
  }
}

/* ---------- Save tasks ---------- */
function saveTasks() {
  try {
    localStorage.setItem("task-tracker-tasks", JSON.stringify(tasks));
    return true;
  } catch {
    message.textContent = "Could not save tasks in this browser.";
    return false;
  }
}

/* ---------- Update counts + progress ring ---------- */
function updateCounts() {
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  totalCount.textContent = tasks.length;
  completedCount.textContent = completed;
  pendingCount.textContent = pending;

  // Progress ring
  const percent = tasks.length === 0
    ? 0
    : Math.round((completed / tasks.length) * 100);

  document.getElementById("progress-percent").textContent = percent + "%";

  const ring = document.getElementById("progress-ring-fill");
  const circumference = 2 * Math.PI * 38; // ≈ 238.76
  ring.style.strokeDashoffset = circumference - (percent / 100) * circumference;
}

/* ---------- Confetti when all tasks complete ---------- */
function maybeCelebrate() {
  const allDone = tasks.length > 0 && tasks.every(t => t.completed);
  if (allDone && !maybeCelebrate._done) {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#34a853", "#4caf50", "#a8e6cf", "#1e7a45"]
      });
    }
    maybeCelebrate._done = true;
  } else if (!allDone) {
    maybeCelebrate._done = false;
  }
}

/* ---------- Render tasks ---------- */
function renderTasks() {
  taskList.replaceChildren();

  const filtered = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = tasks.length === 0
      ? "No tasks yet. Add your first task!"
      : "No tasks match this filter.";
    taskList.appendChild(empty);
  }

  filtered.forEach(task => {
    const item = document.createElement("li");
    item.className = "task-item";
    if (task.completed) item.classList.add("completed");

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    // Status button
    const statusButton = document.createElement("button");
    statusButton.type = "button";
    statusButton.className = "status-button";
    statusButton.textContent = task.completed ? "✓ Done" : "○ Pending";
    statusButton.setAttribute(
      "aria-label",
      `Mark ${task.text} as ${task.completed ? "pending" : "completed"}`
    );

    statusButton.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
      showToast(task.completed ? "Task completed 🎉" : "Marked as pending");
    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "🗑";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

    deleteButton.addEventListener("click", () => {
      item.classList.add("removing");
      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
        showToast("Task deleted 🗑️");
      }, 250);
    });

    item.append(text, statusButton, deleteButton);
    taskList.appendChild(item);
  });

  updateCounts();
  maybeCelebrate();
}

/* ---------- Add task ---------- */
form.addEventListener("submit", event => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    message.textContent = "Please enter a task before adding.";
    input.focus();
    return;
  }

  message.textContent = "";

  tasks.push({
    id: crypto.randomUUID(),
    text: text,
    completed: false
  });

  saveTasks();
  input.value = "";
  renderTasks();
  input.focus();
  showToast("Task added ✅");
});

/* ---------- Filter buttons ---------- */
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(btn => {
      const active = btn === button;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    renderTasks();
  });
});

/* ---------- Dark mode toggle ---------- */
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

/* Restore saved theme on load */
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

/* ---------- Initial aria-pressed + first render ---------- */
filterButtons.forEach(button => {
  button.setAttribute(
    "aria-pressed",
    String(button.dataset.filter === currentFilter)
  );
});

renderTasks();