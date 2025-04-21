const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 1000,
        resizable: false,        // 🚫 Disable resizing
        maximizable: false,      // 🚫 Disable maximize button
        fullscreenable: false,   // 🚫 Prevent fullscreen toggle
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // ✅ Ensure this is present!
    require('./main/db');
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// ✅ Monthly Vacuum (every 30 days = 30 * 24 * 60 * 60 * 1000)
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
setInterval(async () => {
  const result = await ipcMain.emit('vacuum-database');
  if (result?.success) {
    console.log("🧽 Monthly vacuum complete.");
  }
}, THIRTY_DAYS);