import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken"
import prisma from "../config/prisma";


const JWT_SECRET = process.env.JWT_SECRET || "KSHKSHKSH"

export const registerUser = async (req: Request, res: Response) => {
   try {
      const { username, password } = req.body;

      if (!username || !password) {
         return res.status(401).json({ message: "Missing fields" })
      }

      const existing = await prisma.user.findUnique({ where: { username } })

      if (existing) return res.status(401).json({ message: "Existing User" })

      const hashed = await bcrypt.hash(password, 10);
      const users = await prisma.user.create({
         data: {
            username,
            password: hashed
         }
      })

      res.status(201).json({
         message: "User Created", 
         user: {
            id: users.id,
            username: users.username
         }
      })
   } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Server Error" })
   }
}

export const loginUser = async (req: Request, res: Response) => {
   try {
      const { username, password } = req.body;

      const user = await prisma.user.findUnique({ where: { username } })
      if (!user) return res.status(401).json({ message: "Invalid Credentials" })

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) return res.status(401).json({ message: "Invalid Credentials" })

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" })


      res.status(201).json({
         message: "Login Successful",
         token,
         user: {
            id: user.id,
            username: user.username
         }
      })
   } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Server Error" })
   }
}

export const me = (req: Request, res: Response) => {
   res.send("Hello from authenticated route")
}