import { isSignedIn } from "../lib/auth.middleware";
import { prisma } from "../prisma/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

import { NextFunction, Request, Response, Router } from "express";

const router = Router();

// --- Routes for conversations ---

const newConversationBody = z.object({
  title: z.string().nonempty(),
  isPublic: z.boolean().optional().default(false),
  password: z.string().optional(),
  participants: z.string().array().nonempty(),
});

// Creates a new conversation
router.post(
  "/",
  isSignedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    const { data, error } = newConversationBody.safeParse(req.body);
    if (error) return res.status(400).json({ message: "Invalid data" });

    try {
      const conversation = await prisma.conversation.create({
        data: {
          title: data.title,
          isPublic: data.isPublic,
          password: data.password,
          users: {
            createMany: {
              data: [
                { userId: req.user!.id, isOwner: true },
                ...data.participants.map((p) => ({ userId: p })),
              ],
            },
          },
        },
        omit: {
          password: true,
        },
      });

      return res.status(201).json(conversation);
    } catch (error) {
      return next(error);
    }
  },
);

const joinConversationBody = z
  .object({
    password: z.string().optional(),
  })
  .optional();

// Join a specific conversation
router.post(
  "/:id/join",
  isSignedIn,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { data, error } = joinConversationBody.safeParse(req.body);
    if (error) return res.status(400).json({ message: "Invalid data" });

    try {
      const conversation = await prisma.conversation.findUnique({
        where: { id: req.params.id, isPublic: true },
      });

      if (conversation?.password) {
        if (!data?.password) {
          return res
            .status(403)
            .json({ message: "Password is needed to join this conversation" });
        } else {
          const doPasswordsMatch = await bcrypt.compare(
            data.password,
            conversation.password,
          );

          if (!doPasswordsMatch)
            return res.status(403).json({ message: "Invalid password" });
        }
      }

      await prisma.conversationUser.create({
        data: {
          conversationId: req.params.id,
          userId: req.user!.id,
        },
      });

      return res
        .status(201)
        .json({ message: "Successfully joined the conversation." });
    } catch (error) {
      return next(error);
    }
  },
);

// Leave a specific conversation
router.post(
  "/:id/leave",
  isSignedIn,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await prisma.conversationUser.deleteMany({
        where: {
          conversationId: req.params.id,
          userId: req.user?.id,
        },
      });

      return res.json({ message: "Successfully left the conversation." });
    } catch (error) {
      return next(error);
    }
  },
);

// Returns previews of all the conversations the user is part of
router.get(
  "/",
  isSignedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          users: {
            some: {
              userId: req.user!.id,
            },
          },
        },
        select: {
          id: true,
          title: true,
          messages: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              editedAt: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  profilePicture: true,
                },
              },
            },
            orderBy: { createdAt: "asc" },
            take: 1,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return res.json(conversations);
    } catch (error) {
      return next(error);
    }
  },
);

// Returns all the public conversations the signed in user isn't part of
router.get(
  "/discover",
  isSignedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          isPublic: true,
          users: {
            none: {
              userId: req.user!.id,
            },
          },
        },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
        omit: {
          isPublic: true,
          password: true,
        },
      });

      return res.json(conversations);
    } catch (error) {
      return next(error);
    }
  },
);

// Returns a specific conversation the user is part of
router.get(
  "/:id",
  isSignedIn,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: req.params.id,
          users: {
            some: {
              userId: req.user!.id,
            },
          },
        },
        include: {
          _count: {
            select: {
              users: true,
              messages: true,
            },
          },
        },
        omit: {
          password: true,
        },
      });

      return res.json(conversation);
    } catch (error) {
      return next(error);
    }
  },
);

// Delete a specific conversation the user is the owner of
router.delete(
  "/:id",
  isSignedIn,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await prisma.conversation.deleteMany({
        where: {
          id: req.params.id,
          users: {
            some: {
              userId: req.user?.id,
              isOwner: true,
            },
          },
        },
      });

      res.json({ message: "Successfully deleted the conversation." });
    } catch (error) {
      return next(error);
    }
  },
);

// Returns all the participants of a specific conversation the user is part of
router.get(
  "/:id/users",
  isSignedIn,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.conversationUser.findMany({
        where: {
          conversationId: req.params.id,
          userId: {
            not: req.user!.id,
          },
        },
        select: {
          user: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
            },
          },
          nickname: true,
          isOwner: true,
          createdAt: true,
        },
      });

      return res.json(
        users.map((u) => ({
          id: u.user.id,
          username: u.user.username,
          nickname: u.nickname,
          isOwner: u.isOwner,
          createdAt: u.createdAt,
        })),
      );
    } catch (error) {
      return next(error);
    }
  },
);

// Returns the current user of a specific conversation based on the cookie
router.get(
  "/:id/users/me",
  isSignedIn,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.conversationUser.findMany({
        where: {
          conversationId: req.params.id,
          userId: req.user?.id,
        },
        select: {
          user: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
            },
          },
          nickname: true,
          isOwner: true,
          createdAt: true,
        },
      });

      return res.json({
        id: users[0].user.id,
        username: users[0].user.username,
        nickname: users[0].nickname,
        isOwner: users[0].isOwner,
        createdAt: users[0].createdAt,
      });
    } catch (error) {
      return next(error);
    }
  },
);

// --- Routes for messages ---

const newMessageBody = z.object({
  content: z.string().nonempty(),
});

// Creates a new message in a specific conversation the user is part of
router.post(
  "/:id/message",
  isSignedIn,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { data, error } = newMessageBody.safeParse(req.body);
    if (error) return res.sendStatus(400);

    try {
      const message = await prisma.conversationMessage.create({
        data: {
          conversationId: req.params.id,
          userId: req.user!.id,
          content: data.content,
        },
        select: {
          id: true,
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

      return res.status(201).json(message);
    } catch (error) {
      return next(error);
    }
  },
);

// Gets all the messages in a specific conversation the user is part of
router.get(
  "/:id/messages",
  isSignedIn,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 0;

    try {
      const messages = await prisma.conversationMessage.findMany({
        where: {
          conversationId: req.params.id,
        },
        select: {
          id: true,
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
        orderBy: {
          createdAt: "asc",
        },
      });

      return res.json(messages);
    } catch (error) {
      return next(error);
    }
  },
);

export default router;
