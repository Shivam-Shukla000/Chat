import { Server, Socket } from "socket.io";
import {
  handleJoinRoom,
  handleCreateRoom,
  handleOffer,
  handleAnswer,
  getRoomList,
  handleMessageSend,
  handleDataSdpOffer,
  handleDataSdpAnswer,
  handleDataIceCandidate,
} from "../controller/socketController";
import { removeFromSocketArray } from "../lib/socketLib";

const socketRoutes = (socket: Socket, io: Server, userId: string) => {
  socket.on("get-room-list", getRoomList);
  socket.on("create-room", (data) => handleCreateRoom(socket, data));
  socket.on("join-room", (roomId) =>
    handleJoinRoom(socket, userId, roomId, io)
  );
  socket.on(
    "offer",
    (
      sdpOffer: RTCSessionDescriptionInit,
      roomId: string,
      senderId: string,
      recieverId: string
    ) => {
      console.log("offer sent");
      handleOffer(sdpOffer, roomId, socket, senderId, recieverId);
    }
  );

  socket.on(
    "answer",
    (
      sdpAnswer: RTCSessionDescription,
      roomId: string,
      senderId: string,
      recieverId: string
    ) => {
      handleAnswer(sdpAnswer, roomId, socket, senderId, recieverId);
    }
  );

  socket.on(
    "iceCandidate",
    (
      iceCandidate: RTCIceCandidate,
      roomId: string,
      senderId: string,
      recieverId: string
    ) => {
      socket
        .to(roomId)
        .emit("iceCandidate", iceCandidate, senderId, recieverId);
      console.log("ice acan");
    }
  );
  socket.on(
    "message",
    (message: string, userId: string, roomId: string, cb: () => void) =>
      handleMessageSend(socket, message, userId, roomId, cb)
  );
  socket.on("disconnect", () => {
    removeFromSocketArray(userId);
    console.log("user disconnected");
  });
  socket.on(
    "dataSdpOffer",
    (
      dataSdpOffer: RTCSessionDescriptionInit,
      senderId: string,
      recieverId: string
    ) => [handleDataSdpOffer(dataSdpOffer, senderId, recieverId)]
  );
  socket.on(
    "dataSdpAnswer",
    (
      dataSdpAnswer: RTCSessionDescriptionInit,
      senderId: string,
      recieverId: string
    ) => {
      handleDataSdpAnswer(dataSdpAnswer, senderId, recieverId);
    }
  );
  socket.on(
    "dataIceCandidate",
    (
      dataIceCandidate: RTCIceCandidate,
      senderId: string,
      recieverId: string
    ) => {
      handleDataIceCandidate(dataIceCandidate, senderId, recieverId);
    }
  );
};

export { socketRoutes };
