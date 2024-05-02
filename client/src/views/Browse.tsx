import { Box, Flex, Button, useDisclosure } from "@chakra-ui/react";
import ConnectButton from "../component/ConnectButton";
import { createLobby, joinLobby } from "../utils/handleLobby";
import { useSocketStore } from "../store/store";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import CreateLobby from "../component/CreateLobby";
import SendFile from "../component/SendFile";
import { useNavigate } from "react-router-dom";
import PendingRequest from "../component/PendingRequest";
type ILobbyData = {
  name: string;
  password: string;
  size: number;
  roomId: string;
};

const colorSec = "#FFF3DB";
const colorPrim = "#FFD6E2";

const Browse: () => JSX.Element = () => {
  const [lobbyList, setLobbyList] = useState<JSX.Element[]>();
  const navigate = useNavigate();
  const {
    isOpen: createState,
    onOpen: openCreate,
    onClose: closeCreate,
  } = useDisclosure();

  const {
    isOpen: sendFileState,
    onOpen: openSendFile,
    onClose: closeSendFile,
  } = useDisclosure();

  const {
    isOpen: PendingRequestState,
    onOpen: openPendingRequest,
    onClose: closePendingRequest,
  } = useDisclosure();

  const socket = useSocketStore((state) => {
    return state.socket;
  });
  const btnMargin = "1%";
  const renderLobby = (list: ILobbyData[]) => {
    console.log(list);
    console.log("sada");

    const render: JSX.Element[] = list.map((item) => {
      return (
        <>
          <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
            key={item.roomId}
            // bg={colorSec}
            padding={"1%"}
          >
            <h2>{item.name}</h2>
            <Button
              colorScheme="blue"
              bg={colorPrim}
              onClick={() => {
                if (socket) {
                  joinLobby(item.roomId, socket);
                  navigate("/");
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
          {/* <Button colorScheme="blue" margin={btnMargin} onClick={openSendFile}>
            Pending Request
          </Button> */}
          <Button
            colorScheme="blue"
            margin={btnMargin}
            onClick={openPendingRequest}
          >
            Pending Request
          </Button>

          <PendingRequest
            closePendingRequest={closePendingRequest}
            pendingRequestState={PendingRequestState}
          />
          <Button colorScheme="blue" margin={btnMargin} onClick={openSendFile}>
            Send File
          </Button>
          <SendFile
            sendFileState={sendFileState}
            closeSendFile={closeSendFile}
          />
          <Button
            // onClick={() => {
            //   if (socket) {
            //     createLobby(socket);
            //   }
            // }}
            colorScheme="blue"
            onClick={openCreate}
            margin={btnMargin}
          >
            Create
          </Button>
          <CreateLobby
            socket={socket}
            createState={createState}
            closeCreate={closeCreate}
          />
          <Button
            colorScheme="blue"
            margin={btnMargin}
            onClick={() => {
              if (socket) getRoomList(socket);
            }}
          >
            Refresh
          </Button>
        </Flex>
        <Flex
          bg={colorSec}
          borderRadius={"10px"}
          flexDirection={"column"}
          margin={"0% 1% 1% 1%"}
          padding={".5%"}
          id="lobbyList"
        >
          {lobbyList}
        </Flex>
        <Flex id="pagination"></Flex>
      </Flex>
    </>
  );
};

export default Browse;
