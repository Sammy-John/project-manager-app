# 📍 Project Manager App - Roadmap

This roadmap outlines the planned **feature development**, **styling enhancements**, and **system improvements** for the Project Manager App. The goal is to grow it into a robust tool for freelancers managing multiple projects and tasks.

---

## 🎯 Core Features (Coming Soon)

- **Kanban Board Enhancements**
  - Improve Kanban layout and drag/drop styling
  - Add color-coded status columns

- **Task Table Upgrades**
  - Move "Add Task" form below the table for better flow
  - Add dynamic color indicators for:
    - Task status
    - Task category
    - Priority levels

- **Client Management Module**
  - Add ability to manage client profiles and contact details
  - Associate clients with projects

- **Templates System**
  - Add a reusable **Proposal Template** system
  - Add a **Contract Template** generator linked to client/project

- **Project Timeline & Deliverables**
  - Add visual project timeline (Gantt-style or linear progress)
  - Add a module to define and track deliverables

- **Packaging**
  - Prepare for distribution as a desktop app
  - Ensure database portability (local-first)

---

## 🧱 System & Database Improvements

- **Prune Completed Tasks**
  - Archive or remove completed tasks after X time
  - Add timestamps and "completed_at" field

- **Schema Defaults**
  - Enforce default values and types in all database tables

- **Query Optimization**
  - Refactor DB access patterns for filtering and sorting
  - Add indexes for performance-critical queries

- **Manual Maintenance Tools**
  - Add a manual **Vacuum Trigger** button to optimize the SQLite database

---

## 💡 Design Goals

- Maintain a clean, dark-themed **developer aesthetic**
- Use **JetBrains Mono** for UI and **Inter** for body text
- Modular styling via `root.css`, `layout.css`, and `components.css`

---

🔖 This roadmap will evolve as the app develops. Community suggestions and pull requests are welcome!

Licensed under the [Apache 2.0 License](./LICENSE).
