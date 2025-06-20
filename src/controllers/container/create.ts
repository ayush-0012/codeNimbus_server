import { Request, Response } from "express";
import Docker from "dockerode";
import { Languages, projectStack } from "@prisma/client";
import { buildDockerImage } from "../../utils/buildImage.utils";
import { getAllContainers } from "../../utils/getAllContainers";
import { CONTAINER_POOL, MAX_POOL_SIZE } from "../../utils/containerPool";
import prisma from "../../utils/prisma.utils";
import { FileAlreadyExists } from "../../utils/fileAlreadyExist";

interface project {
  userId: string;
  stack: projectStack;
  projectName: string;
}

interface singleFile {
  userId: string;
  fileName: string;
  language: Languages;
  fileId: string;
}

const docker: Docker = new Docker();

// interface containerStatus {
//   id: string;
//   idle: boolean;
// }

// const CONTAINER_POOL: containerStatus[] = [];
// const MAX_POOL_SIZE: number = 3;

export async function createContainer(
  req: Request,
  res: Response
): Promise<any> {
  const { userId, fileName, language, fileId }: singleFile = req.body;
  let file;

  let dockerImage: string;

  dockerImage = "multilang-code-runner:latest";

  //reusing an idle container
  const idleContainer = CONTAINER_POOL.find((c) => c.idle);

  if (idleContainer) {
    idleContainer.idle = false;
    console.log("reusing idle container", CONTAINER_POOL);
    return res.status(200).json({
      containerId: idleContainer.id,
      reused: true,
      message: "Reusing an idle container",
    });
  }

  const runningContainers = await getAllContainers();

  console.log(runningContainers);

  if (CONTAINER_POOL.length >= MAX_POOL_SIZE) {
    return res.status(429).json({
      clientMsg: "Server is busy please try again later ",
      message: "All contaienrs are busy",
    });
  }

  try {
    await docker.getImage(dockerImage).inspect();
    console.log(`docker image exists: ${dockerImage}`); //checks if image is available
  } catch (error) {
    console.log(`building image: ${dockerImage}`);
    await buildDockerImage(dockerImage); //if not available, then build image
  }

  try {
    const container = await docker.createContainer({
      Image: dockerImage,
      Cmd: ["tail", "-f", "/dev/null"],
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      HostConfig: {
        AutoRemove: false, // cleanup after exit
        Memory: 218 * 1024 * 1024, // limiting RAM
      },
    });

    if (container) {
      CONTAINER_POOL.push({ id: container.id, idle: false });
    }

    console.log("current pool", CONTAINER_POOL);

    await container.start();

    //container logs
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      follow: false,
    });
    console.log("Container Logs:", logs.toString());

    //checking container status
    const containerInfo = await container.inspect();
    console.log("Container Status:", containerInfo.State.Status);

    const doesFileExist = await FileAlreadyExists(fileId);

    if (doesFileExist) {
      return res.status(200).json({
        containerId: container.id,
        idle: false,
        message: "spinning container for a already existing file ",
        file: doesFileExist,
      });
    } else {
      file = await prisma.file.create({
        data: {
          fileName,
          language,
          userId,
        },
      });
    }

    return res.status(201).json({
      containerId: container.id,
      idle: false,
      message: "container created successfully",
      container: containerInfo,
      file,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error occurred creating container", error });
  }
}

export async function createProject(req: Request, res: Response): Promise<any> {
  const { userId, stack, projectName }: project = req.body;

  let dockerImage: string;

  dockerImage = "multilibs:latest";

  try {
    await docker.getImage(dockerImage).inspect(); //checking if docker image is available
    console.log("docker image is availaible ");
  } catch (error) {
    console.log("building docker image", dockerImage);
    await buildDockerImage(dockerImage); //building image if not available
  }

  try {
    const container = await docker.createContainer({
      Image: dockerImage,
      AttachStderr: true,
      AttachStdin: true,
      AttachStdout: true,
      Tty: true,
      Cmd: ["tail", "-f", "/dev/null"],
      HostConfig: {
        AutoRemove: false, // cleanup after exit
        Memory: 218 * 1024 * 1024, // limiting RAM
      },
    });

    await container.start();

    const logs = await container.logs({
      stdout: true,
      stderr: true,
      follow: false,
    });
    console.log("Container Logs:", logs.toString());

    //checking container status
    const containerInfo = await container.inspect();
    console.log("Container Status:", containerInfo.State.Status);

    return res.status(201).json({
      containerId: container.id,
      idle: false,
      message: "container created successfully",
      container: containerInfo,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error occurred creating container", error });
  }
}
