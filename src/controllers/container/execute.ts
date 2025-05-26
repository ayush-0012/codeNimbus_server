import { Request, Response } from "express";
import Docker from "dockerode";
import { compressDecompressCode } from "../../utils/compressCode";
import prisma from "../../utils/prisma.utils";

const docker: Docker = new Docker();

export async function executeCode(
  req: Request<
    {},
    {},
    {
      containerId: string;
      language: string;
      code: string;
      userId: string;
      fileId: string;
    }
  >,
  res: Response
): Promise<any> {
  const { containerId, language, code, userId, fileId } = req.body;

  try {
    const container = docker.getContainer(containerId);

    let command: string;

    switch (language) {
      case "python":
        command = `python3 -c "${code.replace(/"/g, '\\"')}"`;
        break;
      case "javascript":
        command = `node -e "${code.replace(/"/g, '\\"')}"`;
        break;
      case "java":
        command = `echo "${code.replace(/"/g, '\\"')}" > Main.java && javac Main.java && java Main`;
        break;
      case "c":
        command = `echo "${code.replace(/"/g, '\\"')}" > main.c && gcc main.c -o main && ./main`;
        break;
      case "cpp":
        command = `echo "${code.replace(/"/g, '\\"')}" > main.cpp && g++ main.cpp -o main && ./main`;
        break;
      case "sql":
        command = `sqlite3 :memory: "${code.replace(/"/g, '\\"')}"`;
        break;
      default:
        return res.status(400).json({ error: "Unsupported language" });
    }

    const exec = await container.exec({
      Cmd: ["/bin/sh", "-c", command],
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({ hijack: true, stdin: false });

    let output = "";

    stream.on("data", (chunk: Buffer) => {
      output += chunk.toString("utf8");
    });

    stream.on("end", () => {
      const cleanedOutput = output
        .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]+/g, "")
        .trim();
      res.json({ output: cleanedOutput });
    });

    const result = await compressDecompressCode(code);

    const compressCode = result?.compressCode;

    const updatedCode = await prisma.file.update({
      where: {
        fileId,
      },
      data: {
        compressedCode: compressCode,
      },
    });

    console.log(updatedCode);
  } catch (error) {
    console.error("Execution error:", error);
    res.status(500).json({ error: "Failed to execute code" });
  }
}
