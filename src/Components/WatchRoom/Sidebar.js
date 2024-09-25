import React from "react";
import { motion } from "framer-motion";
import MeetingDetails from "./RoomDetails";
import PeopleList from "./PeopleList";
import InCallMessages from "./ChatRoom";
import HostControls from "./RoomControls";

const Sidebar = ({
  content,
  roomId,
  participants,
  userId,
  darkMode,
  roomData,
  openSidebar,
  socket,
  setUnreadMessages,
  unreadMessages
}) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-1/3 bg-white dark:bg-gray-900 overflow-hidden m-2  border border-gray-300 dark:border-gray-700 rounded-lg"
    >
      {content === "details" && (
        <MeetingDetails roomId={roomId} onClose={() => openSidebar(null)} />
      )}
      {content === "people" && (
        <PeopleList participants={participants} onClose={() => openSidebar(null)} />
      )}
      {content === "chat" && (
        <InCallMessages
          socket={socket}
          roomId={roomId}
          userId={userId}
          darkMode={darkMode}
          roomData={roomData}
          setUnreadMessages={setUnreadMessages}
          onClose={() => openSidebar(null)}
        />
      )}
      {content === "controls" && <HostControls onClose={() => openSidebar(null)} />}
    </motion.div>
  );
};

export default Sidebar;
