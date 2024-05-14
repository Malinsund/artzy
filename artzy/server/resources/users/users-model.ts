import argon2 from "argon2";
import { Schema, model, type InferSchemaType } from "mongoose";

const UserSchema = new Schema({
  //ref gör att vi hittar rätt author till boken eller ja rätt users till posten för oss
  username: { type: String, required: true }, //schematyp pga relation (så som vi vill ha på post och user?)
  password: { type: String, required: true, select: false },
  isAdmin: { type: Boolean, default: false },
}
);

UserSchema.pre("save", async function (next) {
  const user = this as User;

  user.password = await argon2.hash(user.password);
  next();
});

export type User = InferSchemaType<typeof UserSchema>;
export const UserModel = model<User>("User", UserSchema);
