import { Server, Socket } from "socket.io";
import {
  handleJoinRoom,
  handleCreateRoom,
  handleOffer,
  handleAnswer,
  getRoomList,
} from "../controller/socketController";

const socketRoutes = (socket: Socket, io: Server, userId: string) => {
  socket.on("get-room-list", getRoomList);
  socket.on("create-room", () => handleCreateRoom(socket, io, userId));
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
    (sdpAnswer: RTCSessionDescription, roomId: string, userId: string) => {
      handleAnswer(sdpAnswer, roomId, socket, userId);
    }
  );

  socket.on(
    "iceCandidate",
    (iceCandidate: RTCIceCandidate, roomId: string, userId: string | null) => {
      socket.to(roomId).emit("iceCandidate", iceCandidate, userId);
    }
  );
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
};

export { socketRoutes };
