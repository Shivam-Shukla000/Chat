import { useSocketStore } from "../store/store";
import socketIO from "socket.io-client";
import { Button } from "@chakra-ui/react";
export default function ConnectButton() {
  const setSocket = useSocketStore((state) => state.setSocket);
  console.log("socket setted");

  return (
    <>
      <Button colorScheme="pink" size={"md"}>
        connet to server
      </Button>
    </>
  );
}
