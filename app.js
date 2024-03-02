import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const port = 3000;
const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("working");
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("new-message", (data) => {
    //   ---- user in an object that contains name and text ----
    socket.broadcast.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`server is running on ${port}`);
});
