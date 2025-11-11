import type { Request, Response, NextFunction } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"

declare global {
   namespace Express {
      export interface Request {
         user?: { id: string }
      }
   }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
   const authHeader = req.headers.authorization

   if (!authHeader) {
      return res.status(401).json({ message: "No Token" })
   }

   const token = authHeader.split(" ")[1] || ""

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

      if (typeof decoded !== "object" || !decoded.id ) {
         return res.status(401).json({ message: "Invalid Token Payload" })
      }

      req.user = { id: decoded.id }
      next()
   } catch (err) {
      res.status(401).json({ message: "Invalid Token" })
   }
}
