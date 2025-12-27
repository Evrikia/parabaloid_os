// Login Screen: Minimal, elegant, premium feel.
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const creds = { username, password };
    const result = isSignup ? await window.electronAPI.signup(creds) : await window.electronAPI.login(creds);
    if (result.success) {
      onLogin();
    } else {
      setError(result.error);
    }
  };

  return (
    <motion.div
      className="w-96 p-8 bg-black/40 backdrop-blur-lg rounded-2xl shadow-xl"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-light mb-6 text-center">{isSignup ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <motion.button
          type="submit"
          className="w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSignup ? 'Sign Up' : 'Login'}
        </motion.button>
      </form>
      <p className="text-center mt-4 text-sm opacity-70">
        {isSignup ? 'Already have an account?' : 'No account?'} 
        <span className="underline cursor-pointer ml-1" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Login' : 'Sign Up'}
        </span>
      </p>
    </motion.div>
  );
};

export default Login;
