import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Box,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { createLobby, joinLobby } from "../utils/handleLobby";
import { useState } from "react";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const CreateLobby = (props: {
  createState: boolean;
  closeCreate: () => void;
  socket: Socket | null;
}) => {
  const primeColor = "#FF5A8B";
  const inputBorder = "1px solid #FF5A8B";
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [size, setSize] = useState<number>(4);
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const setError = (message: string) => {
    setMessage(message);
  };

  const handleCreateLobby = (name: string, password: string, size: number) => {
    if (name.length > 16) {
      setError("Max name length is 16");
      return;
    } else if (password.length > 10) {
      setError("Max name length is 10");
      return;
    }
    const lobbydata = { name, password, size };
    if (props.socket) {
      createLobby(props.socket, lobbydata);
      navigate("/");
    }
  };

  return (
    <>
      <Modal
        onCloseComplete={() => {
          setMessage("");
        }}
        isOpen={props.createState}
        onClose={props.closeCreate}
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
                  Name
                </InputLeftAddon>

                <Input
                  border={inputBorder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Max 16 characters"
                />
              </InputGroup>

              <InputGroup size="sm">
                <InputLeftAddon
                  border={inputBorder}
                  bg={primeColor}
                  borderLeftRadius={"full"}
                >
                  Password
                </InputLeftAddon>

                <Input
                  border={inputBorder}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Max 10 characters"
                />
                <InputRightAddon border={inputBorder} bg={primeColor}>
                  optional
                </InputRightAddon>
              </InputGroup>
              <Slider
                margin={"2% 0% 2% 0%"}
                onChange={(value) => {
                  setSize(value);
                }}
                defaultValue={6}
                min={2}
                max={16}
              >
                <SliderTrack bg="red.100">
                  <SliderFilledTrack bg={"blue.500"} />
                </SliderTrack>
                <SliderThumb bg={"blue.600"} boxSize={4} />
              </Slider>
              <InputGroup size="sm">
                <InputLeftAddon
                  border={inputBorder}
                  bg={primeColor}
                  borderLeftRadius={"full"}
                >
                  Size
                </InputLeftAddon>
                <Input
                  border={inputBorder}
                  value={size}
                  placeholder="lobby size"
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
                handleCreateLobby(name, password, size);
              }}
              bg={"gray"}
              colorScheme="blue"
              mr={3}
            >
              Create
            </Button>
            <Button onClick={props.closeCreate} variant="ghost">
              close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateLobby;
