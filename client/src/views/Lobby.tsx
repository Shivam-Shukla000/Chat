import { useEffect, useState } from "react";
import { useSocketStore } from "../store/store";
import MyVideoStream from "../component/MyVideoStream";
import { Box, Button, Grid, AbsoluteCenter } from "@chakra-ui/react";
import { setStateOfMedia } from "../utils/handleSocket";

const Lobby: () => JSX.Element = () => {
  const signal = useSocketStore((state) => state.signal);
  const setSignal = useSocketStore((state) => state.setSignal);

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

  useEffect(() => {
    const streamLength = setStateOfMedia(setRenderList);
    console.log(streamLength);
    console.log("refreshed from signal");
  }, [signal]);

  return (
    <>
      <Box>
        <Button onClick={handleRefresh}>refresh</Button>
        <Grid templateColumns={colum} width={"100%"} height={"70%"}>
          <MyVideoStream />

          {renderList}
        </Grid>
      </Box>
    </>
  );
};

export default Lobby;
