interface containerStatus {
  id: string;
  idle: boolean;
}

const CONTAINER_POOL: containerStatus[] = [];
const MAX_POOL_SIZE: number = 3;

export { CONTAINER_POOL, MAX_POOL_SIZE };
