import { Server, Socket } from "socket.io";
import { getSocketById } from "../lib/socketLib";

type IData = {
  name: string;
  password: string;
  size: number;
};

interface ILobbyData extends IData {
  roomId: string;
}

const rooms: ILobbyData[] = [];

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
const handleCreateRoom = (socket: Socket, data: IData) => {
  clearSocketRooms(socket);
  const roomId = uuidV4();
  rooms.push({ ...data, roomId });
  console.log(rooms);
  socket.join(roomId);
  socket.emit("room-joined", `roomId--|--${roomId}`);
};

// called when new user joins
const handleJoinRoom = async (
  socket: Socket,
  userId: string,
  roomId: string,
  io: Server
) => {
  const sockets = await io.in(roomId).fetchSockets();
  console.log(sockets.length);
  console.log("room joined");

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
  console.log("offer send");
};

const handleAnswer = (
  sdpAnswer: RTCSessionDescriptionInit,
  roomId: string,
  socket: Socket,
  senderId: string,
  recieverId: string
) => {
  socket.to(roomId).emit("answer", sdpAnswer, senderId, recieverId);
  console.log("answer sent");
};

const handleMessageSend = (
  socket: Socket,
  message: string,
  userId: string,
  roomId: string,
  cb: () => void
) => {
  socket.to(roomId).emit("message", message, userId);
  cb();
};

const handleDataSdpOffer = (
  dataSdpOffer: RTCSessionDescriptionInit,
  senderId: string,
  recieverId: string
) => {
  const socket = getSocketById(recieverId);
  if (socket) {
    socket.emit("dataSdpOffer", dataSdpOffer, senderId);
  }
};

const handleDataSdpAnswer = (
  dataSdpAnswer: RTCSessionDescriptionInit,
  senderId: string,
  recieverId: string
) => {
  const socket = getSocketById(recieverId);
  if (socket) {
    socket.emit("dataSdpAnswer", dataSdpAnswer, senderId);
  }
};

const handleDataIceCandidate = (
  dataIceCandidate: RTCIceCandidate,
  senderId: string,
  recieverId: string
) => {
  const socket = getSocketById(recieverId);
  if (socket) {
    socket.emit("dataIceCandidate", dataIceCandidate, senderId);
  }
};

const getRoomList = (cb: (lobbyData: ILobbyData[]) => void) => {
  cb(rooms);
};

const handleFileSendRequest: (
  senderId: string,
  recieverId: string,
  cb: (bool: boolean) => void
) => void = (senderId, recieverId, cb) => {
  const socket = getSocketById(recieverId);
  if (socket) {
    socket.emit("request-to-send-file", senderId);
    cb(true);
  } else {
    cb(false);
  }
};

const handleFileSendRequestAccepted: (
  senderId: string,
  recieverId: string,
  cb: () => void
) => void = (senderId, recieverId, cb) => {
  const socket = getSocketById(recieverId);
  if (socket) {
    console.log("accept");

    socket.emit("request-to-send-file-response", senderId);
    cb();
  }
};

export {
  handleCreateRoom,
  handleOffer,
  handleAnswer,
  handleJoinRoom,
  getRoomList,
  handleMessageSend,
  handleDataSdpOffer,
  handleDataSdpAnswer,
  handleDataIceCandidate,
  handleFileSendRequest,
  handleFileSendRequestAccepted,
};
