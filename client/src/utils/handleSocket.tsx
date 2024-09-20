import { Socket } from "socket.io-client";
import { useSocketStore } from "../store/store";
import { GridItem } from "@chakra-ui/react";

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

type IRemoteStreams = {
  stream: MediaStream;
  id: string;
};

let remoteStreams: IRemoteStreams[] = [];
let remotePeers: IPeers[] = [];
let localStream: MediaStream;
let myId: string;
let pendingRequestId: string | null = null;

const setPendingRequestId = (id: string | null) => {
  pendingRequestId = id;
};

const getPendingRequestId = () => {
  return pendingRequestId;
};

const removeAudioFromTrack = async () => {
  const media = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  const track = media.getTracks()[0];
  console.log(track);

  track.enabled = false;
  console.log(track);

  // remotePeers.forEach((peerObj) => {
  //   peerObj.peer.addTrack(track, media);
  // });
};

const setStateOfMedia = (
  setRenderList: React.Dispatch<React.SetStateAction<JSX.Element[]>>
) => {
  const videos: JSX.Element[] = remoteStreams.map((stream) => {
    return (
      <>
        <GridItem padding={"1%"} bgSize={"100%"}>
          <video
            width={"100%"}
            key={stream.id}
            id={stream.id}
            ref={(ref) => {
              if (ref) {
                ref.srcObject = stream.stream;
              }
            }}
            autoPlay
            playsInline
            muted
          ></video>
        </GridItem>
      </>
    );
  });
  setRenderList(videos);
  return remoteStreams.length;
};

const remoteStreamExist = (userId: string) => {
  if (remoteStreams.length === 0) {
    return false;
  }
  for (let streamData of remoteStreams) {
    if (streamData.id === userId) {
      return false;
    }
    return false;
  }
};

const peerExist = (userId: string) => {
  if (remotePeers.length === 0) {
    return false;
  }
  for (let peerObject of remotePeers) {
    if (userId === peerObject.userId) {
      return true;
    }
  }
  return false;
};

const getPeerById: (peerId: string) => RTCPeerConnection | null = (
  peerId: string
) => {
  for (let peerObject of remotePeers) {
    if (peerId === peerObject.userId) {
      return peerObject.peer;
    }
  }
  return null;
};

const createPeerConnection = async (
  roomId: string,
  socket: Socket,
  userId: string,
  setSignal: () => void
) => {
  const pc = new RTCPeerConnection(peerConfiguration);

  // if (!localStream) {
  //   localStream = await navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: false,
  //   });
  // }
  pc.onnegotiationneeded = () => {
    createOffer(pc, roomId, socket, userId);
  };

  // localStream.getTracks().forEach((track) => {
  //   pc.addTrack(track, localStream);
  // });
  // setLocalStream(localStream);

  pc.ontrack = (event) => {
    if (!remoteStreamExist(userId)) {
      remoteStreams.push({ stream: event.streams[0], id: userId });
      setSignal();
      event.streams.forEach((stream) => {
        console.log("steam", stream);

        stream.getTracks().forEach((track) => {
          console.log("track", track);

          pc.addTrack(track);
        });
      });
    }
  };

  pc.onicecandidate = async (event) => {
    if (event.candidate) {
      socket.emit("iceCandidate", event.candidate, roomId, myId, userId);
    }
  };
  pc.oniceconnectionstatechange = (event) => {
    console.log(event);
  };

  return pc;
};

// runs after room-joined event
const createOffer = async (
  peer: RTCPeerConnection,
  roomId: string,
  socket: Socket,
  userId: string
) => {
  try {
    // create a rtc connection and add eventlisteners

    const sdpOffer = await peer.createOffer();
    await peer.setLocalDescription(sdpOffer);
    socket.emit("offer", sdpOffer, roomId, myId, userId);
  } catch (error) {
    console.log("error" + error);
  }
};

const createAnswer = async (
  sdpOffer: RTCSessionDescriptionInit,
  userId: string,
  socket: Socket,
  roomId: string,
  peer: RTCPeerConnection
) => {
  try {
    //add offer as remote discription
    await peer.setRemoteDescription(sdpOffer);

    //now create answer and send it after setting it to localdescriptor
    const sdpAnswer = await peer.createAnswer();
    await peer.setLocalDescription(sdpAnswer);
    socket.emit("answer", sdpAnswer, roomId, myId, userId);
  } catch (error) {
    console.log("error", error);
    0;
  }
};

