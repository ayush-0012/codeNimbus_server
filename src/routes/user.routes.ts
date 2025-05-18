import express, { Router } from "express";
import { SignIn } from "../controllers/user.controller";

const router: Router = express.Router();

router.post("/signIn", SignIn);

export const userRouter: Router = router;
