const { ipcRenderer } = require('electron');

let selectedProjectId = null;
let cachedProjectCategories = null;

// ✅ Load Categories into Form & Filter
async function loadProjectCategories() {
    if (!cachedProjectCategories) {
        cachedProjectCategories = await ipcRenderer.invoke('get-project-categories');
        console.log("✅ Project categories fetched.");
    }

    const categorySelect = document.getElementById('project-category');
    const filterSelect = document.getElementById('project-filter');

    if (categorySelect) {
        categorySelect.innerHTML = "";
        cachedProjectCategories.forEach(category => {
            const option = new Option(category.name, category.id);
            categorySelect.appendChild(option);
        });
    }

    if (filterSelect) {
        filterSelect.innerHTML = '<option value="all">All Categories</option>';
        cachedProjectCategories.forEach(category => {
            const option = new Option(category.name, category.id);
            filterSelect.appendChild(option);
        });
    }
}

// ✅ Add New Project
async function addProject() {
    const name = document.getElementById('project-name').value.trim();
    const desc = document.getElementById('project-desc').value.trim();
    const category = document.getElementById('project-category').value;

    if (!name) return alert("Project name is required.");

    const response = await ipcRenderer.invoke('add-project', {
        name,
        description: desc,
        category_id: category
    });

    if (response?.success) {
        console.log(`✅ Project added: ${response.projectId}`);
        await loadProjects();
        document.getElementById('project-name').value = "";
        document.getElementById('project-desc').value = "";
        document.getElementById('project-category').value = "";
    } else {
        alert("❌ Failed to add project.");
    }
}

// ✅ View Project
function viewProject(projectId) {
    window.location.href = `project.html?projectId=${projectId}`;
}

// ✅ Delete Project (with Confirmation)
async function deleteProject(projectId) {
    if (!confirm("Are you sure you want to delete this project and its tasks?")) return;

    const response = await ipcRenderer.invoke('delete-project', projectId);
    if (response.success) {
        console.log(`🗑️ Project ${projectId} deleted`);
        await loadProjects();
    } else {
        alert(`❌ ${response.message}`);
    }
}

// ✅ Load All Projects
async function loadProjects(filterCategory = 'all') {
    const projects = await ipcRenderer.invoke('get-projects');
    const tasksByProject = {};
    const list = document.getElementById('project-list');
    list.innerHTML = "<h3>Projects</h3>";

    const categories = cachedProjectCategories || await ipcRenderer.invoke('get-project-categories');
    const categoryMap = Object.fromEntries(categories.map(cat => [cat.id, cat.name]));

    for (const project of projects) {
        if (filterCategory !== 'all' && project.category_id != filterCategory) continue;

        const tasks = await ipcRenderer.invoke('get-tasks', project.id);
        tasksByProject[project.id] = tasks;

        const total = tasks.length;
        const completed = tasks.filter(t => t.status === "Completed").length;
        const progress = total ? Math.round((completed / total) * 100) : 0;

        const priorityOrder = { "Urgent": 1, "High": 2, "Medium": 3, "Low": 4 };
        const topTask = tasks
            .filter(t => t.status !== "Completed")
            .sort((a, b) => {
                const pA = priorityOrder[a.priority] || 99;
                const pB = priorityOrder[b.priority] || 99;
                return pA !== pB ? pA - pB : new Date(a.deadline || Infinity) - new Date(b.deadline || Infinity);
            })[0];

        const today = new Date().toISOString().split('T')[0];
        const nextDeadline = tasks
            .filter(t => t.deadline && t.deadline >= today && t.status !== "Completed")
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];

        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
  <div class="project-header">
    <div class="project-meta">
      <h4 class="project-title">${project.name}</h4>
      <span class="project-category">${categoryMap[project.category_id] || "Uncategorized"}</span>
    </div>
    <div class="project-actions">
      <button class="view-button" onclick="viewProject(${project.id})">📂 Open</button>
      <button class="delete-button" onclick="deleteProject(${project.id})">🗑 Delete</button>
    </div>
  </div>

  <p class="project-desc">${project.description || "No description available."}</p>

  <div class="task-summary">
    🔵 Progress: <strong>${progress}% (${completed}/${total})</strong><br>
    🔥 Top Priority Task: <strong>${topTask?.title || "None"}</strong><br>
    ⏳ Upcoming Deadline: <strong>${nextDeadline?.deadline || "None"}</strong>
  </div>
`;

        list.appendChild(card);
    }
}

// ✅ Filter by Category
function filterProjects() {
    const selected = document.getElementById('project-filter').value;
    loadProjects(selected);
}

// ✅ Check for Urgent / Due Alerts
async function checkDueTasksOnHome() {
    const { dueTodayTasks, overdueTasks, urgentTasks } = await ipcRenderer.invoke('get-task-warnings');

    const dueBox = document.getElementById('task-alert');
    const urgentBox = document.getElementById('urgent-alert');

    dueBox.innerHTML = [...dueTodayTasks, ...overdueTasks]
        .map(t => t.deadline <= new Date().toISOString().split('T')[0]
            ? `🚨 <strong>${t.title}</strong> (Project: ${t.project_name}) is overdue!<br>`
            : `⏳ <strong>${t.title}</strong> (Project: ${t.project_name}) is due today!<br>`)
        .join("");

    urgentBox.innerHTML = urgentTasks.map(t =>
        `⚠️ <strong>${t.title}</strong> (Project: ${t.project_name}) is marked URGENT!<br>`
    ).join("");

    dueBox.style.display = dueTodayTasks.length || overdueTasks.length ? "block" : "none";
    urgentBox.style.display = urgentTasks.length ? "block" : "none";
}

// ✅ Help Modal
function openCategoryHelp() {
    document.getElementById('category-help-modal').style.display = 'block';
}
function closeCategoryHelp() {
    document.getElementById('category-help-modal').style.display = 'none';
}
window.onclick = (event) => {
    const modal = document.getElementById('category-help-modal');
    if (event.target === modal) modal.style.display = 'none';
};

// ✅ On Page Load
document.addEventListener("DOMContentLoaded", async () => {
    await loadProjectCategories();
    await loadProjects();
    await checkDueTasksOnHome();
});

// ✅ Global Export
window.addProject = addProject;
window.viewProject = viewProject;
window.deleteProject = deleteProject;
window.filterProjects = filterProjects;
window.openCategoryHelp = openCategoryHelp;
window.closeCategoryHelp = closeCategoryHelp;
