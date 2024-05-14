import mongoose from "mongoose";

export const getImageBucket = () =>
  new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "images",
  });
