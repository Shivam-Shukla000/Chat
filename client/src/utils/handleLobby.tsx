import { Socket } from "socket.io-client";

const createLobby = (socket: Socket) => {
  socket.emit("create-room");

  console.log("create lobby");
};

const joinLobby = (roomId: string, socket: Socket) => {
  socket.emit("join-room", roomId);
};

export { createLobby, joinLobby };
