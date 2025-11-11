import { Server, Socket } from "socket.io"
import prisma from "../config/prisma"

interface MessageData {
  senderId: string
  receiverId: string
  content: string
  hash: string
}

export default function chatSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("User Connected:", socket.id)

    socket.on("join", (userId: string) => {
      socket.join(userId)
      console.log(`User ${userId} joined room ${userId}`)
    })

    socket.on("send_message", async (data: MessageData) => {
      try {
        const { senderId, receiverId, content, hash } = data

        if (!senderId || !receiverId || !content || !hash) {
          console.warn("Invalid message data:", data)
          socket.emit("error_message", { message: "Invalid message data" })
          return
        }

        const msg = await prisma.message.create({
          data: {
            senderId,
            receiverId,
            content,
            hash,
          },
          include: {
            sender: true,
            receiver: true,
          },
        })

        io.to(receiverId).emit("receive_message", msg)
      } catch (err:any) {
        console.error("Error sending message:", err.message || err)
        socket.emit("error_message", { message: err.message })
      }
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)
    })
  })
}
