import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LinkIcon } from '@heroicons/react/24/solid';
import { useSnackbar } from '../SnackBar'; // Assuming you have this hook

const Home = () => {
  const [videoLink, setVideoLink] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleCreateRoom = async () => {
    if (!videoLink.trim()) {
      showSnackbar({ message: "Please enter a valid YouTube video link", useCase: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/rooms/create-room`,
        { videoLink },
        { withCredentials: true }
      );
      const { roomId } = response.data;
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      showSnackbar({ message: "Failed to create room. Please try again.", useCase: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
              Create a Watch Party
            </h1>
            <div className="space-y-6">
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter YouTube Video Link"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  className="pl-10 w-full py-3 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <button
                onClick={handleCreateRoom}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Create Room"
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Home;