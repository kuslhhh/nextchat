import type { Request, Response } from "express"
import prisma from "../config/prisma";

export const sendMessage = async (req: Request, res: Response) => {
   try {
      const { receiverId, content, hash } = req.body;

      const senderId = req.user?.id;
      if (!req.user || !senderId) {
         return res.status(401).json({ message: "Unauthorized" })
      }

      if (!receiverId || !content || !hash) {
         return res.status(400).json({ message: "Missing required fields" })
      }

      const receiver = await prisma.user.findUnique({ where: { id: receiverId } })
      if (!receiver) {
         return res.status(400).json({ message: "Invalid receiver ID" })
      }

      const msg = await prisma.message.create({
         data: { receiverId, senderId, hash, content },
         include: { sender: true, receiver: true }
      })

      res.status(201).json(msg)

   } catch (err) {
      console.error("Error in SendMessage", err);

      res.status(500).json({ message: "Error while sending message" })
   }
}

export const getChatHistory = async (req: Request, res: Response) => {
   const userId = req.params;
   const myId = req.user?.id;

   try {
      const messages = await prisma.message.findMany({
         where: {
            OR: [
               { senderId: myId, receiverId: userId },
               { senderId: userId, receiverId: myId }
            ]
         },
         orderBy: { timestamp: "asc" }
      });
      res.json(messages)
   } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Error fetching messages" })
   }
}