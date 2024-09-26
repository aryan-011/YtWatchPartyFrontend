import React from "react";
import {
  SunIcon,
  MoonIcon,
  InformationCircleIcon,
  UserGroupIcon,
  PaperAirplaneIcon as ChatIcon,
  CogIcon,
} from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import VoiceChat from "./VoiceChat";

const ControlBar = ({
  userId,
  socket,
  roomId,
  sidebarContent,
  openSidebar,
  toggleVoiceChat, 
  voiceChatActive ,
}) => {
  const unreadCount = useSelector((state) => state.messages.unreadCount);
  return (
    <div className="fixed bottom-7 left-1/2 transform -translate-x-1/2 flex items-center space-x-7 py-4 px-10 bg-gray-800 text-white rounded-full shadow-2xl z-50">
      <VoiceChat roomId={roomId} socket={socket} userId={userId}/>
      <button
        className={`${
          sidebarContent === "details"
            ? "text-indigo-400"
            : "hover:text-gray-400"
        }`}
        onClick={() => openSidebar("details")}
      >
        <InformationCircleIcon className="h-7 w-7" />
      </button>
      <button
        className={`${
          sidebarContent === "people"
            ? "text-indigo-400"
            : "hover:text-gray-400"
        }`}
        onClick={() => openSidebar("people")}
      >
        <UserGroupIcon className="h-7 w-7" />
      </button>
      <button
        className={`relative ${
          sidebarContent === "chat" ? "text-indigo-400" : "hover:text-gray-400"
        }`}
        onClick={() => openSidebar("chat")}
      >
        <ChatIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 h-2 w-2 rounded-full"></span>
        )}

      </button>
      <button
        className={`${
          sidebarContent === "controls"
            ? "text-indigo-400"
            : "hover:text-gray-400"
        }`}
        onClick={() => openSidebar("controls")}
      >
        <CogIcon className="h-7 w-7" />
      </button>
      {/* <button className="hover:text-gray-400" onClick={toggleDarkMode}>
        {darkMode ? (
          <SunIcon className="h-7 w-7" />
        ) : (
          <MoonIcon className="h-7 w-7" />
        )}
      </button> */}
    </div>
  );
};

export default ControlBar;
