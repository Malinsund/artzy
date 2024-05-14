import express from "express";
import { isLoggedIn } from "../users/user-middlewares";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "./posts-handler";

export const postsRouter = express.Router();

postsRouter.get("/", getAllPosts);
postsRouter.post("/", isLoggedIn, createPost);
postsRouter.delete("/:id", isLoggedIn, deletePost);
postsRouter.put("/:id", isLoggedIn, updatePost);
postsRouter.get("/:id", getPostById);
