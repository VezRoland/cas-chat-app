import { Router } from 'express';
import { object, string } from 'zod';
import { db } from '../../db';
import { message, user } from '../../db/schema';
import bcrypt from 'bcrypt';
import { DrizzleQueryError } from 'drizzle-orm';
import { DatabaseError } from 'pg';

const router = Router();

const userSchema = object({
  firstName: string(),
  lastName: string(),
  username: string(),
  email: string(),
  password: string(),
});

router.post('/signup/password', async (req, res) => {
  const parsedUser = userSchema.safeParse(req.body);

  if (parsedUser.error) {
    res.status(400).json({ message: 'Invalid data' });
    return;
  }

  const hashedPassword = await bcrypt.hash(parsedUser.data.password, 10);

  try {
    await db.insert(user).values({
      firstName: parsedUser.data.firstName,
      lastName: parsedUser.data.lastName,
      username: parsedUser.data.username,
      email: parsedUser.data.email,
      password: hashedPassword,
    });
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      if (error.cause instanceof DatabaseError) {
        if (error.cause.code === '23505') {
          res.status(400).json({ message: 'User already exists with this email address' });
          return;
        }
      }
    } else {
      res.status(500).json({ message: 'Unexpected error' });
      return;
    }
  }

  res.json({ message: 'Hello World!' });
});

export default router;
