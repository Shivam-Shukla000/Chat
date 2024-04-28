import { Socket } from "socket.io";

type ISocket = {
  socket: Socket;
  id: string;
};

const allSocket: ISocket[] = [];

const getSocketById: (id: string) => Socket | null = (id) => {
  for (const socketObj of allSocket) {
    if (socketObj.id === id) {
      return socketObj.socket;
    }
  }
  return null;
};

const addToSocketArray = (socket: Socket, id: string) => {
  allSocket.push({ socket, id });
};

const removeFromSocketArray = (id: string) => {
  let i: number = 0;
  for (const socketObj of allSocket) {
    if (socketObj.id === id) {
      allSocket.splice(i, 1);
    }
    i++;
  }
};

export { getSocketById, addToSocketArray, removeFromSocketArray };
