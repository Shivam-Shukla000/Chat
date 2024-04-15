import { Box, Flex, Button } from "@chakra-ui/react";
import ConnectButton from "../component/ConnectButton";
import { createLobby, joinLobby } from "../utils/handleLobby";
import { useSocketStore } from "../store/store";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

const Browse: () => JSX.Element = () => {
  const [lobbyList, setLobbyList] = useState<JSX.Element[]>();
  const socket = useSocketStore((state) => {
    return state.socket;
  });
  const btnMargin = "1%";
  const renderLobby = (list: string[]) => {
    const render: JSX.Element[] = list.map((item) => {
      return (
        <>
          <Flex key={item}>
            <h2>{item}</h2>
            <Button
              onClick={() => {
                if (socket) {
                  joinLobby(item, socket);
                }
              }}
            >
              joinroom
            </Button>
          </Flex>
        </>
      );
    });
    setLobbyList(render);
  };
  const getRoomList = (socket: Socket) => {
    socket.emit("get-room-list", renderLobby);
  };
  useEffect(() => {
    if (socket) {
      getRoomList(socket);
    }
  }, []);
  return (
    <>
      <Flex flexDirection={"column"}>
        <Flex margin={"0px"} padding={"1%"} justifyContent={"end"} id="btns">
          <Button
            onClick={() => {
              if (socket) {
                createLobby(socket);
              }
            }}
            margin={btnMargin}
          >
            create lobby
          </Button>
          <Button
            margin={btnMargin}
            onClick={() => {
              if (socket) getRoomList(socket);
            }}
          >
            sort lobby
          </Button>
        </Flex>
        <Flex id="lobbyList">{lobbyList}</Flex>
        <Flex id="pagination"></Flex>
      </Flex>
    </>
  );
};

export default Browse;
