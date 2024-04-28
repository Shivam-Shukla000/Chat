import { Flex, Avatar, Box } from "@chakra-ui/react";

const colorSec = "#FFF3DB";
const colorPrim = "#FFD6E2";

type IUserProps = {
  id: string;
  message: string;
  key: string;
};

const UserMessage = (props: IUserProps) => {
  return (
    <>
      <Flex
        key={props.key}
        id="room-message"
        marginTop={"1"}
        flexDirection={"column"}
      >
        <Flex flexDirection={"row"} alignItems={"center"}>
          <Avatar boxSize={"25px"}></Avatar>
          <Box marginLeft={"1"} className="user-name">
            {props.id}
          </Box>
        </Flex>
        <Box
          bg={colorPrim}
          padding={"2"}
          borderRadius={"0px 10px 10px 10px"}
          marginLeft={"25px"}
          fontSize={"14px"}
          textAlign={"start"}
          className="message"
        >
          {props.message}
        </Box>
      </Flex>
    </>
  );
};

const MyMessage = (props: { message: string; key: string }) => {
  return (
    <>
      <Flex
        key={props.key}
        id="your-message"
        marginTop={"1"}
        flexDirection={"column"}
      >
        <Box textAlign={"end"} marginLeft={"1"} className="user-you">
          You
        </Box>
        <Box
          bg={colorPrim}
          padding={"2"}
          borderRadius={"10px 0px 10px 10px"}
          marginLeft={"25px"}
          fontSize={"14px"}
          textAlign={"end"}
          className="message"
        >
          {props.message}
        </Box>
      </Flex>
    </>
  );
};

export { UserMessage, MyMessage };
