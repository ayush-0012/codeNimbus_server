import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { userRouter } from "./src/routes/user.routes";
import cors from "cors";
import { signInCheck } from "./src/middleware/signedIn.middleware";
import { containerRoute } from "./src/routes/container.routes";
import { Server } from "socket.io";
import { createServer } from "node:http";
import * as pty from "node-pty";

dotenv.config();

let ptyProcess = pty.spawn("bash", [], {
  name: "xterm-color",
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD || process.cwd(),
  env: process.env,
});

const app: Express = express();
const server = createServer(app);

const PORT = process.env.PORT;
console.log("init", process.env.INIT_CWD);

const corsOptions = {
  origin: "*",
  method: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const io = new Server(server, { cors: corsOptions });

ptyProcess.onData((data: any) => {
  // process.stdout.write(data);
  io.emit("terminal:data", data);
  console.log("pty output", data);
});

io.on("connection", (socket) => {
  console.log("connection established");
  socket.on("terminal:write", (data) => {
    ptyProcess.write(data);
    console.log("write", data);
  });

  socket.emit("terminal:data", "");
});

// io.on("connection", (socket) => {
//   // console.log("connection established");
//   socket.on("terminal:data", (data) => {
//     // ptyProcess.write(data + "\n");
//     console.log("cmd output", data);
//   });
// });

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(signInCheck);

app.use("/api/user", userRouter);
app.use("/api/container", containerRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("server is running, home page");
});

server.listen(PORT, () => {
  console.log("server running on port", PORT);
});
