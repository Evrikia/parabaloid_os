// Electron main process: Handles window creation, IPC for DB/auth, and exit security.
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const bcrypt = require('bcrypt');
const sqlite3 = require('better-sqlite3');
const fs = require('fs');

// Ensure DB directory exists
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);
const dbPath = path.join(dbDir, 'paraboloid.db');
const db = sqlite3(dbPath);

// Initialize DB tables if not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL,
    sender TEXT NOT NULL,  -- 'user' or 'ai'
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(id)
  );
`);

// Global variables for session
let currentUserId = null;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#0A0A0A',  // Dark background
    titleBarStyle: 'hidden',     // Custom title bar for premium feel
    trafficLightPosition: { x: 10, y: 10 },  // macOS polish
  });

  mainWindow.loadFile('index.html');

  // Handle close event for exit security
  mainWindow.on('close', async (event) => {
    event.preventDefault();
    mainWindow.webContents.send('show-exit-modal');
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC Handlers for auth and DB operations (secure via preload)

// Signup
ipcMain.handle('signup', async (_, { username, password }) => {
  try {
    const hashed = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(username, hashed);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Login
ipcMain.handle('login', async (_, { username, password }) => {
  try {
    const stmt = db.prepare('SELECT id, password FROM users WHERE username = ?');
    const user = stmt.get(username);
    if (!user) return { success: false, error: 'User not found' };
    const match = await bcrypt.compare(password, user.password);
    if (!match) return { success: false, error: 'Invalid password' };
    currentUserId = user.id;
    return { success: true, userId: user.id };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Exit confirmation
ipcMain.handle('confirm-exit', async (_, password) => {
  try {
    const stmt = db.prepare('SELECT password FROM users WHERE id = ?');
    const user = stmt.get(currentUserId);
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      mainWindow.destroy();  // Allow close
      app.quit();
      return { success: true };
    }
    return { success: false, error: 'Invalid password' };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Chat operations
ipcMain.handle('get-chats', () => {
  const stmt = db.prepare('SELECT * FROM chats WHERE user_id = ? ORDER BY created_at DESC');
  return stmt.all(currentUserId);
});

ipcMain.handle('create-chat', (_, name) => {
  const stmt = db.prepare('INSERT INTO chats (user_id, name) VALUES (?, ?)');
  const info = stmt.run(currentUserId, name);
  return { id: info.lastInsertRowid, name };
});

ipcMain.handle('delete-chat', (_, id) => {
  db.prepare('DELETE FROM messages WHERE chat_id = ?').run(id);
  db.prepare('DELETE FROM chats WHERE id = ? AND user_id = ?').run(id, currentUserId);
  return { success: true };
});

ipcMain.handle('rename-chat', (_, { id, newName }) => {
  db.prepare('UPDATE chats SET name = ? WHERE id = ? AND user_id = ?').run(newName, id, currentUserId);
  return { success: true };
});

ipcMain.handle('get-messages', (_, chatId) => {
  const stmt = db.prepare('SELECT * FROM messages WHERE chat_id = ? ORDER BY timestamp ASC');
  return stmt.all(chatId);
});

ipcMain.handle('send-message', async (_, { chatId, content }) => {
  // User message
  const userStmt = db.prepare('INSERT INTO messages (chat_id, sender, content) VALUES (?, ?, ?)');
  userStmt.run(chatId, 'user', content);

  // Simulate AI response with delay for typing animation (handled in frontend)
  const aiContent = 'Paraboloid';
  userStmt.run(chatId, 'ai', aiContent);

  return { success: true };
});
