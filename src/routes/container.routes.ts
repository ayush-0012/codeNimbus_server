import express, { Router } from "express";
import { createContainer } from "../controllers/container/create";
import { executeCode } from "../controllers/container/execute";
import { markIlde } from "../controllers/container/markIdle";

const router: Router = express.Router();

router.post("/create", createContainer);

router.post("/exec", executeCode);

router.patch("/status", markIlde);

export const containerRoute: Router = router;
