const { app, BrowserWindow } = require("electron");
const path = require("path");

// --- --- --- Electron Interface --- --- --- //
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"), // We'll use this later
    },
  });

  mainWindow.loadFile("views/main.html");
  mainWindow.on('closed', () => {
    app.quit();
  });
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});
