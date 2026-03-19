import { isSignedIn } from "../auth.middleware";
import { prisma } from "../prisma/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

import { NextFunction, Request, Response, Router } from "express";

const router = Router();

// Gets the limited data of all the users
router.get(
  "/",
  isSignedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({
        where: { id: { not: req.user!.id } },
        select: {
          id: true,
          username: true,
          profilePicture: true,
          createdAt: true,
        },
      });

      return res.json(users);
    } catch (error) {
      return next(error);
    }
  },
);

// Gets the data of the signed in user
router.get(
  "/me",
  isSignedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user!.id,
        },
      });

      return res.json(user);
    } catch (error) {
      return next(error);
    }
  },
);

const editUserBody = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  profilePicture: z.string().optional(),
  password: z.string().optional(),
});

// Updates the data of the signed in user
router.patch(
  "/me",
  isSignedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, error } = editUserBody.safeParse(req.body);
      if (error) return res.sendStatus(400);

      const { password, ...profileData } = data;

      const user = await prisma.user.update({
        where: {
          id: req.user!.id,
        },
        data: {
          ...profileData,
          ...(password && {
            credentials: {
              updateMany: {
                where: {
                  userId: req.user!.id,
                  provider: "EMAIL_PASSWORD",
                },
                data: {
                  identifier: await bcrypt.hash(password, 10),
                },
              },
            },
          }),
        },
      });

      return res.json(user);
    } catch (error) {
      return next(error);
    }
  },
);

export default router;
