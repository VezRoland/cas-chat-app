import { Server } from "socket.io";
import { prisma } from "../prisma/prisma";
import { z } from "zod";

const createMessageSchema = z.object({
  userId: z.string().nonempty(),
  conversationId: z.string().nonempty(),
  content: z.string().nonempty(),
});

module.exports = (io: any, socket: Server) => {
  const createMessage = async (message: any) => {
    const { data, error } = createMessageSchema.safeParse(message);
    if (error) return;

    try {
      const message = await prisma.conversationMessage.create({
        data: {
          conversationId: data.conversationId,
          userId: data.userId,
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

      io.emit("message:create", message);
    } catch (error) {
      return;
    }
  };

  socket.on("message:create", createMessage);
};
