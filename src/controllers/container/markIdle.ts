import { Request, Response } from "express";
import { CONTAINER_POOL } from "../../utils/containerPool";

export function markIlde(
  req: Request<{}, {}, { containerId: string; userId: string }>,
  res: Response
): any {
  const { containerId, userId } = req.body;

  console.log(containerId);

  const containerInPool = CONTAINER_POOL.find((c) => c.id === containerId);

  console.log(containerInPool);

  if (!containerInPool) {
    return res.status(429).json({
      containerId,
      message: "Container not found in pool",
    });
  }

  containerInPool.idle = true;
  console.log("pool", CONTAINER_POOL);

  return res.status(200).json({
    containerId,
    idle: true,
    message: "Marked the container as idle",
  });
}
