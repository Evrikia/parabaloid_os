// Custom hook for chats management.
import { useState, useEffect } from 'react';

const useChats = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadChats = async () => {
      const fetched = await window.electronAPI.getChats();
      if (isMounted) {
        setChats(fetched);
      }
    };
    loadChats();
    return () => {
      isMounted = false;
    };
  }, []);

  const createChat = async (name) => {
    const newChat = await window.electronAPI.createChat(name);
    setChats((current) => [newChat, ...current]);
  };

  const deleteChat = async (id) => {
    await window.electronAPI.deleteChat(id);
    setChats((current) => current.filter((c) => c.id !== id));
  };

  const renameChat = async (data) => {
    await window.electronAPI.renameChat(data);
    setChats((current) =>
      current.map((c) => (c.id === data.id ? { ...c, name: data.newName } : c))
    );
  };

  return { chats, createChat, deleteChat, renameChat };
};

export default useChats;
