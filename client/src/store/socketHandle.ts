import { useSocketStore } from "./store";

const disconnectHandler = () => {
  const setConnected = useSocketStore((state) => state.setConnected);
  const connected = useSocketStore((state) => state.connected);
  console.log("disconnnec");
  setConnected(false);
  console.log(connected);
};

export { disconnectHandler };
