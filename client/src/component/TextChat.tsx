import {
  Flex,
  Box,
  Textarea,
  Button,
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import { useSocketStore } from "../store/store";
const TextChat = () => {
  const connected = useSocketStore((state) => state.connected);
  return (
    <>
      <Flex
        margin={"0px 2%"}
        height={"100%"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        right={"0px"}
      >
        <Flex marginTop={"2%"} id="useData">
          <Avatar id="userAvatar">
            <AvatarBadge
              boxSize="1.25em"
              bg={connected ? "green.500" : "gray"}
            />
          </Avatar>
          <Box margin={"auto auto auto 1%"} id="userName">
            @userautistic
          </Box>
        </Flex>
        <Box id="allChats" height={"100%"}></Box>
        <Flex flexDirection={"row"} justifyContent={"space-around"}>
          <Textarea
            color={"black"}
            bg={"white"}
            rows={1}
            resize={"none"}
            marginBottom={"0px"}
            placeholder="message"
          ></Textarea>
          <Button colorScheme="blue" bg={"#FFD6E2"} marginBottom={"0px"}>
            send
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default TextChat;
