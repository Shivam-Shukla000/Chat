import Browse from "./views/Browse";
import Lobby from "./views/Lobby";
import Settings from "./views/Settings";
import Friends from "./views/Friends";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { useSocketStore } from "./store/store";
import { Routes, Route } from "react-router-dom";
import Layouts from "./Layouts";
import About from "./views/About";
import connect from "./utils/connect";
import { useEffect } from "react";
import { createOffer, handleSocket } from "./utils/handleSocket";
// import { disconnectHandler } from "./store/socketHandle";

function App() {
  const setRoomId = useSocketStore((state) => state.setRoomId);
  const roomId = useSocketStore((state) => state.roomId);
  const userId = useSocketStore((state) => state.userId);
  const setUserId = useSocketStore((state) => state.setUserId);
  const socket = useSocketStore((state) => state.socket);
  const setSocket = useSocketStore((state) => state.setSocket);
  const connected = useSocketStore((state) => state.connected);
  const setConnected = useSocketStore((state) => state.setConnected);
  const peer = useSocketStore((state) => state.peer);
  const setPeer = useSocketStore((state) => state.setPeer);
  const setLocalStream = useSocketStore((state) => state.setLocalStream);
  const setRemoteStreams = useSocketStore((state) => state.setRemoteStreams);

  useEffect(() => {
    if (connected) {
      return;
    } else {
      console.log("trying to connect");
      const mySocket = connect("http://localhost:4000");
      setSocket(mySocket);
    }
  }, []);

  if (socket) {
    socket.on("connect", () => {
      setConnected(true);
      handleSocket(
        socket,
        setConnected,
        setRoomId,
        userId,
        setUserId,
        setLocalStream,
        setRemoteStreams,
        setPeer
      );
    });
  } else {
    setConnected(false);
  }

  return (
    <>
      <ChakraProvider>
        <Routes>
          <Route path="/" element={<Layouts />}>
            <Route index element={<Lobby />} />
            <Route path="browse" element={<Browse />} />
            <Route path="friends" element={<Friends />} />
            <Route path="settings" element={<Settings />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </ChakraProvider>
    </>
  );
}

export default App;
