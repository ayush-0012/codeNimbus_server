import { Request, Response } from "express";
import prisma from "../utils/prisma.utils";

interface reqObj {
  userId: string;
  userName: string;
  email: string;
  profilePic: string;
}

export async function SignIn(req: Request, res: Response): Promise<any> {
  const { userId, userName, email, profilePic }: reqObj = req.body;

  console.log(req.body);

  try {
    const user = await prisma.user.create({
      data: {
        userId,
        userName,
        email,
        profilePic,
      },
    });

    // console.log(user);
    return res.status(201).json({ message: "user created successfully", user });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: "unable to create user", error: error.message });
  }
}
