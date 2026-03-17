import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));
app.use(cookieParser());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.sendStatus(500);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
