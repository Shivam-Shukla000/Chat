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
// import { disconnectHandler } from "./store/socketHandle";
import Peer from "peerjs";

function App() {
  const setSocket = useSocketStore((state) => state.setSocket);
  const connected = useSocketStore((state) => state.connected);
  const setConnected = useSocketStore((state) => state.setConnected);
  const setPeer = useSocketStore((state) => state.setPeer);
  const peer = useSocketStore((state) => state.peer);
  useEffect(() => {
    if (connected) {
      return;
    } else {
      console.log("trying to connect");
      const mySocket = connect("http://localhost:4000");
      setSocket(mySocket);
    }
  }, []);
  const socket = useSocketStore((state) => state.socket);
  if (socket === null) {
    setConnected(false);
  }
  socket?.on("connect", () => {
    setConnected(true);
    socket?.on("disconnect", () => {
      setConnected(false);
    });
    socket?.on("userId", (userId: string) => {
      const id = userId.split("--|--")[1];
      console.log(id);
      const peer = new Peer(id);
      setPeer(peer);
    });
  });

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
