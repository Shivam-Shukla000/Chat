import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  InputGroup,
  InputLeftAddon,
  Input,
  InputRightAddon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  ModalFooter,
  Button,
  Box,
} from "@chakra-ui/react";
import {
  peerExist,
  getPeerById,
  peerConfiguration,
  connectPeer,
  myId,
} from "../utils/handleSocket";
import { useState } from "react";
import { Socket, connect } from "socket.io-client";
import { useSocketStore } from "../store/store";
import { RequestSpinner } from "./ConnectButton";

type IAllPeers = {};

let allPeers: RTCPeerConnection[] = [];

const SendFile = (props: {
  sendFileState: boolean;
  closeSendFile: () => void;
}) => {
  let peer: RTCPeerConnection | null = null;
  const primeColor = "#FF5A8B";
  const inputBorder = "1px solid #FF5A8B";
  const socket = useSocketStore((state) => {
    return state.socket;
  });
  const [id, setId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [requestSpinner, setRequestSpinner] = useState<boolean>(true);
  const setError = (message: string) => {
    setMessage(message);
  };

  const cbRequest = (bool: boolean) => {
    if (bool && socket) {
      // handleRequestSocket(socket, id);
      setMessage("waiting for response");
      setRequestSpinner(true);
      socket.on("request-to-send-file-response", (senderId: string) => {
        connectPeer(senderId, socket);
      });
    } else {
      setMessage("user doesnt exist");
      setRequestSpinner(false);
    }
  };

  const handleClick = () => {
    if (socket) {
      socket.emit("request-to-send-file", myId, id, cbRequest);
    }
  };

  return (
    <>
      <Modal
        onCloseComplete={() => {
          setMessage("");
        }}
        isOpen={props.sendFileState}
        onClose={props.closeSendFile}
      >
        <ModalOverlay />
        <ModalContent bg={"#FFF3DB"}>
          <ModalHeader>Create your own lobby</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection={"column"} gap={0.5}>
              <InputGroup size="sm">
                <InputLeftAddon
                  border={inputBorder}
                  bg={primeColor}
                  borderLeftRadius={"full"}
                >
                  Id
                </InputLeftAddon>
                <Input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  border={inputBorder}
                  placeholder=""
                />
              </InputGroup>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Box color={"red"} margin={"2%"}>
              {" "}
              {message}
            </Box>
            {requestSpinner ? <RequestSpinner /> : ""}
            <Button onClick={handleClick} bg={"gray"} colorScheme="blue" mr={3}>
              Connect
            </Button>
            <Button onClick={props.closeSendFile} variant="ghost">
              close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SendFile;
