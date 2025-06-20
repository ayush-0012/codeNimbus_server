import Dockerode from "dockerode";
import path from "path";
import fs from "fs";

const dockerode: Dockerode = new Dockerode();

//build image if missing
export async function buildDockerImage(imageName: string) {
  const dockerFilePathLang = path.join("./containers/multiLang/Dockerfile"); //gettig dockerfile path
  const dockerFilePathLibs = path.join("./containers/multiLibs/Dockerfile");

  let stream: any;

  //checking for multiLang path
  fs.existsSync(dockerFilePathLang)
    ? console.log(`Dockerfile found at ${dockerFilePathLang}`)
    : console.log(`Dockerfile not found at ${dockerFilePathLang}`);

  //checking for multiLibs path
  fs.existsSync(dockerFilePathLibs)
    ? console.log(`Dockerfile found at ${dockerFilePathLibs}`)
    : console.log(`Dockerfile not found at ${dockerFilePathLibs}`);

  if (imageName === "multilang-code-runner:latest") {
    stream = await dockerode.buildImage(
      {
        context: path.dirname(dockerFilePathLang),
        src: ["Dockerfile"],
      },
      {
        t: imageName,
      }
    );
  } else {
    console.log("spinning a container for react");
    stream = await dockerode.buildImage(
      {
        context: path.dirname(dockerFilePathLibs),
        src: ["Dockerfile"],
      },
      {
        t: imageName,
      }
    );
  }

  await new Promise((resolve, reject) => {
    dockerode.modem.followProgress(stream, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}
