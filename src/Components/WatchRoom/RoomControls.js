import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HostControls = ({ onClose }) => {
  const [permissions, setPermissions] = useState({
    shareScreen: true,
    sendChat: true,
    sendReactions: true,
    useMicrophone: true,
    useVideo: true,
  });

  const togglePermission = (key) => {
    setPermissions({ ...permissions, [key]: !permissions[key] });
  };

  return (
    <motion.div
      // initial={{ opacity: 0, x: 100 }}
      // animate={{ opacity: 1, x: 0 }}
      // exit={{ opacity: 0, x: 100 }}
      // transition={{ duration: 0.3 }}
      className="h-full p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Host Controls</h2>
        <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          ✕
        </button>
      </div>
      {Object.keys(permissions).map((key) => (
        <div key={key} className="flex justify-between items-center mb-6">
          <span className="text-lg">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
          <button
            onClick={() => togglePermission(key)}
            className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors ${
              permissions[key] ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                permissions[key] ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      ))}
    </motion.div>
  );
};

export default HostControls;
