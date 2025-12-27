// Chat Area: Displays messages with fade-ins, typing indicator.
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import InputBar from './InputBar';
import TypingIndicator from './TypingIndicator';

const ChatArea = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      const fetched = window.electronAPI.getMessages(chatId);
      setMessages(fetched);
    }
  }, [chatId]);

  const handleSend = async (content) => {
    setIsTyping(true);
    // Simulate typing delay (1-2s)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const result = await window.electronAPI.sendMessage({ chatId, content });
    if (result.success) {
      const updated = window.electronAPI.getMessages(chatId);
      setMessages(updated);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            className={`max-w-lg p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-white/10 ml-auto' : 'bg-black/30'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {msg.content}
          </motion.div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <InputBar onSend={handleSend} />
    </div>
  );
};

export default ChatArea;
