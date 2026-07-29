// Save task-list checkbox state in localStorage (per page).
// Works with Zensical instant navigation via document$.
//
// Put this in markdown where you want the "Clear checks" button:
//
// <div class="tasklist-clear-anchor"></div>

function tasklistStorageKey() {
  return "tasklist:" + location.pathname;
}

function clearTasklistsOnPage() {
  const checkboxes = document.querySelectorAll(
    ".md-content .task-list-item input[type='checkbox']"
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  localStorage.removeItem(tasklistStorageKey());
}

function initTasklistClearBar() {
  const content = document.querySelector(".md-content");
  if (!content) return;

  const anchors = content.querySelectorAll(".tasklist-clear-anchor");
  if (!anchors.length) return;

  if (!content.querySelector(".task-list-item input[type='checkbox']")) return;

  anchors.forEach((anchor) => {
    const next = anchor.nextElementSibling;
    if (next?.classList.contains("tasklist-clear-bar")) return;

    const bar = document.createElement("div");
    bar.className = "tasklist-clear-bar";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tasklist-clear-btn";
    btn.textContent = "Clear checks";

    bar.appendChild(btn);
    anchor.insertAdjacentElement("afterend", bar);
  });
}

function wireClearButtons(content) {
  content.querySelectorAll(".tasklist-clear-btn").forEach((btn) => {
    if (btn.dataset.tasklistInit) return;
    btn.dataset.tasklistInit = "1";
    btn.title = "Uncheck all items on this page and remove saved progress";
    btn.addEventListener("click", () => {
      if (!confirm("Clear all checkboxes on this page?")) return;
      clearTasklistsOnPage();
    });
  });
}

function initTasklists() {
  const content = document.querySelector(".md-content");
  if (!content) return;

  initTasklistClearBar();
  wireClearButtons(content);

  const checkboxes = content.querySelectorAll(
    ".task-list-item input[type='checkbox']"
  );
  if (!checkboxes.length) return;

  const key = tasklistStorageKey();
  let state = [];
  try {
    state = JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    state = [];
  }

  const save = () => {
    const next = Array.from(checkboxes, (cb) => cb.checked);
    localStorage.setItem(key, JSON.stringify(next));
  };

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.dataset.tasklistInit) return;
    checkbox.dataset.tasklistInit = "1";

    if (typeof state[index] === "boolean") {
      checkbox.checked = state[index];
    }

    checkbox.addEventListener("change", save);
  });
}

if (typeof document$ !== "undefined") {
  document$.subscribe(() => {
    initTasklists();
  });
} else {
  document.addEventListener("DOMContentLoaded", initTasklists);
}
