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
  localStream: MediaStream | null;
  roomId: string | null;
  remoteStreams: IRemoteStreams[] | [];
  signal: number;
  setSocket: (socket: Socket) => void;
  clearSocket: () => void;
  setConnected: (bool: boolean) => void;
  setLocalStream: (localStream: MediaStream) => void;
  setUserId: (userId: string) => void;
  setRoomId: (roomId: string) => void;
  setRemoteStreams: (remoteStreams: IRemoteStreams[] | []) => void;
  setSignal: () => void;
};
const useSocketStore = create<IUseSocketStore>((set) => ({
  socket: null,
  userId: null,
  connected: false,
  localStream: null,
  roomId: null,
  remoteStreams: [],
  signal: 0,
  setSocket: (socket) => {
    set({ socket: socket });
  },
  clearSocket: () => {
    set({ socket: null });
  },
  setConnected: (bool) => {
    set({ connected: bool });
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
  setRemoteStreams: (remoteStreams) => {
    set({
      remoteStreams: remoteStreams,
    });
  },
  setSignal: () => {
    set((state) => ({
      signal: state.signal + 1,
    }));
  },
}));

export { useSocketStore };
