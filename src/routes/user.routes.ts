import express, { Router } from "express";
import { fetchUserFiles, SignIn } from "../controllers/user.controller";

const router: Router = express.Router();

router.post("/signIn", SignIn);

router.get("/getFiles", fetchUserFiles);

export const userRouter: Router = router;
