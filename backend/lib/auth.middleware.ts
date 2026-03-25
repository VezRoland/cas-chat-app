import type { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import { isAuthenticated } from "./auth";

export async function isGuest(req: Request, res: Response, next: NextFunction) {
  try {
    if (await isAuthenticated(req.cookies.sessionId)) {
      return res.status(400).json({ message: "Already signed in" });
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

export async function isSignedIn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await isAuthenticated(req.cookies.sessionId);
    if (user) {
      req.user = user;
      return next();
    }
    return res.status(403).json({ message: "Unauthorized" });;
  } catch (error) {
    return next(error);
  }
}

const emailPasswordBody = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});

export async function emailPasswordAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { data, error } = emailPasswordBody.safeParse(req.body);
  if (error) return next(error);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: {
      credentials: {
        where: { provider: "EMAIL_PASSWORD" },
        select: { identifier: true },
      },
    },
  });

  if (!user || !user.credentials[0]) return res.sendStatus(403);

  const doPasswordsMatch = await bcrypt.compare(
    data.password,
    user.credentials[0].identifier,
  );

  if (!doPasswordsMatch) return res.sendStatus(403);

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const session = await prisma.userSession.create({
    data: {
      userId: user.id,
      expiresAt,
    },
  });

  req.user = user;

  res.cookie("sessionId", session.id, {
    httpOnly: true,
    expires: expiresAt,
  });

  return next();
}
