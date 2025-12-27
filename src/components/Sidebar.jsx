// Sidebar: Floating glass panel with animated chat list.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useChats from '../hooks/useChats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ selectedChat, setSelectedChat }) => {
  const { chats, createChat, deleteChat, renameChat } = useChats();
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    const name = `Chat ${chats.length + 1}`;
    createChat(name);
  };

  const handleRename = (id) => {
    if (newName) {
      renameChat({ id, newName });
      setEditingId(null);
      setNewName('');
    }
  };

  return (
    <motion.aside
      className="w-80 h-full p-4 backdrop-blur-md bg-black/30 border-r border-white/10"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Paraboloid</h1>
        <motion.button
          onClick={handleCreate}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FontAwesomeIcon icon={faPlus} />
        </motion.button>
      </div>
      <ul className="space-y-2 overflow-y-auto h-[calc(100vh-100px)]">
        <AnimatePresence>
          {chats.map((chat) => (
            <motion.li
              key={chat.id}
              className={`p-3 rounded-lg cursor-pointer transition ${selectedChat?.id === chat.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
              onClick={() => setSelectedChat(chat)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
            >
              {editingId === chat.id ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    defaultValue={chat.name}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 bg-transparent border-b border-white/20 focus:outline-none"
                    autoFocus
                  />
                  <button onClick={() => handleRename(chat.id)} className="ml-2 text-sm">Save</button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span>{chat.name}</span>
                  <div className="space-x-2">
                    <FontAwesomeIcon icon={faEdit} onClick={() => setEditingId(chat.id)} className="text-xs opacity-50 hover:opacity-100" />
                    <FontAwesomeIcon icon={faTrash} onClick={() => deleteChat(chat.id)} className="text-xs opacity-50 hover:opacity-100" />
                  </div>
                </div>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.aside>
  );
};

export default Sidebar;
