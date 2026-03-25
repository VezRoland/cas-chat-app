import { Server, Socket } from "socket.io";
import { prisma } from "../prisma/prisma";
import { z } from "zod";

const handler = (io: Server, socket: Socket) => {
  const selectConversation = async (id: string) => {
    if (!id) return;
    socket.rooms.forEach((room) => {
      if (room !== socket.id) socket.leave(room);
    });

    socket.join(id);
    console.log(`${socket.data.user.username} selected room: ${id}`);
  };

  const sendMessage = async (data: { id: string; content: string }) => {
    try {
      const message = await prisma.conversationMessage.create({
        data: {
          conversationId: data.id,
          userId: socket.data.user.id,
          content: data.content,
        },
        select: {
          id: true,
          conversationId: true,
          content: true,
          user: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
            },
          },
          createdAt: true,
          editedAt: true,
        },
      });

      io.emit("message:new", message);
    } catch (error) {
      return;
    }
  };

  socket.on("message:send", sendMessage);
  socket.on("conversation:select", selectConversation);
};

export default handler;
