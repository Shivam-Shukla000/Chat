import socketIO from "socket.io-client";

const connect = (url: string) => {
  const ws = socketIO(url);
  return ws;
};
export default connect;
