import { prisma } from "../prisma/prisma";

export async function isAuthenticated(sessionId?: string) {
  if (!sessionId) return null;

  try {
    const userSession = await prisma.userSession.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!userSession) return null;

    return userSession.user;
  } catch (error) {
    throw error;
  }
}