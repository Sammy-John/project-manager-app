const db = require('./database/database'); // Import SQLite connection

async function checkTable() {
    try {
        const result = await db.raw("PRAGMA table_info(tasks);");
        console.log("Tasks Table Schema:", result);
    } catch (err) {
        console.error("Error fetching table schema:", err);
    } finally {
        process.exit(); // Ensure Node exits
    }
}

checkTable();
