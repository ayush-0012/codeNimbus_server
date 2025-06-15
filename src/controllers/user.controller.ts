import { Request, Response } from "express";
import prisma from "../utils/prisma.utils";
import { inflate, deflate } from "zlib";
import { promisify } from "util";
import { promiseHooks } from "v8";
import { buffer } from "stream/consumers";
import { decompressCode } from "../utils/compressCode";

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

export async function fetchUserFiles(
  req: Request,
  res: Response
): Promise<any> {
  const { userId } = req.query;

  console.log("req.query", req.query);

  console.log("userId from query params", userId);

  const asyncInflate = promisify(inflate);

  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ message: "Valid userId is required" });
  }

  try {
    const files = await prisma.file.findMany({
      where: {
        userId: userId.toString(),
      },
    });

    const decompressedFiles = await Promise.all(files.map(async (file) => {}));

    return res.status(200).json({
      message: "Files fetched successfully",
      files,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred while fetching files",
      error,
    });
  }
}
