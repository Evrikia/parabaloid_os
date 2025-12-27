// Typing Indicator: Subtle dots animation.
import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => (
  <div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-white/50 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </div>
);

export default TypingIndicator;
