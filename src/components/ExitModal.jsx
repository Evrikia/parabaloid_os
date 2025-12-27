// Exit Modal: Password confirmation for exit.
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ExitModal = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    const result = await window.electronAPI.confirmExit(password);
    if (result.success) {
      // App will quit from main process
    } else {
      setError(result.error);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-80 p-6 bg-black/60 backdrop-blur-md rounded-2xl">
        <h3 className="text-xl mb-4">Confirm Exit</h3>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-white/5 rounded-lg focus:outline-none"
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <div className="flex justify-end mt-4 space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-white/10 rounded-lg">Cancel</button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-white/20 rounded-lg">Exit</button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExitModal;