const handleSocket = (
  socket: Socket,
  setConnected: (bool: boolean) => void,
  setRoomId: (roomId: string) => void,
  userId: string | null,
  setUserId: (userId: string) => void,
  setLocalStream: (localStream: MediaStream) => void,
  setSignal: () => void
) => {
  socket.on("disconnect", () => {
    setConnected(false);
  });
  socket.on("userId", (userId1: string) => {
    myId = userId1.split("--|--")[1];
    setUserId(myId);

    socket.on("request-to-send-file", (senderId) => {
      setPendingRequestId(senderId);
    });

    socket.on("room-joined", async (roomData: string) => {
      const roomId1 = roomData.split("--|--")[1];

      setRoomId(roomId1);
      if (!localStream) {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      // const peer = await createOffer(
      //   roomId1,
      //   socket,
      //   setLocalStream,
      //   id
      // );
      /**
      socket.on("user-joined", async (userId: string) => {
        // check peerExist to avoid making duplicate

        if (!peerExist(userId)) {
          const peer = await createPeerConnection(
            roomId1,
            socket,
            userId,
            setSignal
          );
          console.log("user joined", peer);

          if (peer) {
            remotePeers.push({ peer, userId });
          }
          // localStream.getTracks().forEach((track) => {
          //   peer.addTrack(track, localStream);
          // });
          setLocalStream(localStream);
        }
      });
       */

      // handling : send a request,myId to all user in room to make peer connection and send offer
      socket.on("connectPeer", async (senderId) => {
        if (myId !== senderId) {
          const peer = await createPeerConnection(
            roomId1,
            socket,
            senderId,
            setSignal
          );
          if (peer) {
            localStream.getTracks().forEach((track) => {
              peer.addTrack(track, localStream);
            });
            setLocalStream(localStream);
            remotePeers.push({ peer, userId: senderId });
          }
        }
      });

      // handling: sdpOffer sent by peer
      socket.on(
        "offer",
        async (
          sdpOffer: RTCSessionDescriptionInit,
          senderId: string,
          recieverId: string
        ) => {
          console.log("offer");

          if (recieverId === myId) {
            let peer: RTCPeerConnection | null;
            if (!peerExist(senderId)) {
              peer = await createPeerConnection(
                roomId1,
                socket,
                senderId,
                setSignal
              );
              remotePeers.push({ peer, userId: senderId });
            } else {
              peer = getPeerById(senderId);
            }
            console.log("ran Offer");

            if (peer) {
              console.log("adding tack to peer Offer", peer);

              localStream.getTracks().forEach((track) => {
                peer.addTrack(track, localStream);
              });
              setLocalStream(localStream);
              createAnswer(sdpOffer, senderId, socket, roomId1, peer);
            }
          }
        }
      );
      // handling: sdpAnswer sent by peer that recieved sdpOffer
      socket.on(
        "answer",
        async (
          sdpAnswer: RTCSessionDescriptionInit,
          senderId: string,
          recieverId: string
        ) => {
          try {
            if (peerExist(senderId) && recieverId === myId) {
              const peer = getPeerById(senderId);

              if (peer) {
                peer.setRemoteDescription(sdpAnswer);
              }
            }
          } catch (error) {
            console.log("error", error);
          }
        }
      );
      // handling: iceCandidate sent by peer that generate it
      socket.on(
        "iceCandidate",
        (
          iceCandidate: RTCIceCandidate,
          senderId: string,
          recieverId: string
        ) => {
          try {
            if (peerExist(senderId) && recieverId === myId) {
              const peer = getPeerById(senderId);
              if (peer) {
                peer.addIceCandidate(iceCandidate);
                console.log("addded ice candida");
              }
            }
          } catch (error) {
            console.log("error", error);
          }
        }
      );
      socket.emit("connectPeer", myId, roomId1);
    });
  });
};

export {
  handleSocket,
  createOffer,
  createAnswer,
  setStateOfMedia,
  peerExist,
  getPeerById,
  peerConfiguration,
  myId,
  setPendingRequestId,
  getPendingRequestId,
  removeAudioFromTrack,
};
