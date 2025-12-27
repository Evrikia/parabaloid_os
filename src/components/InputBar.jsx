// Input Bar: Centered, rounded, glow on focus, animated send.
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const InputBar = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex items-center p-4 bg-black/20 rounded-full mx-auto max-w-2xl shadow-lg"
      whileFocus={{ boxShadow: '0 0 15px rgba(255,255,255,0.1)' }}
      transition={{ type: 'spring' }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Message Paraboloid..."
        className="flex-1 bg-transparent focus:outline-none placeholder-white/50"
      />
      <motion.button
        type="submit"
        className="p-2 rounded-full bg-white/10 hover:bg-white/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </motion.button>
    </motion.form>
  );
};

export default InputBar;
