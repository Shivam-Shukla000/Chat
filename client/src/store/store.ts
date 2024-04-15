import { Socket } from "socket.io-client";
import { create } from "zustand";

type IRemoteStreams = {
  stream: MediaStream;
  id: string;
};

type IUseSocketStore = {
  socket: Socket | null;
  userId: string | null;
  connected: boolean;
  peer: RTCPeerConnection | null;
  localStream: MediaStream | null;
  roomId: string | null;
  remoteStreams: IRemoteStreams[] | [];
  setSocket: (socket: Socket) => void;
  clearSocket: () => void;
  setConnected: (bool: boolean) => void;
  setPeer: (peer: RTCPeerConnection) => void;
  setLocalStream: (localStream: MediaStream) => void;
  setUserId: (userId: string) => void;
  setRoomId: (roomId: string) => void;

  setRemoteStreams: (stream: MediaStream, id: string) => void;
};
const useSocketStore = create<IUseSocketStore>((set) => ({
  socket: null,
  userId: null,
  connected: false,
  peer: null,
  localStream: null,
  roomId: null,
  remoteStreams: [],
  setSocket: (socket) => {
    set({ socket: socket });
  },
  clearSocket: () => {
    set({ socket: null });
  },
  setConnected: (bool) => {
    set({ connected: bool });
  },
  setPeer: (peer) => {
    set({ peer });
  },
  setLocalStream: (localStream) => {
    set({ localStream });
  },
  setUserId: (userId) => {
    set({ userId });
  },
  setRoomId: (roomId) => {
    set({ roomId });
  },
  setRemoteStreams: (stream, id) => {
    set((state) => ({
      remoteStreams: [...state.remoteStreams, { stream, id }],
    }));
  },
}));

export { useSocketStore };
