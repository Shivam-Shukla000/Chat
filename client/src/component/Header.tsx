import { Avatar, Box, Flex } from "@chakra-ui/react";
import { useSocketStore } from "../store/store";
import { Connecting, Online } from "./status";

const Header = () => {
  const connected = useSocketStore((state) => state.connected);
  // const peer = useSocketStore((state) => state.peer);
  const userId = useSocketStore((state) => state.userId);
  return (
    <>
      <Box width={"100%"} height={"7%"}>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          height={"100%"}
        >
          <Flex gap={"2"} alignItems={"center"} margin={"0% 0% 0% .5%"}>
            <Avatar size={"md"}></Avatar>
            <Box fontSize={"xx-large"} marginLeft={"1%"}>
              Pincord
            </Box>
          </Flex>
          <Flex gap={"2"} alignItems={"center"}>
            <Box>{userId}</Box>
            {connected ? <Online /> : <Connecting />}
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Header;
