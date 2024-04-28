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
} from "../utils/handleSocket";
import { useState } from "react";
import { Socket, connect } from "socket.io-client";
import { useSocketStore } from "../store/store";

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
  const setError = (message: string) => {
    setMessage(message);
  };
  //   const connectPeer = () => {
  //     if (peerExist(id)) {
  //       peer = getPeerById(id);
  //       console.log(peer);
  //     }
  //     if (peer) {
  //       const dataChannel = peer.createDataChannel("myChannel");
  //       console.log("channel made");
  //       dataChannel.onopen = (event) => {
  //         console.log("onopen", event);
  //       };
  //     }
  //     // peer = new RTCPeerConnection(peerConfiguration);
  //     // peer.onnegotiationneeded = async (event) => {
  //     //     const sdpOffer = await peer?.createOffer()
  //     //     socket?.emit("DataOffer", sdpOffer, userId)
  //     // };
  //     // peer.createDataChannel("dataChat");
  //   };

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
            <Button
              onClick={() => {
                if (socket) {
                  connectPeer(id, socket);
                }
              }}
              bg={"gray"}
              colorScheme="blue"
              mr={3}
            >
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
