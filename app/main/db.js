const { ipcMain } = require('electron');
const db = require('../database/database'); // Connects to SQLite via Knex

/** 📌 Get All Projects */
ipcMain.handle('get-projects', async () => {
    return await db('projects').select('*');
});

/** 📌 Get a Specific Project */
ipcMain.handle('get-project', async (_, projectId) => {
    return await db('projects').where('id', projectId).first();
});

/** 📌 Add a New Project */
ipcMain.handle('add-project', async (_, project) => {
    try {
        const [projectId] = await db('projects').insert(project);
        console.log(`✅ Project added with ID: ${projectId}`);
        return { success: true, projectId };
    } catch (error) {
        console.error("❌ Error adding project:", error);
        return { success: false, message: "Failed to add project." };
    }
});


/** 📌 Update Project (Rename, Description, or Category) */
ipcMain.handle('update-project', async (_, projectId, newData) => {
    return await db('projects').where('id', projectId).update(newData);
});

/** 📌 Delete a Project (and all related tasks) */
ipcMain.handle('delete-project', async (_, projectId) => {
    try {
        console.log(`🗑 Deleting tasks for project ID: ${projectId}...`);
        const deletedTasks = await db('tasks').where('project_id', projectId).del();
        console.log(`✅ Deleted ${deletedTasks} tasks.`);

        console.log(`🗑 Deleting project ID: ${projectId}...`);
        const deletedProject = await db('projects').where('id', projectId).del();

        if (deletedProject) {
            console.log(`✅ Project ${projectId} deleted successfully.`);
            return { success: true, message: `Project ${projectId} deleted.` };
        } else {
            console.warn(`⚠️ Project ${projectId} not found.`);
            return { success: false, message: `Project not found.` };
        }
    } catch (error) {
        console.error(`❌ Error deleting project:`, error);
        return { success: false, message: `Failed to delete project.` };
    }
});


/** 📌 Get All Tasks for a Project */
ipcMain.handle('get-tasks', async (_, projectId) => {
    return await db('tasks').where('project_id', projectId).select('*');
});

/** 📌 Get a Specific Task */
ipcMain.handle('get-task', async (_, taskId) => {
    return await db('tasks').where('id', taskId).first();
});

/** 📌 Add a New Task */
ipcMain.handle('add-task', async (_, task) => {
    return await db('tasks').insert({
        title: task.title,
        project_id: task.project_id,
        category_id: task.category_id, // ✅ Save category
        status: "To-Do",  // 🔴 Always "To-Do"
        priority: task.priority || "Medium",
        deadline: task.deadline || null
    });
});


/** 📌 Update Task */
ipcMain.handle('update-task', async (_, taskId, updatedData) => {
    return await db('tasks')
        .where('id', taskId)
        .update({
            title: updatedData.title,
            category_id: updatedData.category_id, // ✅ Save category
            priority: updatedData.priority,
            deadline: updatedData.deadline
        });
});


/** 📌 Update Task Status */
ipcMain.handle('update-task-status', async (_, taskId, status) => {
    console.log(`Updating Task ID: ${taskId} to Status: ${status}`);
    return await db('tasks').where('id', taskId).update({ status });
});


/** 📌 Delete a Task */
ipcMain.handle('delete-task', async (_, taskId) => {
    return await db('tasks').where('id', taskId).del();
});

/** 📌 Get Tasks Sorted by Priority or Deadline */
ipcMain.handle('get-tasks-sorted', async (_, projectId, sortBy) => {
    if (sortBy === "priority") {
        return await db('tasks')
            .where('project_id', projectId)
            .orderByRaw("CASE priority WHEN 'Urgent' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 WHEN 'Low' THEN 4 END")
            .select('*');
    } else if (sortBy === "deadline") {
        return await db('tasks')
            .where('project_id', projectId)
            .orderBy('deadline', 'asc')
            .select('*');
    }
    return await db('tasks').where('project_id', projectId).select('*'); // Default order
});

