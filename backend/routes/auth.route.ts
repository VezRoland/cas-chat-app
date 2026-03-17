import { NextFunction, Request, Response, Router } from "express";
import { emailPasswordAuth, isGuest, isSignedIn } from "../auth.middleware";

import { prisma } from "../prisma/prisma";
import bcrypt from "bcrypt";

import { z } from "zod";

const router = Router();

router.get("/user", isSignedIn, (req: Request, res: Response) => {
  res.json(req.user);
});

router.post(
  "/signin",
  isGuest,
  emailPasswordAuth,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  },
);

const signUpBody = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  username: z.string().nonempty(),
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});

router.post(
  "/signup",
  isGuest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { data, error } = signUpBody.safeParse(req.body);
    if (error) return res.sendStatus(400);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      await prisma.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          profilePicture: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=random`,
          credentials: {
            create: { provider: "EMAIL_PASSWORD", identifier: hashedPassword },
          },
        },
      });

      return res.sendStatus(200);
    } catch (error) {
      return next(error);
    }
  },
);

router.post(
  "/signout",
  isSignedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.userSession.delete({
        where: { id: req.cookies.sessionId },
      });

      res.clearCookie("sessionId");
      return res.sendStatus(200);
    } catch (error) {
      return next(error);
    }
  },
);

export default router;
