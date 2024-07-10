import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  ModalContent,
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import {
  getPendingRequestId,
  myId,
  setPendingRequestId,
} from "../utils/handleSocket";
import { useSocketStore } from "../store/store";
import { RequestSpinner } from "./ConnectButton";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";
import { handleDataRequestSocket } from "../utils/handleFileShare";

const RequestComponent = (props: {
  requestId: string;
  handleClick: () => void;
  handleAccept: () => void;
  handleDecline: () => void;
}) => {
  return (
    <>
      <Flex
        align={"center"}
        justifyContent={"space-between"}
        flexDirection={"row"}
      >
        <Box margin={1}>from {props.requestId}</Box>
        <Flex m={1}>
          <Button
            size={"md"}
            onClick={props.handleAccept}
            bg={"gray"}
            colorScheme="blue"
          >
            Accept
          </Button>
          <Button padding={"2"} onClick={props.handleDecline} variant="ghost">
            Decline
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

const PendingRequest = (props: {
  pendingRequestState: boolean;
  closePendingRequest: () => void;
}) => {
  const primeColor = "#FF5A8B";
  const inputBorder = "1px solid #FF5A8B";

  const [message, setMessage] = useState<string>("");
  const [requestSpinner, setRequestSpinner] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const socket = useSocketStore((state) => {
    return state.socket;
  });

  const handleClick = () => {
    console.log("click");
  };

  const handleDecline = () => {
    setRequestId(null);
    setPendingRequestId(null);
  };

  const cbAccept = () => {
    console.log("accepted");
  };

  const handleAccept = () => {
    if (socket && requestId) {
      handleDataRequestSocket(socket, requestId);
      socket.emit("request-to-send-file-response", myId, requestId, cbAccept);
    }
  };

  useEffect(() => {
    const id = getPendingRequestId();
    console.log("ran pednoing", id);
    setRequestId(id);
  }, [props.pendingRequestState]);

  return (
    <>
      <Modal
        onCloseComplete={() => {
          setMessage("");
        }}
        isOpen={props.pendingRequestState}
        onClose={props.closePendingRequest}
      >
        <ModalOverlay />
        <ModalContent bg={"#FFF3DB"}>
          <ModalHeader>
            {requestId ? (
              <>You have file send request</>
            ) : (
              <>There is no request for file send</>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection={"column"} gap={0.5}>
              <Box>
                {requestId ? (
                  <RequestComponent
                    requestId={requestId}
                    handleAccept={handleAccept}
                    handleDecline={handleDecline}
                    handleClick={handleClick}
                  />
                ) : (
                  <></>
                )}
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Box color={"red"} margin={"2%"}>
              {" "}
              {message}
            </Box>
            {requestSpinner ? <RequestSpinner /> : ""}

            <Button onClick={props.closePendingRequest} variant="ghost">
              close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PendingRequest;
