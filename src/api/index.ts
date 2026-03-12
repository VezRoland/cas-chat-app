import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { db } from '../db';
import { user } from '../db/schema';
import { eq } from 'drizzle-orm';

import authRoute from './routers/authRouter'

const PORT = 3000;
const app = express();

passport.use(
  new LocalStrategy(async (email, password, cb) => {
    const authUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email) && eq(user.password, password));

    console.log(authUser);

    //return cb(null, false, { message: 'Incorrect username or password.' });
    return cb(null, {});
  }),
);

passport.serializeUser((user, cb) => {
  process.nextTick(() => cb(null, {}));
});

passport.deserializeUser((user: Express.User, cb) => {
  process.nextTick(() => cb(null, user));
});

app.use(express.json())

app.use(
  session({
    secret: process.env['EXPRESS_SESSION_SECRET']!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  }),
);

app.use('/auth', authRoute)

app.get('/', (req, res) => res.json({ message: 'Hello World!' }));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
