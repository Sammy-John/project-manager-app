# 📁 Project Manager App

A minimalist desktop app built with Electron and SQLite to manage projects and tasks with ease. Designed with a developer-first dark UI, kanban and table views, and modular categories.

---

## 🚀 Features

- 📋 Manage multiple projects and tasks
- 📌 Switch between Kanban and Table views
- 🔍 Filter by task status (incomplete, completed, overdue)
- 🔄 Sort tasks by priority or deadline
- 🗃 Category-based organization for projects and tasks
- 📅 Task deadlines, statuses, and priorities
- 🔐 All data stored locally in SQLite (no cloud required)
- 🖥️ Cross-platform support (Windows, macOS, Linux)

---

## 🛠️ Tech Stack

- [Electron](https://www.electronjs.org/)
- [Knex.js](https://knexjs.org/)
- [SQLite3](https://www.sqlite.org/index.html)
- Vanilla JS + Modular CSS (Inter + JetBrains Mono)

---

## 📂 Project Structure

```
project-manager-app/
│
├── app/                  # Main Electron app
│   ├── main/             # Backend handlers (IPC / database)
│   ├── styles/           # Modular CSS (root, layout, components)
│   ├── database/         # SQLite file, migrations, seeds
│   ├── index.html        # Home / Projects View
│   ├── project.html      # Project Tasks View
│   ├── renderer.js       # Renderer logic (Home)
│   ├── project.js        # Renderer logic (Project)
│   ├── kanban.js         # Kanban rendering logic
│   └── main.js           # Electron main process
│
├── knexfile.js           # Knex configuration
├── package.json          # NPM project config
└── README.md             # You're here
```

---

## 📦 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app in dev mode

```bash
npm start
```

### 3. (Optional) Seed the database

```bash
npx knex migrate:latest
npx knex seed:run
```

---

## [`🗺 Roadmap`](ROADMAP.md)

---

## 📄 License

Licensed under the [Apache 2.0 License](LICENSE).

---

## ✍️ Author

**Sammy John Rawlinson**  
Contact: [sjr.dev@protonmail.com](sjr.dev@protonmail.com)

