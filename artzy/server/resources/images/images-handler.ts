import busboy from "busboy";
import { Request, Response } from "express";
import { Types } from "mongoose";
import sharp from "sharp";
import { getImageBucket } from "./images-model";

export const getImage = async (req: Request, res: Response) => {
  const id = new Types.ObjectId(req.params.id);
  const imageBucket = getImageBucket();
  const imageData = await imageBucket.find({ _id: id }).next();

  if (!imageData) return res.status(404).send("Image not found");
  res.setHeader("Content-Type", imageData.metadata?.contentType);
  imageBucket.openDownloadStream(id).pipe(res);
};

export const uploadImage = (req: Request, res: Response): Promise<any> => {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers });

    req.pipe(bb);

    bb.on("file", (_, incomingStream, info) => {
      const uploadStream = getImageBucket().openUploadStream(info.filename, {
        metadata: {
          contentType: info.mimeType,
        },
      });

      const transformer = sharp().resize(500, 500, { fit: "cover" });

      incomingStream.pipe(transformer).pipe(uploadStream);

      uploadStream.on("finish", async () => {
        const imageId = uploadStream.id.toString();
        res.status(201).json(imageId);
      });

      uploadStream.on("error", (error) => {
        console.error(error);
        res.status(500).json({ error: error.message });
        reject(error);
      });

      // TODO: Upload to gridfs
    });
  });
};

//gör sen
/* export async function deleteImage(req: Request, res: Response) {
  const userId = req.params.id;
  const deleteResult = await UserModel.deleteOne({ _id: userId });
  if (deleteResult.deletedCount === 0) {
    res.status(404).json({ error: "There is no user with this ID." });
  }
  res.status(204).send();
} */
