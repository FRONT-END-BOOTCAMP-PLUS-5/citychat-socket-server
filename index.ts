import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000", // ✅ 로컬 개발용
      "https://citychat-beta.vercel.app", // ✅ 실제 배포용
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // socket 이벤트 처리 예시
  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("message", (data) => {
    io.to(data.roomId).emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`✅ Socket server running on port ${PORT}`);
});
