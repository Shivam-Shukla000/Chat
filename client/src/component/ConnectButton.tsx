import { useSocketStore } from "../store/store";
import socketIO from "socket.io-client";
import { Button, Spinner } from "@chakra-ui/react";
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

const RequestSpinner = () => {
  return (
    <Spinner
      thickness="2px"
      speed="1s"
      emptyColor="gray.200"
      color="blue.500"
      size="lg"
      margin={"1"}
    />
  );
};

export { RequestSpinner };
