import React from 'react';

const ChatBubble = ({ message, isCurrentUser, darkMode }) => {
  const bubbleClass = isCurrentUser
    ? 'bg-indigo-500 text-white'  // Color for the current user
    : darkMode
    ? 'bg-gray-700 text-white'    // Color for the other users in dark mode
    : 'bg-gray-200 text-gray-900'; // Color for the other users in light mode

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[75%] px-3 py-1 rounded-md ${bubbleClass} shadow-sm`}>
        <div className="flex items-center mb-1">
          <span className="font-bold text-xs truncate">{message?.user?.name || "Unknown User"}</span>
          <span className="ml-2 text-xs opacity-50">
            {message?.timestamp && !isNaN(new Date(message.timestamp).getTime())
              ? new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Invalid Date"}
          </span>
        </div>
        <p className="text-xs max-h-16 overflow-hidden break-words line-clamp-3">
          {message?.content || "Message content missing"}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
