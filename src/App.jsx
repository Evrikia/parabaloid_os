// Main React component: Handles routing between login and chat, exit modal.
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ExitModal from './components/ExitModal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    // Listen for exit modal trigger from main process
    window.electronAPI.onShowExitModal(() => setShowExitModal(true));
  }, []);

  const handleLogin = () => setIsLoggedIn(true);

  return (
    <div className="h-screen flex overflow-hidden font-inter text-white">
      {isLoggedIn ? (
        <>
          <Sidebar selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
          <motion.div
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<ChatArea chatId={selectedChat?.id} />} />
            </Routes>
          </motion.div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <Login onLogin={handleLogin} />
        </div>
      )}
      {showExitModal && <ExitModal onClose={() => setShowExitModal(false)} />}
    </div>
  );
}

export default App;
