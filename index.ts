import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { userRouter } from "./src/routes/user.routes";
import cors from "cors";
import { signInCheck } from "./src/middleware/signedIn.middleware";
import { containerRoute } from "./src/routes/container.routes";

dotenv.config();
const app: Express = express();

const PORT = process.env.PORT;

const corsOptions = {
  origin: "*",
  method: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(signInCheck);

app.use("/api/user", userRouter);
app.use("/api/container", containerRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("server is running, home page");
});

app.listen(PORT, () => {
  console.log("server running on port", PORT);
});
