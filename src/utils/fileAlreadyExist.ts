import prisma from "./prisma.utils";

export async function FileAlreadyExists(fileId: string) {
  if (!fileId) {
    return;
  }

  try {
    const file = await prisma.file.findUnique({
      where: {
        fileId,
      },
    });

    return file;
  } catch (error) {
    return error;
  }
}
