import { NextFunction, Request, Response } from "express";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.username) {
    res.status(401).json("You're not logged in.");
    console.log("User is not logged in.");
    return;
  }
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.isAdmin) {
    next();
  } else {
    res.status(403).json("You are not authorized to access this resource."); 
  }
};
