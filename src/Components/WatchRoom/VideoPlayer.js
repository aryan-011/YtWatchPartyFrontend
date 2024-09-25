import React, { useEffect } from "react";

const VideoPlayer = ({ roomData, playerRef, roomId, socket }) => {
  useEffect(() => {
    if (roomData) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        const videoId = new URLSearchParams(
          new URL(roomData.room.videoLink).search
        ).get("v");
        const newPlayer = new window.YT.Player("youtube-player", {
          height: "100%",
          width: "100%",
          videoId: videoId,
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
          playerVars: {
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin,
          },
        });
        playerRef.current = newPlayer;
      };
    }
  }, [roomData]);

  const onPlayerReady = () => {
    socket.emit("playerReady", roomId);
  };

  const onPlayerStateChange = (event) => {
    const state = event.data;
    const currentTime = playerRef.current.getCurrentTime();
    socket.emit("videoStateChange", { roomId, state, currentTime });
  };

  return <div id="youtube-player" className="h-full w-full m-2 rounded-lg "></div>;
};

export default VideoPlayer;
