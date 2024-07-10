import { Socket } from "socket.io-client";
import { peerConfiguration, myId } from "./handleSocket";
import streamSaver from "streamsaver";

const worker = new Worker("../worker.js");

type IDataPeers = {
  userId: string;
  peer: RTCPeerConnection;
};
let dataPeers: IDataPeers[] = [];

let dataChannel: { channel: RTCDataChannel; id: string } | null = null;

const addDataPeer: (peer: RTCPeerConnection, id: string) => void = (
  peer,
  id
) => {
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

const connectPeer = (
  id: string,
  socket: Socket,
  setRequestSpinner: React.Dispatch<React.SetStateAction<boolean>>,
  file: File
) => {
  let peer: RTCPeerConnection | null = null;
  if (dataPeerExist(id)) {
    peer = getDataPeerById(id);
  } else {
    peer = new RTCPeerConnection(peerConfiguration);
  }
  socket.on(
    "dataIceCandidate",
    async (dataIceCandidate: RTCIceCandidateInit, senderId: string) => {
      if (dataPeerExist(senderId) && senderId === id) {
        if (peer) {
          console.log("added ice");
          await peer.addIceCandidate(dataIceCandidate);
        }
      }
    }
  );
  socket.on(
    "dataSdpAnswer",
    async (dataSdpAnswer: RTCSessionDescription, senderId: string) => {
      if (peer && senderId === id) {
        await peer.setRemoteDescription(dataSdpAnswer);
      }
    }
  );
  if (peer) {
    peer.onnegotiationneeded = async (event) => {
      const sdpOffer = await peer.createOffer();
      await peer.setLocalDescription(sdpOffer);
      socket.emit("dataSdpOffer", sdpOffer, myId, id);
    };
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ice sent");

        socket.emit("dataIceCandidate", event.candidate, myId, id);
      }
    };

    const dataChannel = peer.createDataChannel("myChannel");

    dataChannel.onopen = async (event) => {
      // dataChannel.onmessage = (event) => {
      //   console.log(event.data);
      // };

      const stream = file.stream();
      const reader = stream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          dataChannel.send(JSON.stringify({ done: true, fileName: file.name }));
          break;
        }

        dataChannel.send(value);
      }
    };
    setDataChannel(dataChannel, id);
    addDataPeer(peer, id);
  }
  // peer = new RTCPeerConnection(peerConfiguration);
  // peer.onnegotiationneeded = async (event) => {
  //     const sdpOffer = await peer?.createOffer()
  //     socket?.emit("DataOffer", sdpOffer, userId)
  // };
  // peer.createDataChannel("dataChat");
};

const handleDataRequestSocket = (socket: Socket, id: string) => {
  socket.on(
    "dataSdpOffer",
    async (dataSdpOffer: RTCSessionDescription, senderId: string) => {
      if (!dataPeerExist(senderId) && senderId === id) {
        let pc = new RTCPeerConnection(peerConfiguration);
        await pc.setRemoteDescription(dataSdpOffer);

        const dataSdpAnswer = await pc.createAnswer();

        await pc.setLocalDescription(dataSdpAnswer);

        socket.emit("dataSdpAnswer", dataSdpAnswer, myId, senderId);
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("ice sent");

            socket.emit("dataIceCandidate", event.candidate, myId, senderId);
          }
        };
        pc.ondatachannel = async (event) => {
          console.log("channel");
          let array: ArrayBuffer[] = [];
          event.channel.onmessage = (event) => {
            if (event.data.toString().includes("done")) {
              const data: { done: boolean; fileName: string } = JSON.parse(
                event.data
              );
              // const blob = new Blob(array);
              // const stream = blob.stream();
              // const fileStream = streamSaver.createWriteStream(data.fileName);
              // stream.pipeTo(fileStream);
              download(data.fileName);
            } else {
              array.push(event.data);
            }
          };
          setDataChannel(event.channel, senderId);
        };
        addDataPeer(pc, senderId);
      }
    }
  );
  const download = (fileName: string) => {
    console.log("download");

    worker.addEventListener("message", () => {
      console.log("adasdasdasddssda");
    });
    worker.onmessage = (event) => {
      console.log("ready to downlaod");

      const stream = event.data.stream();
      const fileStream = streamSaver.createWriteStream(fileName);
      stream.pipeTo(fileStream);
    };
    worker.postMessage("download");
  };
  socket.on(
    "dataIceCandidate",
    async (dataIceCandidate: RTCIceCandidateInit, senderId: string) => {
      if (dataPeerExist(senderId) && senderId === id) {
        const peer = getDataPeerById(senderId);

        if (peer) {
          console.log("added ice");

          await peer.addIceCandidate(dataIceCandidate);
        }
      }
    }
  );
};

const getDataChannelById: (id: string) => RTCDataChannel | null = (id) => {
  if (dataChannel && dataChannel.id === id) {
    return dataChannel.channel;
  } else {
    return null;
  }
};

const setDataChannel: (channel: RTCDataChannel, id: string) => void = (
  channel,
  id
) => {
  dataChannel = { channel, id };
};

export { connectPeer, handleDataRequestSocket };
