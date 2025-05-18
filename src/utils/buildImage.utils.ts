import Dockerode from "dockerode";
import path from "path";
import fs from "fs";

const dockerode: Dockerode = new Dockerode();

//build image if missing
export async function buildDockerImage(imageName: string) {
  const dockerFilePath = path.join("./containers/multiLang/Dockerfile"); //gettig dockerfile path

  if (fs.existsSync(dockerFilePath)) {
    console.log(`Dockerfile found at ${dockerFilePath}`);
  } else {
    console.log(`Dockerfile not found at ${dockerFilePath}`);
  }

  const stream = await dockerode.buildImage(
    {
      context: path.dirname(dockerFilePath),
      src: ["Dockerfile"],
    },
    {
      t: imageName,
    }
  );

  await new Promise((resolve, reject) => {
    dockerode.modem.followProgress(stream, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}
