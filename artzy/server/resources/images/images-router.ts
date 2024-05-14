import express from "express";
import { isLoggedIn } from "../users/user-middlewares";
import { getImage, uploadImage } from "./images-handler";

export const imagesRouter = express.Router();

imagesRouter.get("/:id", getImage);
imagesRouter.post("/", isLoggedIn, uploadImage);
// imagesRouter.delete("/:id", deleteUser);
