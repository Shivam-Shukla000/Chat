import { Link, NavLink, Outlet } from "react-router-dom";
import TextChat from "./component/TextChat";
import {
  Avatar,
  Box,
  Spacer,
  useDisclosure,
  Button,
  Flex,
  Divider,
  Image,
} from "@chakra-ui/react";
import browse from "./assets/browse.png";
import video from "./assets/video.png";
import friends from "./assets/friends.png";
import settings from "./assets/settings.png";
import about from "./assets/about.png";
import logout from "./assets/logout.png";
import Header from "./component/Header";

const Layouts = () => {
  const imagePadding = "10%";
  const pbg = "#FFD6E2";
  const activeStyle = {
    backgroundColor: pbg,
    borderRadius: "50% 0% 0% 50%",
    padding: "10%",
    transition: "background-color .3s ease-in-out,padding .3s ease-in-out",
  };
  const deActiveStyle = {
    padding: "7%",
  };
  const hoverStyle = {
    padding: "0px",
  };
  return (
    <>
      <Header />
      <Divider borderColor={"black"} />
      <Flex width={"100%"} height={"92%"} flexDirection={"row"}>
        <Flex
          margin={"0px"}
          marginTop={"2%"}
          gap={"4%"}
          flexDirection={"column"}
          width={"6%"}
        >
          <Flex>
            <NavLink
              to={"/"}
              style={({ isActive }) => (isActive ? activeStyle : deActiveStyle)}
            >
              <Image _hover={hoverStyle} padding={imagePadding} src={video} />
            </NavLink>
          </Flex>

          <Flex>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : deActiveStyle)}
              to={"/browse"}
            >
              <Image _hover={hoverStyle} padding={imagePadding} src={browse} />
            </NavLink>
          </Flex>
          <Flex>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : deActiveStyle)}
              to={"/friends"}
            >
              <Image _hover={hoverStyle} padding={imagePadding} src={friends} />
            </NavLink>
          </Flex>
          <Flex>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : deActiveStyle)}
              to={"/settings"}
            >
              <Image
                _hover={hoverStyle}
                padding={imagePadding}
                src={settings}
              />
            </NavLink>
          </Flex>
          <Flex>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : deActiveStyle)}
              to={"/about"}
            >
              <Image _hover={hoverStyle} padding={imagePadding} src={about} />
            </NavLink>
          </Flex>
          <Image
            _hover={hoverStyle}
            padding={imagePadding}
            margin={"5%"}
            src={logout}
          />
        </Flex>
        <Box width={"100%"} borderRadius={"20px"} bg={pbg}>
          <Outlet />
        </Box>
        <Box marginRight={"0px"} marginLeft={"auto"} width={"24%"}>
          <TextChat />
        </Box>
      </Flex>
    </>
  );
};

export default Layouts;
