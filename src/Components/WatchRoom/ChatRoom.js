import React, { useState, useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, incOptimisticMessages, resetUnreadCount } from "../../Redux/messageSlice";

const ChatRoom = ({ socket, roomId, userId, darkMode, roomData, onClose }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.messages); // Access messages from Redux
  const unreadCount = useSelector((state) => state.messages.unreadCount);
  // const [messages, setMessages] = useState(roomData?.recentMessages || []);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // socket.on("chatMessage", (message) => {
    //   dispatch(addMessage({ ...message, isRead: false }));
    // });
    dispatch(resetUnreadCount());
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const tempMessage = {
        _id: `temp-${Date.now()}`,
        user: { _id: userId, name: localStorage.getItem("name") },
        content: newMessage,
        isRead: true,
        timestamp:Date.now()
      };

      // Optimistically add the message to the UI
      dispatch(addMessage(tempMessage));
      dispatch(incOptimisticMessages());
      socket.emit("sendMessage", { roomId, userId, message: newMessage });
      setNewMessage("");
    }
  };

  return (
    <div className="h-full  flex flex-col">
      <div className="flex p-4 pb-1 justify-between items-center mb-2">
        <h2 className="text-xl sm:text-2xl font-semibold">Room Chats</h2>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
        >
          ✕
        </button>
      </div>
      <motion.div
        className="h-full flex flex-col overflow-hidden "
        // initial={{ x: 100 }}
        // animate={{ x: 0 }}
        // transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Chat messages container */}
        <div
          className="flex-grow overflow-y-auto p-4 bg-white dark:bg-gray-900"
          ref={chatContainerRef}
        >
          {messages.map((msg, index) => (
            <ChatBubble
              key={index}
              message={msg}
              isCurrentUser={msg?.user?._id === userId}
              darkMode={darkMode}
            />
          ))}
        </div>

        {/* Input field for sending a message */}
        <form
          onSubmit={sendMessage}
          className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center bg-white dark:bg-gray-800"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 rounded-l-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="p-2 rounded-r-md bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ChatRoom;
