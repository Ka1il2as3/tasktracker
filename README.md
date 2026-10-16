# Task Tracker

A responsive task management web app built with vanilla HTML, CSS, and JavaScript. Users can add, complete, delete, and filter tasks. All data is saved in the browser's localStorage so tasks persist across page refreshes.

---

## Features

- Add new tasks (empty/whitespace input is blocked)
- Mark tasks as completed or pending
- Delete tasks (with smooth fade-out animation)
- Filter tasks by status: All / Pending / Completed
- Live counters: Total, Completed, Pending
- Circular progress ring showing % completion
- Confetti celebration when all tasks are done
- Toast notifications for every action
- Dark mode toggle (preference persists)
- Mobile-responsive layout (breakpoint at 480px)
- Data persists after refresh via localStorage
- Accessible: ARIA labels, live regions, keyboard-friendly

---

## Tech Stack

- HTML5 — semantic structure
- CSS3 — gradients, glassmorphism, animations, responsive media queries
- JavaScript (Vanilla) — DOM manipulation, localStorage, event handling
- No frameworks, no build step, no backend required

---

## File Structure
task-tracker/
├── index.html # Structure: input, filters, task list, progress ring
├── style.css # Design: theme, animations, mobile layout
├── script.js # Logic: add, delete, filter, save/load
└── README.md # This file

## How to Run Locally

### Option A: Open Directly (simplest)
1. Download or extract the `task-tracker` folder.
2. Double-click `index.html` — it opens in your default browser.
3. Start adding tasks.

> Note: Opening via `file://` may block `crypto.randomUUID()` in some browsers. If "Add Task" fails, use Option B below.

### Option B: VS Code Live Server (recommended)
1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Install the **Live Server** extension (by Ritwick Dey).
3. Open the `task-tracker` folder in VS Code (`File → Open Folder`).
4. Right-click `index.html` → **Open with Live Server**.
5. Chrome opens at `http://127.0.0.1:5500/index.html`.

### Option C: Python Simple Server
If you have Python installed:
```bash
cd task-tracker
python -m http.server 5500

##How to Use
Add a task — type in the input box and click Add Task (or press Enter).
Complete a task — click the Pending button on the task to mark it as completed.
Delete a task — click the 🗑 button.
Filter — use All / Pending / Completed buttons above the list.
Toggle theme — click 🌙 in the top-right corner.
Persistence — close the tab and reopen — your tasks are still there.

##Testing on Mobile
Open the app in Chrome.
Press F12 to open DevTools.
Press Ctrl + Shift + M (or click the 📱 icon).
Select iPhone SE from the device dropdown.
Verify the form stacks vertically and all buttons are tappable.