/** 📌 Get Projects Sorted by Priority or Deadline */
ipcMain.handle('get-projects-sorted', async (_, sortBy) => {
    if (sortBy === "priority") {
        return await db('projects').orderBy('priority', 'desc').select('*');
    } else if (sortBy === "deadline") {
        return await db('projects').orderBy('deadline', 'asc').select('*');
    }
    return await db('projects').select('*'); // Default to normal order
});

/** 📌 Get Due, Overdue & Urgent Tasks */
ipcMain.handle('get-task-warnings', async () => {
    const today = new Date().toISOString().split('T')[0];

    // Fetch tasks due today
    const dueTodayTasks = await db('tasks')
        .join('projects', 'tasks.project_id', 'projects.id')
        .where('tasks.deadline', today)
        .whereNot('tasks.status', 'Completed')
        .select('tasks.*', 'projects.name as project_name');

    // Fetch overdue tasks
    const overdueTasks = await db('tasks')
        .join('projects', 'tasks.project_id', 'projects.id')
        .where('tasks.deadline', '<', today)
        .whereNot('tasks.status', 'Completed')
        .select('tasks.*', 'projects.name as project_name');

    // Fetch urgent tasks
    const urgentTasks = await db('tasks')
        .join('projects', 'tasks.project_id', 'projects.id')
        .where('tasks.priority', 'Urgent')
        .whereNot('tasks.status', 'Completed')
        .select('tasks.*', 'projects.name as project_name');

    return { dueTodayTasks, overdueTasks, urgentTasks };
});


/** 📌 Get All Project Categories */
ipcMain.handle('get-project-categories', async () => {
    return await db('project_categories').select('*');
});

/** 📌 Get All Task Categories */
ipcMain.handle('get-task-categories', async () => {
    return await db('task_categories').select('*');
});

// Get Tasks Filtered and Sorted in Database
ipcMain.handle('get-tasks-filtered', async (_, projectId, filterType, sortBy) => {
    let query = db('tasks').where('project_id', projectId);
    const today = new Date().toISOString().split('T')[0];

    // Filter logic
    if (filterType === 'completed') {
        query.andWhere('status', 'Completed');
    } else if (filterType === 'incomplete') {
        query.andWhereNot('status', 'Completed');
    } else if (filterType === 'overdue') {
        query.andWhere('deadline', '<', today).andWhereNot('status', 'Completed');
    }

    // Sort logic
    if (!sortBy || sortBy === 'default') {
        query
            .orderByRaw(`CASE WHEN deadline IS NULL THEN 1 ELSE 0 END`)
            .orderBy('deadline', 'asc')
            .orderByRaw(`
                CASE priority 
                    WHEN 'Urgent' THEN 1 
                    WHEN 'High' THEN 2 
                    WHEN 'Medium' THEN 3 
                    WHEN 'Low' THEN 4 
                    ELSE 5 
                END
            `);
    } else if (sortBy === 'deadline') {
        query
            .orderByRaw(`CASE WHEN deadline IS NULL THEN 1 ELSE 0 END`)
            .orderBy('deadline', 'asc');
    } else if (sortBy === 'priority') {
        query.orderByRaw(`
            CASE priority 
                WHEN 'Urgent' THEN 1 
                WHEN 'High' THEN 2 
                WHEN 'Medium' THEN 3 
                WHEN 'Low' THEN 4 
                ELSE 5 
            END
        `);
    }

    return await query.select('*');
});

/** 📌 VACUUM the Database */
ipcMain.handle('vacuum-database', async () => {
    try {
      await db.raw('VACUUM');
      console.log("✅ Database vacuumed successfully.");
      return { success: true };
    } catch (error) {
      console.error("❌ VACUUM failed:", error);
      return { success: false, message: "VACUUM operation failed." };
    }
  });
  