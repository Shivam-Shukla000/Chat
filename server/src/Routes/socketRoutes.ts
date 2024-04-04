import { Socket } from "socket.io";
import { handleCreateRoom } from "../controller/socketController";

const socketRoutes = (socket: Socket) => {
  socket.on("create-room", handleCreateRoom);
};

export { socketRoutes };
