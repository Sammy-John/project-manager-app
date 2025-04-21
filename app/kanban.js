

// ✅ Ensure `projectId` is available globally from `project.js`
document.addEventListener("DOMContentLoaded", () => {
    console.log("Kanban View: Loaded for Project ID:", projectId);
    loadKanbanTasks(); // ✅ Ensure Kanban tasks load on page load
});

// ✅ Load Tasks into Kanban Board
async function loadKanbanTasks() {
    if (!projectId) {
        console.error("❌ Project ID is undefined!");
        return;
    }

    const tasks = await ipcRenderer.invoke('get-tasks', projectId);
    console.log("Kanban Tasks Loaded:", tasks); // 🔥 Debugging Output

    document.getElementById("todo-tasks").innerHTML = "";
    document.getElementById("in-progress-tasks").innerHTML = "";
    document.getElementById("completed-tasks").innerHTML = "";

    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');
        taskCard.draggable = true;
        taskCard.id = `task-${task.id}`;
        taskCard.setAttribute("data-task-id", task.id);
        taskCard.ondragstart = (event) => drag(event, task.id);
        taskCard.innerHTML = `<strong>${task.title}</strong><br><small>Priority: ${task.priority}</small>`;

        if (task.status === "To-Do") {
            document.getElementById("todo-tasks").appendChild(taskCard);
        } else if (task.status === "In Progress") {
            document.getElementById("in-progress-tasks").appendChild(taskCard);
        } else if (task.status === "Completed") {
            document.getElementById("completed-tasks").appendChild(taskCard);
        }
    });

    // ✅ Assign Drag-and-Drop Events to Columns
    document.querySelectorAll('.kanban-column').forEach(column => {
        column.addEventListener("dragover", allowDrop);
        column.addEventListener("drop", (event) => {
            drop(event, column.id); // column.id should match the status
        });
    });
}

// ✅ Allow Drop
function allowDrop(event) {
    event.preventDefault();
}

// ✅ Drag Function
function drag(event, taskId) {
    console.log("Dragging task:", taskId); // 🔥 Debugging Output
    event.dataTransfer.setData("taskId", taskId);
}

// ✅ Drop Function (Update Status in DB)
async function drop(event, newStatus) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("taskId");
    console.log(`Dropped Task ID: ${taskId}, New Status: ${newStatus}`);

    // ✅ Update Task Status in Database
    await ipcRenderer.invoke('update-task-status', taskId, newStatus);
    loadKanbanTasks(); // ✅ Refresh board after update
}

// ✅ Ensure functions are available globally
window.loadKanbanTasks = loadKanbanTasks;
window.allowDrop = allowDrop;
window.drag = drag;
window.drop = drop;