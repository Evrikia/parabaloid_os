// Preload: Exposes secure API to renderer
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  signup: (creds) => ipcRenderer.invoke('signup', creds),
  login: (creds) => ipcRenderer.invoke('login', creds),
  confirmExit: (password) => ipcRenderer.invoke('confirm-exit', password),
  getChats: () => ipcRenderer.invoke('get-chats'),
  createChat: (name) => ipcRenderer.invoke('create-chat', name),
  deleteChat: (id) => ipcRenderer.invoke('delete-chat', id),
  renameChat: (data) => ipcRenderer.invoke('rename-chat', data),
  getMessages: (chatId) => ipcRenderer.invoke('get-messages', chatId),
  sendMessage: (data) => ipcRenderer.invoke('send-message', data),
  onShowExitModal: (callback) => ipcRenderer.on('show-exit-modal', callback),
});
