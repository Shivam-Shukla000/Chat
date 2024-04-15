import { Server, Socket } from "socket.io";

const rooms: string[] = [];

const getSocketRoom = (socket: Socket) => {
  const array: string[] = [];
  socket.rooms.forEach((roomId) => {
    if (roomId !== socket.id) {
      array.push(roomId);
    }
  });
  return array;
};

const clearSocketRooms = (socket: Socket) => {
  const roomsArray = getSocketRoom(socket);
  if (roomsArray[0]) {
    for (const id of roomsArray) {
      socket.leave(id);
    }
  }
};

import { v4 as uuidV4 } from "uuid";
const handleCreateRoom = (socket: Socket, io: Server, userId: string) => {
  clearSocketRooms(socket);
  const roomId = uuidV4();
  socket.join(roomId);
  rooms.push(roomId);
  io.to(roomId).emit("user-joined", userId);
  socket.emit("room-joined", `roomId--|--${roomId}`);
};

//called when new user joins
const handleJoinRoom = async (
  socket: Socket,
  userId: string,
  roomId: string,
  io: Server
) => {
  // const sockets = await io.in(roomId).fetchSockets();
  // console.log(sockets);

  clearSocketRooms(socket);
  socket.join(roomId);
  socket.to(roomId).emit("user-joined", userId);
  socket.emit("room-joined", `roomId--|--${roomId}`);
};

const handleOffer = (
  sdpOffer: RTCSessionDescriptionInit,
  roomId: string,
  socket: Socket,
  senderId: string,
  recieverId: string
) => {
  socket.to(roomId).emit("offer", sdpOffer, senderId, recieverId);
};

const handleAnswer = (
  sdpAnswer: RTCSessionDescriptionInit,
  roomId: string,
  socket: Socket,
  userId: string
) => {
  socket.to(roomId).emit("answer", sdpAnswer, userId);
};

const getRoomList = (cb: (arr: string[]) => void) => {
  cb(rooms);
};

export {
  handleCreateRoom,
  handleOffer,
  handleAnswer,
  handleJoinRoom,
  getRoomList,
};
