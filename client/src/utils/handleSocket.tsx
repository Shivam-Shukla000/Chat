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
type IDataPeers = {
  userId: string;
  peer: RTCPeerConnection;
};
type IRemoteStreams = {
  stream: MediaStream;
  id: string;
};

let remoteStreams: IRemoteStreams[] = [];
let remotePeers: IPeers[] = [];
let dataPeers: IDataPeers[] = [];
let localStream: MediaStream;
let myId: string;

const addDataPeer: (peer: RTCPeerConnection, id: string) => void = (
  peer,
  id
) => {
  console.log("added tp datapeers");

  dataPeers.push({ peer: peer, userId: id });
};

const getDataPeerById: (userId: string) => RTCPeerConnection | null = (
  userId
) => {
  for (let peerObj of dataPeers) {
    if (peerObj.userId === userId) {
      return peerObj.peer;
    }
  }
  return null;
};

const dataPeerExist = (userId: string) => {
  if (dataPeers.length === 0) {
    return false;
  }
  for (let peerObject of dataPeers) {
    if (peerObject.userId === userId) {
      return true;
    }
  }
  return false;
};

const connectPeer = (id: string, socket: Socket) => {
  let peer: RTCPeerConnection | null = null;
  if (peerExist(id)) {
    peer = getDataPeerById(id);
    console.log(peer);
  } else {
    peer = new RTCPeerConnection(peerConfiguration);
  }
  if (peer) {
    peer.onnegotiationneeded = async (event) => {
      const sdpOffer = await peer.createOffer();
      await peer.setLocalDescription(sdpOffer);
      socket.emit("dataSdpOffer", sdpOffer, myId, id);
      console.log("negotiate", peer.iceConnectionState);
    };
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("dataIceCandidate", event.candidate, myId, id);
      }
    };

    const dataChannel = peer.createDataChannel("myChannel");
    console.log("channel made", dataChannel);
    dataChannel.onopen = (event) => {
      console.log("onopen", event);
    };
    addDataPeer(peer, id);
  }
  // peer = new RTCPeerConnection(peerConfiguration);
  // peer.onnegotiationneeded = async (event) => {
  //     const sdpOffer = await peer?.createOffer()
  //     socket?.emit("DataOffer", sdpOffer, userId)
  // };
  // peer.createDataChannel("dataChat");
};

const setStateOfMedia = (
  setRenderList: React.Dispatch<React.SetStateAction<JSX.Element[]>>
) => {
  const videos: JSX.Element[] = remoteStreams.map((stream) => {
    return (
      <>
        <GridItem>
          <video
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
  setLocalStream: (localStream: MediaStream) => void,
  userId: string,
  setSignal: () => void
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
    if (!remoteStreamExist(userId)) {
      remoteStreams.push({ stream: event.streams[0], id: userId });
      setSignal();
      event.streams.forEach((stream) => {
        stream.getTracks().forEach((track) => {
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

  return pc;
};

// runs after room-joined event
const createOffer = async (
  roomId: string,
  socket: Socket,
  setLocalStream: (localStream: MediaStream) => void,
  userId: string,
  setSignal: () => void
) => {
  try {
    // create a rtc connection and add eventlisteners
    const peer: RTCPeerConnection = await createPeerConnection(
      roomId,
      socket,
      setLocalStream,
      userId,
      setSignal
    );
    peer.oniceconnectionstatechange = (event) => {
      console.log("gathingState", peer.iceConnectionState);
    };
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
  setSignal: () => void
) => {
  //add offer as remote discription\
  try {
    const peer = await createPeerConnection(
      roomId,
      socket,
      setLocalStream,
      userId,
      setSignal
    );
    await peer.setRemoteDescription(sdpOffer);
    const sdpAnswer = await peer.createAnswer();
    await peer.setLocalDescription(sdpAnswer);

    //now creare answer and send it after setting it to localdescriptor
    socket.emit("answer", sdpAnswer, roomId, myId, userId);

    return peer;
  } catch (error) {
    console.log("error", error);
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
    socket.on(
      "dataSdpOffer",
      async (dataSdpOffer: RTCSessionDescription, senderId: string) => {
        if (!dataPeerExist(senderId)) {
          let pc = new RTCPeerConnection(peerConfiguration);
          await pc.setRemoteDescription(dataSdpOffer);

          const dataSdpAnswer = await pc.createAnswer();

          pc.setLocalDescription(dataSdpAnswer);

          socket.emit("dataSdpAnswer", dataSdpAnswer, myId, senderId);
          pc.onicecandidate = (event) => {
            console.log("ice data inside ");

            if (event.candidate) {
              socket.emit("dataIceCandidate", event.candidate, myId, senderId);
            }
          };
          pc.ondatachannel = (event) => {
            console.log("data channel", event);
          };
          addDataPeer(pc, senderId);
        }
      }
    );
    socket.on(
      "dataSdpAnswer",
      async (dataSdpAnswer: RTCSessionDescription, senderId: string) => {
        if (dataPeerExist(senderId)) {
          const peer = getDataPeerById(senderId);
          if (peer) {
            await peer.setRemoteDescription(dataSdpAnswer);
          }
        }
      }
    );
    socket.on(
      "dataIceCandidate",
      async (dataIceCandidate: RTCIceCandidateInit, senderId: string) => {
        if (dataPeerExist(senderId)) {
          const peer = getDataPeerById(senderId);

          if (peer) {
            await peer.addIceCandidate(dataIceCandidate);
          }
        }
      }
    );
    socket.on("room-joined", (roomData: string) => {
      const roomId1 = roomData.split("--|--")[1];
      setRoomId(roomId1);
      console.log("room joined");

      // const peer = await createOffer(
      //   roomId1,
      //   socket,
      //   setLocalStream,
      //   id
      // );
      socket.on("user-joined", async (userId: string) => {
        // check peerExist to avoid making duplicates
        console.log("userJoined");
        console.log(!peerExist(userId));

        if (!peerExist(userId)) {
          const peer = await createOffer(
            roomId1,
            socket,
            setLocalStream,
            userId,
            setSignal
          );
          console.log("made peer");

          if (peer) {
            remotePeers.push({ peer, userId });
            console.log(remotePeers);
            console.log("new peer addded");
          }
        }
      });
      socket.on(
        "offer",
        async (
          sdpOffer: RTCSessionDescriptionInit,
          senderId: string,
          recieverId: string
        ) => {
          if (recieverId === myId) {
            if (!peerExist(senderId)) {
              // console.log("peer doesnt exist");
              // console.log(peerExist(senderId));
              // console.log(remotePeers.length);
              // console.log(senderId);
              // console.log("Boolean", !peerExist(senderId));
              const peer = await createAnswer(
                sdpOffer,
                senderId,
                socket,
                roomId1,
                setLocalStream,
                setSignal
              );
              if (peer) {
                remotePeers.push({ peer, userId: senderId });
              }
              console.log("offer recied answer made");
            }
          }
        }
      );

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
                peer.iceGatheringState;
                peer.setRemoteDescription(sdpAnswer);
                console.log("added sdp answer to peer");
              }
            }
          } catch (error) {
            console.log("error", error);
          }
        }
      );

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
  connectPeer,
};
