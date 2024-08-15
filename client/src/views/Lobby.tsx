import { useEffect, useState } from "react";
import { useSocketStore } from "../store/store";
import MyVideoStream from "../component/MyVideoStream";
import {
  Box,
  Button,
  Grid,
  AbsoluteCenter,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { removeAudioFromTrack, setStateOfMedia } from "../utils/handleSocket";
import { Socket } from "socket.io-client";

const Lobby: () => JSX.Element = () => {
  const signal = useSocketStore((state) => state.signal);
  const setSignal = useSocketStore((state) => state.setSignal);
  const socket = useSocketStore((state) => state.socket);

  // const setRemoteStreams = useSocketStore((state) => state.setRemoteStreams);
  type IRemoteStreams = {
    stream: MediaStream;
    id: string;
  };
  // const [remoteStreams1, setRemoteStreams1] = useState<IRemoteStreams[]>([]);
  const [renderList, setRenderList] = useState<JSX.Element[]>([]);
  let colum = `repeat(${2} , 1fr)`;
  const handleRefresh = () => {
    setSignal();
  };

  // const muteMic = () => {

  //   removeAudioFromTrack(Peer)

  //   if(socket) {

  //     socket.emit("muteMic", userId, roomId)
  //   }
  // }

  useEffect(() => {
    const streamLength = setStateOfMedia(setRenderList);
    console.log(streamLength);
    console.log("refreshed from signal");
  }, [signal]);

  return (
    <>
      {" "}
      <Flex height={"100%"} justifyContent={"end"} flexDirection={"column"}>
        <Box>
          <Button onClick={handleRefresh}>refresh</Button>
          <Grid templateColumns={colum} width={"100%"} height={"70%"}>
            <MyVideoStream />

            {renderList}
          </Grid>
        </Box>
        <Spacer />
        <Flex justifyContent={"space-around"}>
          <Button>mute</Button>
          <Button>defen</Button>

          <Button>end call</Button>
        </Flex>
      </Flex>
    </>
  );
};

export default Lobby;
