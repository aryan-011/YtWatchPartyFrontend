import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import VideoPlayer from "./VideoPlayer";
import Sidebar from "./Sidebar";
import ControlBar from "./ControlBar";
import { useDispatch } from "react-redux";
import { initMessages,addMessage, incUnreadCount, resetUnreadCount } from "../../Redux/messageSlice";


const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);

const WatchRoom = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [unreadMessages,setUnreadMessages] =useState(false);
  const dispatch=useDispatch();
  useEffect(() => {
    const storedId = localStorage.getItem("id");
    if (storedId) {
      setUserId(storedId);
      socket.emit("joinRoom", { roomId, userId: storedId });

      socket.on("roomData", (data) => {
        setRoomData(data);
        console.log(data)
        setParticipants(data.users)
        dispatch(initMessages(data.recentMessages))
        setLoading(false);
      });

      socket.on("chatMessage", (message) => {
        dispatch(addMessage({ ...message, isRead: sidebarContent === "chat" })); 
      });

      socket.on("videoStateUpdate", (data) => {
        applyVideoStateChange(data);
      });

      socket.on("error", (errorMessage) => {
        console.log(errorMessage);
        setError(errorMessage);
        setLoading(false);
      });
    } else {
      setError("No userId found. Please log in again.");
      setLoading(false);
    }

    return () => {
      socket.off("roomData");
      socket.off("videoStateUpdate");
      socket.off("error");
      socket.emit("leaveRoom", { roomId, userId: storedId });
      socket.disconnect();
    };
  }, [roomId]);

  const applyVideoStateChange = (data) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      if (data.currentTime > currentTime) {
        playerRef.current.seekTo(data.currentTime, true);
      }
      if (data.state === window.YT.PlayerState.PLAYING) {
        playerRef.current.playVideo();
      } else if (data.state === window.YT.PlayerState.PAUSED) {
        playerRef.current.pauseVideo();
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const openSidebar = (content) => {
    if (content === "chat") {
      dispatch(resetUnreadCount());  
    }
    setSidebarContent(content);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-red-500 text-xl font-semibold">Error: {error}</div>
      </div>
    );

  if (!roomData)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-red-500 text-xl font-semibold">
          Error: Room data not received
        </div>
      </div>
    );


  return (
    <div
      className={`h-full flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900 overflow-hidden"
      }`}
    >
      <div className="max-h-[87%] flex-grow flex p-6">
        {/* Video Section */}
        <VideoPlayer
          roomData={roomData}
          playerRef={playerRef}
          roomId={roomId}
          socket={socket}
        />
        {/* Sidebar */}
        {sidebarContent && (
          <Sidebar
            content={sidebarContent}
            roomId={roomId}
            participants={participants}
            userId={userId}
            darkMode={darkMode}
            roomData={roomData}
            openSidebar={openSidebar}
            socket={socket}
            setUnreadMessages={setUnreadMessages}
            unreadMessages={unreadMessages}
          />
        )}
      </div>
      {/* Control Bar */}
      <ControlBar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        sidebarContent={sidebarContent}
        openSidebar={openSidebar}
      />
    </div>
  );
};

export default WatchRoom;
