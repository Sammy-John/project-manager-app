const { ipcRenderer } = require('electron');

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('projectId');
let cachedTaskCategories = null;
let currentFilter = 'all';
let currentSort = 'priority';



// 🔄 Initialization
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 Initializing Project View");
    await loadProject();
    await loadTaskCategories();
    await loadTasks();

});

// ============================
// 🧩 Loaders
// ============================

// Load Project and its Category
async function loadProject() {
    const project = await ipcRenderer.invoke('get-project', projectId);
    if (!project) return document.body.innerHTML = "<h1>❌ Project Not Found</h1>";

    document.getElementById('project-title').value = project.name;
    document.getElementById('project-desc').value = project.description || "";
    await loadProjectCategories(project.category_id);
}

// Load Project Category Dropdown
async function loadProjectCategories(selectedCategoryId = null) {
    const dropdown = document.getElementById('edit-project-category');
    if (!dropdown) return console.error("❌ Project category dropdown missing");

    const categories = await ipcRenderer.invoke('get-project-categories');
    dropdown.innerHTML = "";

    categories.forEach(category => {
        const option = new Option(category.name, category.id);
        if (category.id == selectedCategoryId) option.selected = true;
        dropdown.appendChild(option);
    });
}

// Load Task Categories and Cache Them
async function loadTaskCategories() {
    if (!cachedTaskCategories) {
        cachedTaskCategories = await ipcRenderer.invoke('get-task-categories');
        console.log("✅ Task categories fetched:", cachedTaskCategories);
    }

    const dropdown = document.getElementById('new-task-category');
    if (!dropdown) return;

    dropdown.innerHTML = '<option value="">Select Category</option>';
    cachedTaskCategories.forEach(category => {
        dropdown.appendChild(new Option(category.name, category.id));
    });
}

// Load Tasks with Filters and Sorts
async function loadTasks(filter = currentFilter, sort = currentSort) {
    currentFilter = filter;
    currentSort = sort;

    const tasks = await ipcRenderer.invoke('get-tasks-filtered', projectId, filter, sort);
    const container = document.getElementById('task-list');
    container.innerHTML = "";

    tasks.forEach(task => container.appendChild(renderTaskRow(task)));
    console.log("✅ Tasks loaded:", tasks);
}

function sortBy(sortField) {
    currentSort = sortField;
    loadTasks();
  }
  

// ============================
// 🧱 Rendering Helpers
// ============================

function renderTaskRow(task) {
    const row = document.createElement('tr');

    const priorityClass = {
        Low: 'priority-low',
        Medium: 'priority-medium',
        High: 'priority-high',
        Urgent: 'priority-urgent'
    }[task.priority] || 'priority-medium';

    const overdue = task.deadline && task.deadline < new Date().toISOString().split('T')[0] && task.status !== "Completed";

    row.innerHTML = `
        <td><input type="text" id="task-title-${task.id}" value="${task.title}"></td>
        <td>
            <select id="task-category-${task.id}">
                ${cachedTaskCategories.map(cat =>
                    `<option value="${cat.id}" ${task.category_id == cat.id ? 'selected' : ''}>${cat.name}</option>`
                ).join('')}
            </select>
        </td>
        <td class="${priorityClass}">
            <select id="task-priority-${task.id}">
                ${["Low", "Medium", "High", "Urgent"].map(p =>
                    `<option value="${p}" ${task.priority === p ? 'selected' : ''}>${p}</option>`
                ).join('')}
            </select>
        </td>
        <td class="${overdue ? 'overdue' : ''}">
            <input type="date" id="task-deadline-${task.id}" value="${task.deadline || ''}">
        </td>
        <td>
            <select id="task-status-${task.id}" onchange="updateTaskStatus(${task.id}, this.value)">
                ${["To-Do", "In Progress", "Completed"].map(s =>
                    `<option value="${s}" ${task.status === s ? 'selected' : ''}>${s}</option>`
                ).join('')}
            </select>
        </td>
        <td>
            <button onclick="updateTask(${task.id})">💾</button>
            <button class="delete-button" onclick="deleteTask(${task.id})">🗑</button>
        </td>
    `;
    return row;
}

