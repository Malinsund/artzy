import cookieSession from "cookie-session";
import cors from "cors";
import express from "express";
import "express-async-errors";
import { imagesRouter } from "../resources/images/images-router";
import { postsRouter } from "../resources/posts/posts-router";
import { userRouter } from "../resources/users/users-router";

export const app = express();

app.use(cors());

// SKRIV DIN SERVERKOD HÄR!
app.use(express.json());

// KAKA
app.use(
  cookieSession({
    name: "Artzy",
    secret: process.env.SECRET || "elsamalin", //process.env.SECRET,
    maxAge:  100000 * 10,
    httpOnly: true,
  })
);

//router till users och posts
app.use("/api/users", userRouter);
app.use("/api/posts", postsRouter);
app.use("/api/images", imagesRouter);
