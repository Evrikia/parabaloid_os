// Custom hook for chats management.
import { useState, useEffect } from 'react';

const useChats = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetched = window.electronAPI.getChats();
    setChats(fetched);
  }, []);

  const createChat = (name) => {
    const newChat = window.electronAPI.createChat(name);
    setChats([newChat, ...chats]);
  };

  const deleteChat = (id) => {
    window.electronAPI.deleteChat(id);
    setChats(chats.filter((c) => c.id !== id));
  };

  const renameChat = (data) => {
    window.electronAPI.renameChat(data);
    setChats(chats.map((c) => (c.id === data.id ? { ...c, name: data.newName } : c)));
  };

  return { chats, createChat, deleteChat, renameChat };
};

export default useChats;
