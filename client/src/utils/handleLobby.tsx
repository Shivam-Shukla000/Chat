import { Socket } from "socket.io-client";

type ILobbyData = {
  name: string;
  password: string;
  size: number;
};

const createLobby = (socket: Socket, lobbydata: ILobbyData) => {
  socket.emit("create-room", lobbydata);

  console.log("create lobby");
};

const joinLobby = (roomId: string, socket: Socket) => {
  socket.emit("join-room", roomId);
};

export { createLobby, joinLobby };
