import argon2 from "argon2";
import { Request, Response } from "express";
import "express-async-errors";
import { UserModel } from "./users-model";

export async function getAllUsers(req: Request, res: Response) {
  if (!req.session?.isAdmin) {
    return res
      .status(403)
      .json({ error: "Only administrators can access this resource." });
  }
  try {
    const users = await UserModel.find({}).lean().exec();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
}

export async function getLoggedInUser(req: Request, res: Response) {
  if (req.session?.username) {
    const user = await UserModel.findOne({ username: req.session.username });
    return res.status(200).json({
      _id: user?._id,
      username: user?.username,
      isAdmin: user?.isAdmin,
    })
} else {
  console.log(req.session + "should be null, but why?")
    return res.status(401).json({ error: "You are not logged in." });
  }
}

export async function registerUser(req: Request, res: Response) {
  const { username, password, isAdmin } = req.body;
  const usernameAlreadyExist = await UserModel.findOne({ username });

  const errors: { [key: string]: string } = {};
  if (!username) {
    return res.status(400).json((errors.username = "Username is required"));
  }
  if (!password) {
    return res.status(400).json((errors.password = "Password is required"));
  }
  if (usernameAlreadyExist) {
    return res
      .status(409)
      .json((errors.username = "Username is already taken."));
  }
  try {
    const user = await UserModel.create({
      username,
      password,
      isAdmin: isAdmin || false,
    });

    return res
      .status(201)
      .json({ _id: user._id, username: user.username, isAdmin: user.isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
}

export async function loginUser(req: Request, res: Response) {
  //håller koll på om användaren är inloggad
  let usersIsLoggedIn: boolean = false;
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username }).select("+password");

    if (!user) {
      res.status(401).json("User does not exist.");
      return;
    }
    if (user.username !== username) {
      res.status(401).json("Password or username is incorrect");
      return;
    }
    if (!(await argon2.verify(user.password, password))) {
      res.status(401).json("Password or username is incorrect.");
      return;
    }
    if (user) {
      if (req.session) {
        req.session!.username = user.username;
        req.session!.userId = user._id;
        req.session!.isAdmin = user.isAdmin || false;
      }
    }

    const response = res.status(200).json({
      message: "You are logged in",
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    });
    usersIsLoggedIn = true;
    return response;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    if (req.session?.username) {
      req.session = null;
      console.log(req.session + "should be null")
      res.status(204).json({ message: "You are logged out." });
    } else {
      console.log(req.session + "should be null cuz not logged in from start")
      res.status(401).json({ error: "You are not logged in." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export async function updateUser(req: Request, res: Response) {
  const userId = req.params.id;
  try {
    let user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json("Can't find user" + userId);
    }

    await user.updateOne({ isAdmin: req.body.isAdmin });
    const updatedUser = await UserModel.findById(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json("Something went wrong.");
  }
}

export async function deleteUser(req: Request, res: Response) {
  const userId = req.params.id;
  const deleteResult = await UserModel.deleteOne({ _id: userId });
  if (deleteResult.deletedCount === 0) {
    res.status(404).json({ error: "There is no user with this ID." });
  }
  res.status(204).send();
}
