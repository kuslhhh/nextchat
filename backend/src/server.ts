import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes"
import chatRoutes from "./routes/chatRoutes"
import chatSocket from "./sockets/chatSocket";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Secure Chat Backend Running"));
app.use("/api/auth", authRoutes)
app.use("/api/chat", chatRoutes)

const server = http.createServer(app);
const io = new Server(server, {
   cors: { origin: "*" },
});

io.on("connection", (socket) => {
   console.log("User connected:", socket.id);

   socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
   });
});

chatSocket(io)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));