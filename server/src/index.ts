import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { v4 as uuidV4 } from "uuid";
import { socketRoutes } from "./Routes/socketRoutes";

const port = 4000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  const userId = uuidV4();
  socketRoutes(socket);

  socket.emit("userId", `userId--|--${userId}`);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  console.log("user connected ");
});

server.listen(port, "localhost", () => {
  console.log(`server started at port:${port}`);
});
