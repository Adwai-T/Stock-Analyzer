const { app, BrowserWindow } = require("electron");
const path = require("path");

// --- --- --- Electron Interface --- --- --- //
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      contextIsolation: true, // Keep this true for security
      nodeIntegration: false  // Don't allow require in renderer
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
