import { useEffect, useState } from "react";
import { useSocketStore } from "../store/store";
import MyVideoStream from "../component/MyVideoStream";
import { Grid } from "@chakra-ui/react";

const Lobby: () => JSX.Element = () => {
  const remoteStreams = useSocketStore((state) => state.remoteStreams);

  const [renderList, setRenderList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const videos: JSX.Element[] = remoteStreams.map((stream) => {
      return (
        <>
          <video
            key={stream.id}
            id={stream.id}
            ref={(ref) => {
              if (ref) {
                ref.srcObject = stream.stream;
              }
            }}
            autoPlay
            playsInline
            muted
          ></video>
        </>
      );
    });

    setRenderList(videos);
  }, [remoteStreams]);

  return (
    <>
      <Grid width={"100%"} height={"70%"}>
        <MyVideoStream />

        {renderList}
      </Grid>
    </>
  );
};

export default Lobby;
