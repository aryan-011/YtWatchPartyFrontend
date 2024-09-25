import React from 'react';
import { motion } from 'framer-motion';

const PeopleList = ({ participants, onClose }) => {
  return (
    <motion.div
      className="h-full p-4 sm:p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden"
    >
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">Participants</h2>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
        >
          ✕
        </button>
      </div>
      <ul className="h-full space-y-3 sm:space-y-4 overflow-y-auto pb-10 pr-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {participants.map((participant, index) => (
          <li
            key={index}
            className="p-2 w-full sm:p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center transition duration-200 ease-in-out transform hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <span className="text-sm sm:text-lg font-medium truncate">{participant.name}</span>
            {participant._id === localStorage.getItem('id') && <span className="text-sm">(You)</span>}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default PeopleList;
