import express from "express";
import { isAdmin, isLoggedIn } from "./user-middlewares";
import {
  deleteUser,
  getAllUsers,
  getLoggedInUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "./users-handler";

export const userRouter = express.Router();

userRouter.get("/", isLoggedIn, isAdmin, getAllUsers);
userRouter.get("/auth", getLoggedInUser);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", isLoggedIn, logoutUser);
userRouter.put("/:id", isAdmin, updateUser);
userRouter.delete("/:id", deleteUser);
