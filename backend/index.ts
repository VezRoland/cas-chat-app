import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as cookie from "cookie"

import conversationsSocket from "./routes/conversations.socket.route";

import authRoute from "./routes/auth.route";
import usersRoute from "./routes/users.route";
import conversationsRoute from "./routes/conversations.route";
import { isAuthenticated } from "./lib/auth";

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_ORIGIN, credentials: true },
});

// Socket
io.use(async (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) return next(new Error("No cookies found"));

    const cookies = cookie.parse(cookieHeader);
    const sessionId = cookies.sessionId;

    const user = await isAuthenticated(sessionId);

    socket.data.user = user;
    socket.data.sessionId = sessionId;

    next();
  } catch (error) {
    next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  conversationsSocket(io, socket);
});

// REST API
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/conversations", conversationsRoute);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.sendStatus(500);
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