// ============================
// ✅ Task Operations
// ============================

async function addTask() {
    const task = {
        title: document.getElementById('new-task-title').value.trim(),
        category_id: document.getElementById('new-task-category').value,
        priority: document.getElementById('new-task-priority').value,
        deadline: document.getElementById('new-task-deadline').value || null,
        status: document.getElementById('new-task-status').value,
        project_id: projectId
    };

    if (!task.title) return alert("Task name is required.");

    await ipcRenderer.invoke('add-task', task);
    await loadTasks();      // Instead of ('all', 'priority')
    await loadKanbanTasks();


    // Reset form
    document.getElementById('new-task-title').value = "";
    document.getElementById('new-task-category').value = "";
    document.getElementById('new-task-priority').value = "Medium";
    document.getElementById('new-task-deadline').value = "";
    document.getElementById('new-task-status').value = "To-Do";
}

async function updateTask(taskId) {
    const updated = {
        title: document.getElementById(`task-title-${taskId}`).value,
        category_id: document.getElementById(`task-category-${taskId}`).value,
        priority: document.getElementById(`task-priority-${taskId}`).value,
        deadline: document.getElementById(`task-deadline-${taskId}`).value
    };

    await ipcRenderer.invoke('update-task', taskId, updated);
    await loadTasks('all', 'priority');
    await loadKanbanTasks();
}

async function updateTaskStatus(taskId, newStatus) {
    await ipcRenderer.invoke('update-task-status', taskId, newStatus);
    await loadTasks();      // Uses current state
    await loadKanbanTasks();

}

async function deleteTask(taskId) {
    if (!confirm("Delete this task?")) return;
    await ipcRenderer.invoke('delete-task', taskId);
    await loadTasks();      // Keeps sort/filter active
    await loadKanbanTasks();

}

// ============================
// ✅ Project Operations
// ============================

async function updateProject() {
    const name = document.getElementById('project-title').value.trim();
    const description = document.getElementById('project-desc').value.trim();
    const categoryId = document.getElementById('edit-project-category').value;

    if (!name) return alert("Project name required.");

    await ipcRenderer.invoke('update-project', projectId, {
        name, description, category_id: categoryId
    });

    alert("✅ Project updated");
}

// ============================
// 🎛 View Toggles
// ============================

function showTableView() {
    document.getElementById('table-view').style.display = 'block';
    document.getElementById('kanban-view').style.display = 'none';
    loadTasks('all', 'priority');
}

function showKanbanView() {
    document.getElementById('table-view').style.display = 'none';
    document.getElementById('kanban-view').style.display = 'flex';
    loadKanbanTasks();
}

// ============================
// 📘 Modals
// ============================

function openTaskCategoryHelp() {
    document.getElementById('task-category-help-modal').style.display = 'block';
    loadTaskCategoryExplanations();
}

function closeTaskCategoryHelp() {
    document.getElementById('task-category-help-modal').style.display = 'none';
}

async function loadTaskCategoryExplanations() {
    const list = document.getElementById('task-category-explanation-list');
    const categories = await ipcRenderer.invoke('get-task-categories');

    list.innerHTML = '';
    categories.forEach(cat => {
        const li = document.createElement('li');
        li.textContent = `${cat.name}: ${cat.description || 'No description'}`;
        list.appendChild(li);
    });
}

// Close Modal on Outside Click
window.onclick = function (e) {
    const modal = document.getElementById('task-category-help-modal');
    if (e.target === modal) modal.style.display = 'none';
};

// ============================
// 🌍 Global Access
// ============================

window.addTask = addTask;
window.updateTask = updateTask;
window.updateTaskStatus = updateTaskStatus;
window.deleteTask = deleteTask;
window.updateProject = updateProject;

window.showTableView = showTableView;
window.showKanbanView = showKanbanView;
window.goBack = () => window.location.href = "index.html";

window.openTaskCategoryHelp = openTaskCategoryHelp;
window.closeTaskCategoryHelp = closeTaskCategoryHelp;
window.sortBy = sortBy;
