import { Schema, SchemaTypes, model, type InferSchemaType } from "mongoose";
import { z } from "zod";

const PostSchema = new Schema({

  author: { type: SchemaTypes.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  listedPrice: { type: Number, required: false },
  image: { type: SchemaTypes.ObjectId, required: false },
  createdAt: { type: Date, default: new Date() },

},
{
  toJSON: {
    virtuals: true,
  },
}
);

PostSchema.virtual("imageUrl").get(function () {
  return "/api/images/" + this.image;
});

//För PUT
export const UpdatePostSchema = z.object({
  _id: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
  author: z.string().min(1),
  listedPrice: z.number().optional(),
  image: z.string().optional(),
});

export type Post = InferSchemaType<typeof PostSchema>;
export const PostModel = model<Post>("Post", PostSchema);