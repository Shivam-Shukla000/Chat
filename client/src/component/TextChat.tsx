import {
  Flex,
  Box,
  Textarea,
  Button,
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import { useSocketStore } from "../store/store";
import { useEffect, useRef, useState } from "react";
import { MyMessage, UserMessage } from "./MessageComponent";
const TextChat = () => {
  const socket = useSocketStore((state) => state.socket);
  const roomId = useSocketStore((state) => state.roomId);
  const userId = useSocketStore((state) => state.userId);

  const connected = useSocketStore((state) => state.connected);
  const [myMsg, setMyMsg] = useState("");
  const [renderList, setRenderList] = useState<JSX.Element[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  console.log(renderList.length);
  const colorSec = "#FFF3DB";
  const colorPrim = "#FFD6E2";

  if (socket) {
    socket.on("message", (message: string, userId: string) => {
      appendToAllMessages(message, userId);
    });
  }

  const appendToAllMessages = (message: string, id: string) => {
    let listItem: JSX.Element = <></>;
    let random: string = crypto.randomUUID();
    console.log(random);

    if (message === "") {
      return;
    }
    if (id === userId) {
      listItem = <MyMessage key={random} message={message} />;
    } else {
      listItem = <UserMessage key={random} id={id} message={message} />;
    }
    setRenderList([...renderList, listItem]);
  };
  useEffect(() => {
    chatRef.current?.scrollIntoView();
    // console.log(renderList.length);
  }, [renderList]);

  const clearMyMsg = () => {
    setMyMsg("");
  };
  const handleSendMessage = () => {
    if (socket && userId) {
      socket.emit("message", myMsg, userId, roomId, clearMyMsg);
      appendToAllMessages(myMsg, userId);
    }
  };
  // const render = () => {};
  // useEffect(() => {
  //   render();
  // }, [messages]);
  return (
    <>
      <Flex
        margin={"0px 2%"}
        height={"100%"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        right={"0px"}
      >
        <Flex margin={"2% 0 4% 0"} id="useData">
          <Avatar id="userAvatar">
            <AvatarBadge
              boxSize="1.25em"
              bg={connected ? "green.500" : "gray"}
            />
          </Avatar>
          <Box margin={"auto auto auto 1%"} id="userName">
            @{userId}
          </Box>
        </Flex>

        <Box
          overflowY={"scroll"}
          id="allChats"
          height={"100%"}
          sx={{
            "::-webkit-scrollbar": {
              display: "none",
              width: "2px",
            },
          }}
        >
          {renderList}
          <Box height={"5px"} ref={chatRef}></Box>
        </Box>
        <Flex flexDirection={"row"} justifyContent={"space-around"}>
          <Textarea
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            onChange={(e) => setMyMsg(e.target.value)}
            value={myMsg}
            color={"black"}
            bg={"white"}
            rows={1}
            resize={"none"}
            marginBottom={"0px"}
            placeholder="message"
          ></Textarea>
          <Button
            onClick={() => {
              handleSendMessage();
            }}
            colorScheme="blue"
            bg={"#FFD6E2"}
            marginBottom={"0px"}
          >
            send
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default TextChat;
