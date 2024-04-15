import { GridItem } from "@chakra-ui/react";
import { useSocketStore } from "../store/store";

const MyVideoStream = () => {
  const localStream = useSocketStore((state) => state.localStream);

  return (
    <>
      <GridItem
      // ref={(ref) => {
      //   if (ref) {
      //     console.log(
      //       ref.childNodes.forEach((el) => {
      //         console.log(el);
      //       })
      //     );
      //   }
      // }}
      >
        <video
          ref={(ref) => {
            if (ref) {
              ref.srcObject = localStream;
            }
          }}
          autoPlay
        ></video>
      </GridItem>
    </>
  );
};

export default MyVideoStream;
