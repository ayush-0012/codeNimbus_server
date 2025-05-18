import Docker from "dockerode";

const docker: Docker = new Docker();

export async function getAllContainers() {
  try {
    const containers = await docker.listContainers({ all: true });

    const containerInfo = containers.map((container) => ({
      id: container.Id,
      state: container.State,
    }));

    return { containers, containerInfo };
  } catch (error) {
    console.log(error);
  }
}
