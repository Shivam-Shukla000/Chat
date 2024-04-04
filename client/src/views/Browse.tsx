import { Box, Flex, Button } from "@chakra-ui/react";
import ConnectButton from "../component/ConnectButton";
import { useSocketStore } from "../store/store";

const Browse: () => JSX.Element = () => {
  const socket = useSocketStore((state) => {
    return state.socket;
  });
  const createLobby = () => {
    console.log("create lobby");

    socket?.emit("create-room");
  };

  const btnMargin = "1%";
  return (
    <>
      <Flex flexDirection={"column"}>
        <Flex margin={"0px"} padding={"1%"} justifyContent={"end"} id="btns">
          <Button onClick={createLobby} margin={btnMargin}>
            create lobby
          </Button>
          <Button margin={btnMargin}>sort lobby</Button>
        </Flex>
        <Flex id="lobbyList">
          <Box></Box>
          <Box></Box>
          <Box></Box>
          <Box></Box>
          <Box></Box>
        </Flex>
        <Flex id="pagination"></Flex>
      </Flex>
    </>
  );
};

export default Browse;
