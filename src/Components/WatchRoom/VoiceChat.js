import React, { useState, useEffect, useRef } from "react";
import SimplePeer from "simple-peer";
import { MicrophoneIcon, PhoneIcon } from "@heroicons/react/24/solid";

const VoiceChat = ({ roomId, userId, socket }) => {
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [micEnabled, setMicEnabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const myAudioRef = useRef(null);
  const peersRef = useRef({});
  const streamRef = useRef(null);

  useEffect(() => {
    console.log("VoiceChat component mounted");

    const initializeStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone access granted");
        setStream(mediaStream);
        streamRef.current = mediaStream;
        if (myAudioRef.current) {
          myAudioRef.current.srcObject = mediaStream;
        }
        // Emit ready-to-connect only after stream is initialized
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices)
        socket.emit("ready-to-connect", { roomId });
      } catch (error) {
        console.error("Mic access denied:", error);
        setErrorMsg("Microphone access denied. Please check your browser settings.");
      }
    };

    initializeStream();

    socket.on("user-joined", ({ peerId }) => {
      console.log("User joined:", peerId);
      if (streamRef.current) {
        const peer = createPeer(peerId, socket.id, streamRef.current);
        peersRef.current[peerId] = peer;
        setPeers(prevPeers => ({
          ...prevPeers,
          [peerId]: peer
        }));
      } else {
        console.error("Stream not available when user joined");
      }
    });

    socket.on("receive-signal", ({ signal, peerId }) => {
      console.log("Received signal from peer:", peerId);
      if (!peersRef.current[peerId]) {
        const peer = addPeer(signal, peerId, streamRef.current);
        peersRef.current[peerId] = peer;
        setPeers(prevPeers => ({
          ...prevPeers,
          [peerId]: peer
        }));
      } else {
        peersRef.current[peerId].signal(signal);
      }
    });

    socket.on("user-disconnected", (peerId) => {
      console.log("User disconnected:", peerId);
      if (peersRef.current[peerId]) {
        peersRef.current[peerId].destroy();
        const newPeers = { ...peersRef.current };
        delete newPeers[peerId];
        peersRef.current = newPeers;
        setPeers(newPeers);
      }
    });

    return () => {
      console.log("VoiceChat component unmounting");
      socket.off("user-joined");
      socket.off("receive-signal");
      socket.off("user-disconnected");
      Object.values(peersRef.current).forEach(peer => peer.destroy());
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomId, socket]);

  function createPeer(peerId, myPeerId, stream) {
    console.log("Creating peer connection with:", peerId);
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", signal => {
      console.log("Sending signal to peer:", peerId);
      socket.emit("send-signal", { signal, peerId, roomId });
    });

    peer.on("stream", remoteStream => {
      console.log("Received stream from peer:", peerId);
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.play().catch(e => console.error("Error playing audio:", e));
    });

    peer.on("error", err => {
      console.error("Peer connection error:", err);
      setErrorMsg(`Peer connection error: ${err.message}`);
    });

    return peer;
  }

  function addPeer(incomingSignal, peerId, stream) {
    console.log("Adding peer connection with:", peerId);
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", signal => {
      console.log("Sending signal to peer:", peerId);
      socket.emit("send-signal", { signal, peerId, roomId });
    });

    peer.on("stream", remoteStream => {
      console.log("Received stream from peer:", peerId);
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.play().catch(e => console.error("Error playing audio:", e));
    });

    peer.on("error", err => {
      console.error("Peer connection error:", err);
      setErrorMsg(`Peer connection error: ${err.message}`);
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setMicEnabled(audioTrack.enabled);
      console.log("Microphone toggled:", audioTrack.enabled ? "on" : "off");
    }
  };

  return (
    <div className="voice-chat flex flex-col items-center  bg-gray-800  rounded-lg">
      <button onClick={toggleMic} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
        <MicrophoneIcon className={`h-6 w-6 ${micEnabled ? 'text-green-500' : 'text-red-500'}`} />
      </button>
      {/* <div className="text-white">
        {Object.keys(peers).length} connected
      </div>
      {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>} */}
      <audio ref={myAudioRef} muted />
    </div>
  );
};

export default VoiceChat;