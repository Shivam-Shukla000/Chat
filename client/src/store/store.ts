import Peer from "peerjs";
import { Socket } from "socket.io-client";
import { create } from "zustand";

type IUseSocketStore = {
  socket: Socket | null;
  connected: boolean;
  peer: Peer | null;
  stream: MediaStream | null;
  setSocket: (socket: Socket) => void;
  clearSocket: () => void;
  setConnected: (bool: boolean) => void;
  setPeer: (peer: Peer) => void;
  setStream: (stream: MediaStream) => void;
};
const useSocketStore = create<IUseSocketStore>((set) => ({
  socket: null,
  connected: false,
  peer: null,
  stream: null,
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
  setStream: (stream) => {
    set({ stream });
  },
}));

export { useSocketStore };
