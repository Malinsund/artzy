import type { Request, Response } from "express";
import { MongooseError } from "mongoose";
import { UserModel } from "../users/users-model";
import { PostModel, UpdatePostSchema } from "./posts-model";

export async function getAllPosts(req: Request, res: Response) {
  const posts = await PostModel.find({}).populate("author", "username");
  res.status(200).json(posts);
}

export async function createPost(req: Request, res: Response) {
  console.log("sessions username:", req.session?.username);
  if (!req.session?.username) {
    res.status(401).json({ error: "You must be logged in to create a post." });
    return;
  }

  try {
    const username = req.session.username;
    const user = await UserModel.findOne({ username });

    if (!user) {
      res.status(401).json({ error: "User does not exist." });
      return;
    }

    const newPost = {
      author: user._id,
      ...req.body
    };

    const post = await PostModel.create(newPost);

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    if (error instanceof MongooseError) {
      res.status(400).json(error.message);
      return;
    }
    res.status(500).json({ error: "Something went wrong." });
  }
}

export async function getPostById(req: Request, res: Response) {
  try {
    const postId = req.params.id;
    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(404).json(`${postId} not found`);
      return;
    }

    const author = await UserModel.findById(post.author)!;
    if (!author) {
      res.status(404).json("Author not found");
      return;
    }

    const populatedPost = { ...post.toJSON(), authorname: author.username, author: author._id };
    return res.status(200).json(populatedPost);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
}

export async function updatePost(req: Request, res: Response) {
  console.log("här är en logg tjoho")
  if (!req.session?.username) {
   return res.status(401).json({ error: "You must be logged in to update a post"});
  
  }

  const postId = req.params.id;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json(postId + " not found");
      
    }

    if (post.author.toString() !== req.session.userId && !req.session.isAdmin) {
      return res.status(403).json("You are not allowed to update this post.");
      
    }

    const result = UpdatePostSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error.message);
    }

    const { author, title, content, listedPrice, image } = req.body;

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { author, title, content, listedPrice, image },
      { new: true }
    );
    
    if (!updatedPost) {
      return res.status(500).json("Failed to update post.");
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    if (error instanceof MongooseError) {
       return res.status(400).json(error.message);

    }
    return res.status(500).json("Something went wrong.");
  }
}

export async function deletePost(req: Request, res: Response) {
  if (!req.session?.username) {
    res.status(401).json({ error: "You must be logged in to delete a post." });
    return;
  }

  const postId = req.params.id;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(404).json(postId + " not found");
      return;
    }
    if (!req.session.isAdmin) {
      if (post.author.toString() !== req.session.userId) {
        res.status(403).json("You are not allowed to delete this post.");
        return;
      }
    }
    const deleteResult = await PostModel.deleteOne({ _id: postId });
    if (deleteResult.deletedCount === 0) {
      res.status(404).json(postId + " not found");
      return;
    }
    res.status(204).json("Post is deleted.");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
}
