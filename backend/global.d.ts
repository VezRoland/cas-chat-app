import { User } from "./generated/prisma/client";

declare global {
  namespace Express {
    export interface Request {
      cookies: {
        sessionId?: string;
      };
      user?: User;
    }
  }
}
