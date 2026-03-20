import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";

import conversationsSocket from "./routes/conversations.socket.route";

import authRoute from "./routes/auth.route";
import usersRoute from "./routes/users.route";
import conversationsRoute from "./routes/conversations.route";

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_ORIGIN, credentials: true },
});

// Socket
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  conversationsSocket(io, socket);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () =>
  console.log(`Socket.IO server started on port ${PORT}`),
);

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

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
