import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma.utils";

export async function signInCheck(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const { userId } = req.body;

  console.log(userId);

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId,
      },
    });

    if (user) {
      console.log("user is signedIn (m1)");
      next();
    } else {
      return res.json({ message: "user is not signedIn" });
    }
  } catch (error) {
    return res.status(400).json({ message: "couldn't find user" });
  }
}
