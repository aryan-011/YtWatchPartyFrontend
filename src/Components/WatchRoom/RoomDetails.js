import React from 'react';
import { LinkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useState } from 'react';

const MeetingDetails = ({ roomId, onClose }) => {
  const [copied, setCopied] = useState(false);
  const copyJoiningInfo = () => {
    const joiningInfo = `${process.env.REACT_APP_FRONTEND_URL}/room/${roomId}`;
    navigator.clipboard.writeText(joiningInfo);
    setCopied(true);

    // Reset the text after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      // initial={{ opacity: 0, x: 100 }}
      // animate={{ opacity: 1, x: 0 }}
      // exit={{ opacity: 0, x: 100 }}
      // transition={{ duration: 0.3 }}
      className="h-full p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Meeting Details</h2>
        <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          ✕
        </button>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Joining Info</h3>
        <p className="text-md mb-4">{`${process.env.REACT_APP_FRONTEND_URL}/room/${roomId}`}</p>
        <button
          onClick={copyJoiningInfo}
          className="flex items-center text-blue-500 hover:text-blue-600 text-md"
        >
          <LinkIcon className="h-5 w-5 mr-2" />
          {copied ? "Copied!" : "Copy joining info"}
        </button>
      </div>
      <p className="text-md">Room attachments will appear here.</p>
    </motion.div>
  );
};

export default MeetingDetails;
