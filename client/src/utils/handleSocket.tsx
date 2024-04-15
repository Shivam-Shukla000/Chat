import { Socket } from "socket.io-client";
import { useSocketStore } from "../store/store";

//configuration for STUN servers
const peerConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"], // free STUN servers from google
    },
  ],
};

type IPeers = {
  userId: string;
  peer: RTCPeerConnection;
};
let remotePeers: IPeers[] = [];

let localStream: MediaStream;
let myId: string;

const createPeerConnection = async (
  roomId: string,
  socket: Socket,
  setLocalStream: (localStream: MediaStream) => void,
  setRemoteStreams: (stream: MediaStream, id: string) => void,
  userId: string
) => {
  const pc = new RTCPeerConnection(peerConfiguration);
  if (!localStream) {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
  }

  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  setLocalStream(localStream);

  pc.ontrack = (event) => {
    console.log("pc on track");
    event.streams.forEach((stream) => {
      console.log(stream);
      setRemoteStreams(stream, userId);

      stream.getTracks().forEach((track) => {
        pc.addTrack(track);
      });
    });
  };

  pc.onicecandidate = async (event) => {
    if (event.candidate) {
      socket.emit("iceCandidate", event.candidate, roomId, myId, userId);
    }
  };

  return pc;
};

// runs after room-joined event
const createOffer = async (
  roomId: string,
  socket: Socket,
  setLocalStream: (localStream: MediaStream) => void,
  setRemoteStreams: (stream: MediaStream, id: string) => void,
  userId: string
) => {
  try {
    // create a rtc connection and add eventlisteners
    const peer: RTCPeerConnection = await createPeerConnection(
      roomId,
      socket,
      setLocalStream,
      setRemoteStreams,
      userId
    );

    const sdpOffer = await peer.createOffer();
    await peer.setLocalDescription(sdpOffer);

    socket.emit("offer", sdpOffer, roomId, myId, userId);
    return peer;
  } catch (error) {
    console.log("error" + error);
  }
};

const createAnswer = async (
  sdpOffer: RTCSessionDescriptionInit,
  userId: string,
  socket: Socket,
  roomId: string,
  setLocalStream: (localStream: MediaStream) => void,
  setRemoteStreams: (stream: MediaStream, id: string) => void
) => {
  //add offer as remote discription
  const peer = await createPeerConnection(
    roomId,
    socket,
    setLocalStream,
    setRemoteStreams,
    userId
  );
  await peer.setRemoteDescription(sdpOffer);

  //now creare answer and send it after setting it to localdescriptor
  const sdpAnswer = await peer.createAnswer();
  await peer.setLocalDescription(sdpAnswer);
  if (socket) {
    socket.emit("answer", sdpAnswer, roomId, userId);
  }
};

const handleSocket = (
  socket: Socket,
  setConnected: (bool: boolean) => void,
  setRoomId: (roomId: string) => void,
  userId: string | null,
  setUserId: (userId: string) => void,
  setLocalStream: (localStream: MediaStream) => void,
  setRemoteStreams: (stream: MediaStream, id: string) => void,
  setPeer: (peer: RTCPeerConnection) => void
) => {
  socket.on("disconnect", () => {
    setConnected(false);
  });
  socket.on("userId", (userId1: string) => {
    myId = userId1.split("--|--")[1];
    setUserId(myId);

    socket.on("room-created", async (roomData: string) => {
      const roomId = roomData.split("--|--")[1];
      setRoomId(roomId);
    });

    socket.on("room-joined", async (roomData: string) => {
      const roomId1 = roomData.split("--|--")[1];
      setRoomId(roomId1);

      // const peer = await createOffer(
      //   roomId1,
      //   socket,
      //   setLocalStream,
      //   setRemoteStreams
      // );
      socket.on("user-joined", async (userId) => {
        // check peerExist to avoid making duplicates
        if (!peerExist(userId)) {
          const peer = await createOffer(
            roomId1,
            socket,
            setLocalStream,
            setRemoteStreams,
            userId
          );
          if (peer) {
            remotePeers.push({ peer, userId });
          }
        }

        socket.on(
          "offer",
          async (
            sdpOffer: RTCSessionDescriptionInit,
            senderId: string,
            recieverId: string
          ) => {
            if (recieverId === myId) {
              if (!peerExist(senderId)) {
                await createAnswer(
                  sdpOffer,
                  senderId,
                  socket,
                  roomId1,
                  setLocalStream,
                  setRemoteStreams
                );
              }
            }
          }
        );
      });

      socket.on(
        "answer",
        async (sdpAnswer: RTCSessionDescriptionInit, userId: string) => {
          try {
            if (peer && userId === id) {
              await peer.setRemoteDescription(sdpAnswer);
            }
          } catch (error) {
            console.log("error", error);
          }
        }
      );

      socket.on(
        "iceCandidate",
        (iceCandidate: RTCIceCandidate, userId: string | null) => {
          try {
            if (peer) {
              if ((userId && userId === id) || userId === null) {
                console.log("userId added");

                peer.addIceCandidate(iceCandidate);
              }
              console.log("adding ice candidate");
            }
          } catch (error) {
            console.log("error", error);
          }
        }
      );
    });
  });
};

export { handleSocket, createOffer, createAnswer };
